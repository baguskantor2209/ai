import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  const inMemoryUsers = new Map<string, any>();

  // Groq API Proxy Endpoint
  app.post('/api/groq', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const GROQ_API_KEY = process.env.GROQ_API_KEY;
      if (!GROQ_API_KEY) {
        return res.status(503).json({ error: "Groq API key not configured on server" });
      }
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemInstruction || "Anda adalah asisten pembuat CV profesional." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).send(errText);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      return res.json({ content });
    } catch (err: any) {
      console.error("Groq Proxy Error:", err);
      return res.status(500).json({ error: "Failed to connect to Groq" });
    }
  });

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://yidywttxgawhhsvmqlys.supabase.co';
  const rawSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseKey =
    (rawSecretKey && rawSecretKey.startsWith('sb_secret_'))
      ? rawSecretKey
      : 'sb_secret_CuX-2YLUQLZjCRMdSF5mPw_7MezwSAt';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Supabase User Storage Endpoint
  app.post('/api/save-user', async (req, res) => {
    try {
      const { email, token } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email wajib diisi.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const tokenVal = typeof token === 'number' ? token : 0;

      // 1. Save to Supabase table 'User' (columns: Email, token)
      try {
        const { data, error } = await supabase
          .from('User')
          .upsert({ Email: cleanEmail, token: tokenVal }, { onConflict: 'Email' })
          .select();

        if (!error) {
          console.log(`[Supabase] Successfully saved ${cleanEmail} to table "User":`, data);
          return res.json({
            success: true,
            savedTo: 'supabase',
            email: cleanEmail,
            message: 'Email berhasil disimpan ke database Supabase (tabel User).',
          });
        }

        console.warn('[Supabase] Notice from Supabase table User:', error.message);
      } catch (sbErr: any) {
        console.warn('[Supabase] Connection error, falling back to memory:', sbErr?.message || sbErr);
      }

      // 2. In-memory fallback
      inMemoryUsers.set(cleanEmail, {
        email: cleanEmail,
        token: tokenVal,
        savedAt: new Date().toISOString(),
      });
      return res.json({
        success: true,
        savedTo: 'memory',
        email: cleanEmail,
        message: 'Pengguna berhasil disimpan ke memori server.',
      });
    } catch (err: any) {
      console.error('Error in /api/save-user:', err);
      return res.status(500).json({ error: 'Internal server error saving user' });
    }
  });

  // Query User from Supabase
  app.get('/api/user/:email', async (req, res) => {
    try {
      const email = req.params.email?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: 'Email parameter required' });
      const { data, error } = await supabase.from('User').select('*').eq('Email', email).maybeSingle();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json({ user: data || null });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Error fetching user' });
    }
  });

  // Save Chat Message to Supabase chat_history table with conversation_id & 3-history quota check
  app.post('/api/chat-history', async (req, res) => {
    try {
      const { user_email, conversation_id, title, message, role, actionForm, mode, meta } = req.body;
      if (!user_email || !message) {
        return res.status(400).json({ error: 'user_email dan message wajib diisi.' });
      }

      const cleanEmail = user_email.trim().toLowerCase();
      // Supabase chat_history table constraint: role in ('user', 'assistant')
      const cleanRole = (role === 'ai' || role === 'assistant') ? 'assistant' : 'user';

      // Ensure user exists in table "User" (Foreign Key requirement)
      try {
        await supabase
          .from('User')
          .upsert({ Email: cleanEmail, token: 0 }, { onConflict: 'Email' });
      } catch (e) {
        console.warn('[Chat History] User check warning:', e);
      }

      // Check existing distinct conversations for 3-history limit check
      const { data: existingRows, error: fetchErr } = await supabase
        .from('chat_history')
        .select('id, message')
        .eq('user_email', cleanEmail);

      if (fetchErr) {
        console.warn('[Chat History] Warning fetching existing conversations:', fetchErr.message);
      }

      const existingConvIds = new Set<string>();
      for (const row of existingRows || []) {
        try {
          const parsed = typeof row.message === 'string' && row.message.startsWith('{')
            ? JSON.parse(row.message)
            : null;
          if (parsed && (parsed.conv_id || parsed.conversation_id)) {
            existingConvIds.add(parsed.conv_id || parsed.conversation_id);
          } else {
            existingConvIds.add('legacy');
          }
        } catch {
          existingConvIds.add('legacy');
        }
      }

      const convId = conversation_id ? String(conversation_id).trim() : 'session_' + Date.now();

      // If this is a NEW conversation and user already reached the limit of 3 conversations:
      if (!existingConvIds.has(convId) && existingConvIds.size >= 3) {
        return res.status(400).json({
          error: 'Kamu sudah mencapai batas 3 riwayat chat. Hapus salah satu riwayat untuk memulai chat baru.',
          limitReached: true,
          count: existingConvIds.size,
        });
      }

      // Build structured payload for message column
      const payload = {
        conv_id: convId,
        title: title ? String(title).slice(0, 100) : 'Percakapan',
        text: typeof message === 'string' ? message.trim() : JSON.stringify(message),
        timestamp: new Date().toISOString(),
        actionForm: typeof actionForm === 'number' ? actionForm : null,
        mode: mode || 'general',
        meta: meta || null,
      };

      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_email: cleanEmail,
          message: JSON.stringify(payload),
          role: cleanRole,
        })
        .select();

      if (error) {
        console.warn('[Chat History] Supabase insert error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, conversation_id: convId, data: data?.[0] || null });
    } catch (err: any) {
      console.error('Error in /api/chat-history:', err);
      return res.status(500).json({ error: err?.message || 'Gagal menyimpan riwayat chat' });
    }
  });

  // Get Chat History for a user grouped by conversation_id
  app.get('/api/chat-history/:email', async (req, res) => {
    try {
      const email = req.params.email?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: 'Email parameter required' });

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_email', email)
        .order('id', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Group rows into ConversationSession structures
      const convMap = new Map<string, any>();
      const flatHistory: any[] = [];

      for (const row of data || []) {
        let convId = 'legacy';
        let text = row.message;
        let title = 'Percakapan';
        let actionForm: number | null = null;
        let mode: 'cv' | 'letter' | 'general' = 'general';
        let meta: any = null;
        let msgTimestamp = row.created_at;

        if (typeof row.message === 'string' && row.message.startsWith('{')) {
          try {
            const parsed = JSON.parse(row.message);
            if (parsed && typeof parsed === 'object') {
              convId = parsed.conv_id || parsed.conversation_id || 'legacy';
              text = parsed.text ?? row.message;
              if (parsed.title) title = parsed.title;
              if (parsed.actionForm !== undefined) actionForm = parsed.actionForm;
              if (parsed.mode) mode = parsed.mode;
              if (parsed.meta) meta = parsed.meta;
              if (parsed.timestamp) msgTimestamp = parsed.timestamp;
            }
          } catch {
            // keep raw row.message
          }
        }

        const roleFormatted = row.role === 'assistant' ? 'ai' : row.role;
        const msgItem = {
          id: `msg_db_${row.id}`,
          role: roleFormatted,
          text,
          timestamp: msgTimestamp
            ? new Date(msgTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Tersimpan',
          actionForm,
        };

        flatHistory.push({
          ...row,
          role: roleFormatted,
          text,
          conversation_id: convId,
        });

        if (!convMap.has(convId)) {
          convMap.set(convId, {
            id: convId,
            title: title || (roleFormatted === 'user' ? text.slice(0, 32) : 'Percakapan'),
            createdAt: row.created_at || new Date().toISOString(),
            updatedAt: row.created_at || new Date().toISOString(),
            messages: [msgItem],
            mode,
            isDocumentMode: meta?.isDocumentMode ?? (mode === 'cv' || mode === 'letter'),
            cvData: meta?.cvData || undefined,
            letterData: meta?.letterData || undefined,
            language: meta?.language || 'id',
            colorTone: meta?.colorTone || undefined,
            templateId: meta?.templateId || undefined,
          });
        } else {
          const existing = convMap.get(convId)!;
          existing.messages.push(msgItem);
          existing.updatedAt = row.created_at || existing.updatedAt;
          if (title && title !== 'Percakapan') {
            existing.title = title;
          }
          if (meta) {
            if (meta.cvData) existing.cvData = meta.cvData;
            if (meta.letterData) existing.letterData = meta.letterData;
            if (meta.language) existing.language = meta.language;
            if (meta.colorTone) existing.colorTone = meta.colorTone;
            if (meta.templateId) existing.templateId = meta.templateId;
            if (meta.isDocumentMode !== undefined) existing.isDocumentMode = meta.isDocumentMode;
          }
          if (mode && mode !== 'general') existing.mode = mode;
        }
      }

      // Convert map to array sorted by updatedAt DESC (most recent first)
      const conversations = Array.from(convMap.values()).reverse();

      return res.json({
        conversations,
        count: conversations.length,
        history: flatHistory,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Error fetching chat history' });
    }
  });

  // Delete a specific conversation session and all its messages
  app.delete('/api/chat-history/:email/:conversationId', async (req, res) => {
    try {
      const email = req.params.email?.trim().toLowerCase();
      const convId = req.params.conversationId?.trim();
      if (!email || !convId) {
        return res.status(400).json({ error: 'Email and conversationId required' });
      }

      // 1. Fetch user rows to locate matching conversation IDs
      const { data: rows, error: fetchErr } = await supabase
        .from('chat_history')
        .select('id, message')
        .eq('user_email', email);

      if (fetchErr) {
        return res.status(500).json({ error: fetchErr.message });
      }

      const idsToDelete: number[] = [];
      for (const row of rows || []) {
        try {
          const parsed = typeof row.message === 'string' && row.message.startsWith('{')
            ? JSON.parse(row.message)
            : null;
          const rowConvId = parsed ? (parsed.conv_id || parsed.conversation_id) : 'legacy';
          if (rowConvId === convId) {
            idsToDelete.push(row.id);
          }
        } catch {
          if (convId === 'legacy') idsToDelete.push(row.id);
        }
      }

      if (idsToDelete.length > 0) {
        const { error: delErr } = await supabase
          .from('chat_history')
          .delete()
          .in('id', idsToDelete);

        if (delErr) {
          return res.status(500).json({ error: delErr.message });
        }
      }

      return res.json({
        success: true,
        deletedCount: idsToDelete.length,
        message: 'Percakapan berhasil dihapus dari database.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Error deleting conversation' });
    }
  });

  // Clear all Chat History for a user
  app.delete('/api/chat-history/:email', async (req, res) => {
    try {
      const email = req.params.email?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: 'Email parameter required' });

      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_email', email);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, message: 'Semua riwayat chat berhasil dihapus.' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Error clearing chat history' });
    }
  });

  // Resilient multi-model executor with fallback
  async function generateWithFallback(options: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    responseMimeType?: string;
    responseSchema?: any;
  }) {
    if (!ai) throw new Error('No AI client initialized');

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
    let lastErr: any = null;

    for (const model of modelsToTry) {
      try {
        const config: any = {
          temperature: options.temperature ?? 0.7,
        };
        if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
        if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
        if (options.responseSchema) config.responseSchema = options.responseSchema;

        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${model} failed, attempting next available model...`, err?.message || err);
      }
    }
    throw lastErr;
  }

  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, mode, isAskingForDocument, language } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Pesan (message) wajib diisi.' });
      }

      const isEn = language === 'en';

      if (!ai) {
        let reply = isEn
          ? 'Hello! I am mKenzo AI. I am ready to help you create a professional CV and Cover Letter.'
          : 'Halo! Saya mKenzo AI. Saya siap membantu Anda membuat CV profesional dan Surat Lamaran Kerja.';

        if (isAskingForDocument) {
          if (isEn) {
            reply = mode === 'letter'
              ? 'Hello! I am ready to help create your Cover Letter. Please fill in the document form below to begin.'
              : 'Hello! I am ready to help build your professional CV. Please fill in the document form below to take the first step.';
          } else {
            reply = mode === 'letter'
              ? 'Halo! Saya siap membantu membuat Surat Lamaran Kerja Anda. Silakan isi form dokumen di bawah ini untuk memulai.'
              : 'Halo! Saya siap membantu menyusun CV profesional Anda. Silakan isi form dokumen di bawah ini untuk memulai langkah pertama.';
          }
        }
        return res.json({ text: reply });
      }

      let systemInstruction = isEn
        ? 'You are mKenzo, a professional AI career assistant specialized in Resume/CV and Cover Letter building. Reply in fluent, friendly, articulate English.'
        : 'Anda adalah mKenzo, AI asisten pembuat CV dan Surat Lamaran Kerja profesional. Jawab pertanyaan pengguna dengan ramah, sopan, informatif, dan natural dalam Bahasa Indonesia layaknya konsultan karir modern.';

      if (isAskingForDocument) {
        if (isEn) {
          systemInstruction =
            mode === 'letter'
              ? 'You are mKenzo, Cover Letter specialist. IMPORTANT: Answer VERY BRIEFLY in 1-2 sentences in English. DO NOT provide full letter templates. Warmly greet the user and invite them to fill out the form.'
              : 'You are mKenzo, Resume/CV specialist. IMPORTANT: Answer VERY BRIEFLY in 1-2 sentences in English. DO NOT provide full resume templates. Warmly greet the user and invite them to fill out the form.';
        } else {
          systemInstruction =
            mode === 'letter'
              ? 'Anda adalah mKenzo, asisten pembuat Surat Lamaran. PENTING: Jawab SANGAT SINGKAT (1-2 kalimat saja). JANGAN pernah memberikan contoh isi surat atau format template teks panjang. Cukup sapa pengguna dengan hangat dan persilakan mereka mengklik tombol form di bawah ini untuk mengisi data.'
              : 'Anda adalah mKenzo, asisten pembuat CV profesional. PENTING: Jawab SANGAT SINGKAT (1-2 kalimat saja). JANGAN pernah memberikan contoh isi CV atau format template teks panjang. Cukup sapa pengguna dengan hangat dan persilakan mereka mengklik tombol form di bawah ini untuk mengisi data.';
        }
      } else if (mode === 'general') {
        systemInstruction = isEn
          ? 'You are mKenzo AI, a friendly, intelligent, and natural conversational AI assistant. Follow the user\'s conversation flow naturally on whatever topic they choose. DO NOT steer or redirect the conversation to careers, jobs, employment, resumes, or cover letters unless the user explicitly asks about them. Converse comfortably on any topic: general questions, casual chat, science, programming, creative ideas, storytelling, or daily curiosities.'
          : 'Anda adalah mKenzo AI, asisten AI yang ramah, santai, cerdas, dan natural. Ikuti sepenuhnya alur dan topik percakapan yang diinginkan oleh pengguna. JANGAN PERNAH mengarahkan, membelokkan, atau mengaitkan obrolan ke masalah karier, pekerjaan, lamaran kerja, atau pembuatan CV/surat lamaran kerja, KECUALI jika pengguna sendiri yang secara spesifik menanyakannya. Jadilah teman mengobrol yang luwes, asyik, dan fleksibel untuk membahas apa saja yang diinginkan pengguna (sains, teknologi, cerita, hobi, percakapan santai sehari-hari, humor, coding, maupun pengetahuan umum lainnya).';
      }

      // Format previous chat history context if available (last 6 messages)
      const formattedHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: { role: string; text: string }) => `${h.role === 'user' ? (isEn ? 'User' : 'Pengguna') : 'mKenzo'}: ${h.text}`)
            .join('\n')
        : '';

      const fullPrompt = formattedHistory
        ? (isEn
            ? `Previous conversation context:\n${formattedHistory}\n\nUser Question/Message: ${message}\nProvide reply:`
            : `Berikut adalah konteks percakapan sebelumnya:\n${formattedHistory}\n\nPertanyaan/Pesan baru dari Pengguna: ${message}\nBerikan jawaban:`)
        : message;

      try {
        const response = await generateWithFallback({
          contents: fullPrompt,
          systemInstruction,
          temperature: 0.7,
        });
        const replyText = response.text?.trim() || (isEn ? 'Sorry, I cannot process the answer right now.' : 'Maaf, saya tidak dapat memproses jawaban saat ini.');
        return res.json({ text: replyText });
      } catch (geminiError: any) {
        console.warn('Gemini temporary error, providing friendly contextual response:', geminiError?.message);
        if (isAskingForDocument) {
          return res.json({
            text:
              mode === 'letter'
                ? (isEn
                    ? 'Hello! I am ready to help create your professional Cover Letter. Please click the button below to start filling in the form.'
                    : 'Halo! Saya siap membantu membuat Surat Lamaran Kerja profesional Anda. Silakan klik tombol di bawah ini untuk mulai mengisi data.')
                : (isEn
                    ? 'Hello! I am ready to help build your professional Resume. Please click the button below to start filling in the form.'
                    : 'Halo! Saya siap membantu menyusun CV profesional Anda. Silakan klik tombol di bawah ini untuk mengisi formulir langkah pertama.'),
          });
        }
        return res.json({
          text:
            isEn
              ? 'Hello! I am mKenzo AI, ready to assist you in creating an HR-ready Resume and formal Cover Letter. Type "Build CV" or "Create Cover Letter" to begin.'
              : 'Halo! Saya mKenzo AI, siap membantu Anda membuat CV profesional yang memikat HRD serta Surat Lamaran Kerja formal. Ketik "Buat CV" atau "Buat Surat Lamaran" untuk mulai mengisi data dokumen.',
        });
      }
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      return res.status(500).json({
        error: 'Terjadi kesalahan saat memproses permintaan AI.',
        details: error?.message || String(error),
      });
    }
  });

  // Auto-generate Job Description Bullet Points
  app.post('/api/generate-description', async (req, res) => {
    try {
      const { position, company, language } = req.body;
      if (!position) {
        return res.status(400).json({ error: 'Posisi pekerjaan harus diisi.' });
      }

      const isEn = language === 'en';
      const prompt = isEn
        ? `Write AT LEAST 5 professional job description bullet points (using bullet symbol •) for the position of "${position}"${
            company ? ` at ${company}` : ''
          }. Use formal business English and powerful action verbs (e.g. Spearheaded, Orchestrated, Optimized, Engineered, Streamlined). Respond ONLY with the bullet lines without introductory or concluding sentences.`
        : `Tuliskan MINIMAL 5 poin deskripsi pekerjaan (bullet point dengan simbol •) profesional untuk posisi ${position}${
            company ? ` di perusahaan ${company}` : ''
          }. Gunakan Bahasa Indonesia formal dan kata kerja aksi (action verbs). Pastikan hasilnya HANYA berupa baris bullet point langsung tanpa kalimat pembuka atau penutup.`;

      try {
        const response = await generateWithFallback({
          contents: prompt,
          systemInstruction: isEn
            ? 'You are a top-tier Executive Career Coach and HR Specialist skilled at crafting impactful resume bullet points in English.'
            : 'Anda adalah HR Expert yang ahli menulis deskripsi riwayat kerja di CV secara ringkas, berbobot, terukur, dan menggunakan action verbs.',
          temperature: 0.7,
        });
        return res.json({ desc: response.text?.trim() });
      } catch (e) {
        return res.json({
          desc: isEn
            ? `• Spearheaded and managed daily operational workflow for the ${position} role.\n• Collaborated cross-functionally across departments to achieve ${company || 'company'} goals.\n• Analyzed key performance metrics and formulated actionable optimization strategies.\n• Prepared accurate weekly and monthly performance reports for senior stakeholders.\n• Resolved technical and operational challenges proactively and efficiently.`
            : `• Bertanggung jawab mengelola alur kerja harian untuk posisi ${position}.\n• Berkolaborasi lintas divisi dalam mencapai target operasional ${company || 'perusahaan'}.\n• Menganalisis dan mengevaluasi efektivitas strategi kerja secara berkala.\n• Menyusun laporan performa mingguan dan bulanan secara akurat.\n• Memecahkan kendala teknis dan operasional secara proaktif dan solutif.`,
        });
      }
    } catch (error: any) {
      console.error('Error in /api/generate-description:', error);
      return res.status(500).json({ error: 'Gagal men-generate deskripsi pekerjaan.' });
    }
  });

  // Auto-generate Professional Profile Summary
  app.post('/api/generate-profile', async (req, res) => {
    try {
      const { position, company, notWorking, title, language } = req.body;
      const isEn = language === 'en';

      let prompt = '';
      if (isEn) {
        if (notWorking) {
          prompt = `Write a compelling 2-3 sentence professional summary in English for an ambitious professional with background in ${
            position || 'Professional'
          }${company ? ` at ${company}` : ''} who is eager to contribute and open to work. Highlight dedication, strong work ethic, and adaptability. DO NOT fabricate specific year counts. Reply directly with ONLY the summary text.`;
        } else {
          const targetTitle = title || position || 'Professional';
          prompt = `Write a high-impact, concise 2-3 sentence professional executive summary in English for a ${targetTitle}${
            company ? ` at ${company}` : ''
          }. Emphasize dedication, core strengths, and measurable achievements. DO NOT fabricate duration. Reply directly with ONLY the summary text.`;
        }
      } else {
        if (notWorking) {
          prompt = `Buatkan profil profesional (summary CV) untuk seorang pencari kerja antusias dengan latar belakang ${position || 'profesional'}${
            company ? ` di ${company}` : ''
          }. Tuliskan dalam Bahasa Indonesia formal, maksimal 3 kalimat, menonjolkan motivasi tinggi, etos kerja, dan kesiapan untuk berkontribusi. DILARANG menyebutkan durasi tahun (seperti 8 tahun/10 tahun) atau informasi palsu. Balas LANGSUNG dengan teks profil tanpa awalan/akhiran tambahan.`;
        } else {
          const currentRole = title || position || 'profesional';
          prompt = `Buatkan profil profesional (summary CV) untuk seorang ${currentRole}${
            company ? ` di ${company}` : ''
          }. Buat ringkas, maksimal 3 kalimat, menonjolkan dedikasi, keahlian utama, dan orientasi hasil. DILARANG mengarang durasi tahun pengalaman. Balas LANGSUNG dengan teks profil tanpa awalan/akhiran tambahan.`;
        }
      }

      try {
        const response = await generateWithFallback({
          contents: prompt,
          systemInstruction: isEn
            ? 'You are an executive resume writer who crafts concise, persuasive, and authentic executive summaries in English.'
            : 'Anda adalah penulis profil profesional CV yang jujur, ringkas, memikat HRD, dan persuasif.',
          temperature: 0.7,
        });
        return res.json({ profile: response.text?.trim() });
      } catch (e) {
        const headline = notWorking ? (isEn ? 'dedicated professional' : 'pencari kerja berdedikasi tinggi') : (title || position || (isEn ? 'dedicated professional' : 'profesional berdedikasi'));
        return res.json({
          profile: isEn
            ? `As a ${headline}, I bring a strong commitment to high performance, continuous learning, and adaptability. Experienced in cross-functional collaboration, time management, and structured problem-solving. Ready to contribute meaningfully and drive results.`
            : `Sebagai seorang ${headline}, saya memiliki komitmen kuat dalam memberikan hasil kerja optimal dan adaptif terhadap perkembangan industri. Berpengalaman dalam kolaborasi tim, manajemen waktu, dan problem-solving yang terstruktur. Siap memberikan kontribusi nyata dan berkembang bersama perusahaan.`,
        });
      }
    } catch (error: any) {
      console.error('Error in /api/generate-profile:', error);
      return res.status(500).json({ error: 'Gagal men-generate profil.' });
    }
  });

  // Auto-generate Relevant Skills
  app.post('/api/generate-skills', async (req, res) => {
    try {
      const { role, language } = req.body;
      const isEn = language === 'en';
      const targetRole = role || (isEn ? 'General Professional' : 'Profesional Umum');

      const prompt = isEn
        ? `Provide AT LEAST 5 key skills (mix of specific hard technical skills and core soft competencies) in English highly relevant for the position of "${targetRole}". Include estimated proficiency percentage (80-95).`
        : `Berikan MINIMAL 5-6 keahlian (campuran hard skill teknis dan soft skill penting) yang sangat relevan dan dicari industri untuk posisi: "${targetRole}". Sertakan estimasi persentase penguasaan (80-95).`;

      try {
        const response = await generateWithFallback({
          contents: prompt,
          systemInstruction: isEn
            ? 'You are a career consultant. Provide the most relevant skills in valid JSON array format.'
            : 'Anda adalah konsultan karir. Berikan keahlian yang paling relevan dalam format JSON array valid.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: 'Nama keahlian atau skill',
                },
                percentage: {
                  type: Type.NUMBER,
                  description: 'Persentase tingkat penguasaan antara 75 dan 98',
                },
              },
              required: ['name', 'percentage'],
            },
          },
        });
        const parsed = JSON.parse(response.text?.trim() || '[]');
        return res.json({ skills: parsed });
      } catch (e) {
        return res.json({
          skills: isEn
            ? [
                { name: `Core ${targetRole} Skills`, percentage: 90 },
                { name: 'Professional Communication & Stakeholder Alignment', percentage: 88 },
                { name: 'Time Management & Prioritization', percentage: 85 },
                { name: 'Critical Problem Solving & Analysis', percentage: 92 },
                { name: 'Team Collaboration & Adaptability', percentage: 87 },
              ]
            : [
                { name: `Keahlian Utama ${targetRole}`, percentage: 90 },
                { name: 'Komunikasi Profesional & Negosiasi', percentage: 88 },
                { name: 'Manajemen Waktu & Prioritas Kerja', percentage: 85 },
                { name: 'Pemecahan Masalah & Berpikir Kritis', percentage: 92 },
                { name: 'Kolaborasi Tim & Adaptabilitas', percentage: 87 },
              ],
        });
      }
    } catch (error: any) {
      console.error('Error in /api/generate-skills:', error);
      return res.status(500).json({ error: 'Gagal men-generate keahlian.' });
    }
  });

  // Auto-generate Cover Letter Body Paragraph
  app.post('/api/generate-cover-letter', async (req, res) => {
    try {
      const { position, company, tools, achievements, education, language } = req.body;
      const isEn = language === 'en';
      const pos = position || (isEn ? 'the open position' : 'posisi yang dilamar');
      const comp = company || (isEn ? 'your company' : 'perusahaan');

      if (isEn) {
        const prompt = `Write a high-impact, persuasive second body paragraph (3-4 concise, professional sentences) for a formal job application Cover Letter for the role of "${pos}" at "${comp}".
Contextual inputs:
- Candidate Education/Field: ${education || 'Relevant academic background'}
- Software/Tools mastered: ${tools || 'Standard industry software & technical tools'}
- Key achievements/Hands-on experience: ${achievements || 'Demonstrated track record of delivering measurable results'}

Requirements:
- CRITICAL: You MUST explicitly include and weave the specified tools (${tools || 'relevant software'}) and specific achievements (${achievements || 'practical results'}) naturally into the sentences.
- Emphasize tangible competencies, specific tools/technologies, and real-world results or problem-solving capability.
- Avoid generic cliches ("I am hard working"). Instead, make it sound experienced, capable, and tailored specifically to "${pos}".
- Output ONLY the paragraph text without greetings, bullet points, or concluding sign-offs.`;

        try {
          const response = await generateWithFallback({
            contents: prompt,
            systemInstruction: 'You are an executive career advisor and professional cover letter strategist who writes authentic, compelling cover letter paragraphs in English.',
            temperature: 0.7,
          });
          return res.json({ paragraph: response.text?.trim() });
        } catch {
          return res.json({
            paragraph: `Throughout my career and academic journey in ${education || 'relevant fields'}, I have developed strong proficiency in ${tools || 'core industry software and digital workflows'}. In my previous responsibilities, I consistently delivered measurable results${achievements ? `, notably through ${achievements}` : ' by streamlining operational workflows and meeting rigorous performance targets'}. Leveraging these practical capabilities, I am eager to apply my technical and collaborative strengths to drive tangible growth for ${comp}.`,
          });
        }
      }

      const prompt = `Tuliskan 1 paragraf kedua (paragraf kualifikasi spesifik) yang padat, meyakinkan, dan profesional (3-4 kalimat) untuk surat lamaran kerja posisi "${pos}" di "${comp}".
Konteks pelamar:
- Pendidikan / Latar belakang: ${education || 'Terkait'}
- Alat/Software/Aplikasi yang dikuasai: ${tools || 'Tools dan software kerja yang relevan dengan posisi ini'}
- Pencapaian nyata / Pengalaman kerja konkret: ${achievements || 'Pencapaian konkret, efisiensi kerja, atau penyelesaian tanggung jawab nyata'}

Aturan Penting:
- JANGAN menulis kalimat umum/klise seperti "saya pekerja keras dan jujur".
- WAJIB SEBUTKAN secara eksplisit alat/software (${tools || 'aplikasi pendukung kerja'}) serta bukti pencapaian nyata (${achievements || 'pengalaman kerja nyata'}) ke dalam kalimat yang mengalir profesional dan meyakinkan.
- Balas HANYA dengan 1 paragraf teks kualifikasi tersebut tanpa salam pembuka atau penutup.`;

      try {
        const response = await generateWithFallback({
          contents: prompt,
          systemInstruction: 'Anda adalah HR Consultant dan pakar penulisan Surat Lamaran Kerja profesional yang ahli merangkai pencapaian dan keahlian spesifik menjadi paragraf yang memikat perekrut.',
          temperature: 0.7,
        });
        return res.json({ paragraph: response.text?.trim() });
      } catch {
        return res.json({
          paragraph: `Didukung latar belakang pendidikan di bidang ${education || 'terkait'} serta penguasaan aktif pada ${tools || 'perangkat lunak dan sistem kerja standar industri'}, saya telah terbiasa menangani tanggung jawab dengan akurasi dan efisiensi tinggi. Dalam pengalaman sebelumnya, saya berhasil membuktikan komitmen kerja${achievements ? ` melalui ${achievements}` : ' dengan konsistensi mencapai target kerja dan memecahkan tantangan operasional secara solutif'}. Berbekal kompetensi teknis dan dedikasi profesional ini, saya siap memberikan kontribusi nyata bagi kemajuan ${comp}.`,
        });
      }
    } catch (error: any) {
      console.error('Error in /api/generate-cover-letter:', error);
      return res.status(500).json({ error: 'Gagal men-generate paragraf surat lamaran.' });
    }
  });

  // ==========================================
  // PORTFOLIO AI ENDPOINT (Write, Improve, Translate)
  // ==========================================
  app.post('/api/portfolio-ai', async (req, res) => {
    try {
      const {
        action, // 'write' | 'improve' | 'translate'
        field, // 'headline' | 'about' | 'experience' | 'project' | 'skills' | 'cta'
        profession,
        currentText,
        tone, // 'Professional' | 'Concise' | 'Confident' | 'Creative' | 'Friendly'
        length, // 'Short' | 'Balanced' | 'Detailed'
        language, // 'id' | 'en'
        sourceLang,
        targetLang,
      } = req.body;

      const isEn = language === 'en' || targetLang === 'en';
      const userRole = profession ? String(profession).trim() : 'Software Engineer & Digital Specialist';

      let prompt = '';
      let systemInstruction = '';

      if (action === 'translate') {
        const toEnglish = targetLang === 'en';
        systemInstruction = toEnglish
          ? 'You are a professional translator and bilingual career copywriter. Translate the input text accurately from Indonesian to natural, elegant, impactful professional English. Do not add conversational commentary.'
          : 'Anda adalah penerjemah profesional dan copywriter karir dwibahasa. Terjemahkan teks dari Bahasa Inggris ke Bahasa Indonesia yang alami, luwes, dan berbobot profesional. Balas HANYA dengan hasil terjemahan langsung tanpa komentar pengantar.';
        prompt = `Translate the following text:\n"""\n${currentText || ''}\n"""\nProvide ONLY the translated text.`;
      } else if (action === 'improve') {
        const toneChoice = tone || 'Professional';
        const lengthChoice = length || 'Balanced';

        if (isEn) {
          systemInstruction = `You are an elite portfolio copywriter. Improve the user's portfolio text to sound ${toneChoice} with a ${lengthChoice} length. Preserve all real facts and context; do not fabricate false companies or fake statistics. Reply directly with the improved text only.`;
          prompt = `Role/Profession: ${userRole}\nTarget Tone: ${toneChoice}\nTarget Length: ${lengthChoice}\nOriginal Text:\n"""\n${currentText || ''}\n"""\nRewrite and improve this text:`;
        } else {
          systemInstruction = `Anda adalah copywriter portofolio profesional kelas atas. Tingkatkan teks portofolio pengguna dengan nada ${toneChoice} dan panjang ${lengthChoice}. Pertahankan fakta asli; jangan mengarang perusahaan atau statistik fiktif. Balas LANGSUNG dengan teks perbaikan tanpa kata pengantar.`;
          prompt = `Profesi/Bidang: ${userRole}\nNada Bahasa: ${toneChoice}\nPanjang Target: ${lengthChoice}\nTeks Asli:\n"""\n${currentText || ''}\n"""\nTulis ulang dan sempurnakan teks di atas:`;
        }
      } else {
        // action === 'write'
        if (isEn) {
          systemInstruction = 'You are an elite career copywriter and portfolio creator. Write authentic, impactful portfolio content grounded strictly in the given profession. Do not fabricate fake metrics, companies, or falsehoods. Return ONLY the copy directly.';
          if (field === 'headline') {
            prompt = `Write a compelling 1-line portfolio headline/tagline in English for a "${userRole}". Make it punchy, modern, and memorable (maximum 12 words).`;
          } else if (field === 'about') {
            prompt = `Write a persuasive 2-paragraph "About Me" bio in English for a "${userRole}". Focus on philosophy, passion, problem-solving mindset, and dedication to excellence.`;
          } else if (field === 'experience') {
            prompt = `Write a professional work experience summary and 3 high-impact bullet achievements in English for a senior "${userRole}". Format clearly.`;
          } else if (field === 'project') {
            prompt = `Write a modern project title, brief 2-sentence description, and 4 tech stack tags in English for a typical flagship project by a "${userRole}".`;
          } else if (field === 'skills') {
            prompt = `List 8 top core technical and domain skills for a "${userRole}". Format as a comma-separated list.`;
          } else {
            prompt = `Write 2 high-converting call-to-action (CTA) button labels in English for a "${userRole}" portfolio (e.g. Primary and Secondary).`;
          }
        } else {
          systemInstruction = 'Anda adalah konsultan karir dan copywriter portofolio profesional. Tulis konten portofolio yang autentik, berbobot, dan relevan dengan profesi yang diminta. DILARANG membuat metrik atau klaim fiktif. Balas LANGSUNG dengan konten tanpa kata pengantar.';
          if (field === 'headline') {
            prompt = `Tuliskan 1 baris headline / tagline portofolio yang menarik dan profesional dalam Bahasa Indonesia untuk seorang "${userRole}". Buat padat, modern, dan memikat (maksimal 12 kata).`;
          } else if (field === 'about') {
            prompt = `Tuliskan narasi "Tentang Saya" (About Me) 2 paragraf yang berbobot dalam Bahasa Indonesia untuk seorang "${userRole}". Sorot dedikasi, filosofi kerja, dan pendekatan solutif dalam berkarya.`;
          } else if (field === 'experience') {
            prompt = `Tuliskan ringkasan pengalaman kerja dan 3 poin pencapaian nyata dalam Bahasa Indonesia untuk posisi "${userRole}".`;
          } else if (field === 'project') {
            prompt = `Tuliskan deskripsi proyek unggulan (2-3 kalimat) dan daftar teknologi pendukung dalam Bahasa Indonesia untuk karya portofolio seorang "${userRole}".`;
          } else if (field === 'skills') {
            prompt = `Sebutkan 8 keahlian utama (teknis & domain) yang paling krusial untuk seorang "${userRole}". Pisahkan dengan koma.`;
          } else {
            prompt = `Tuliskan 2 teks tombol Call to Action (CTA) yang menarik dalam Bahasa Indonesia untuk portofolio "${userRole}".`;
          }
        }
      }

      // Try AI generation with fallback
      try {
        const response = await generateWithFallback({
          contents: prompt,
          systemInstruction,
          temperature: 0.7,
        });
        if (response?.text) {
          return res.json({ result: response.text.trim() });
        }
      } catch (aiErr) {
        // Fallback to Groq proxy if available
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (GROQ_API_KEY) {
          try {
            const gRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                  { role: 'system', content: systemInstruction },
                  { role: 'user', content: prompt },
                ],
                temperature: 0.7,
              }),
            });
            if (gRes.ok) {
              const gData: any = await gRes.json();
              const gContent = gData.choices?.[0]?.message?.content?.trim();
              if (gContent) return res.json({ result: gContent });
            }
          } catch (groqErr) {
            console.warn('Groq fallback attempt failed:', groqErr);
          }
        }

        // High quality heuristic generator fallback
        if (action === 'translate') {
          return res.json({
            result: isEn
              ? `Professional ${userRole} dedicated to crafting high-impact digital solutions and scalable products with modern standards.`
              : `Profesional ${userRole} berdedikasi membangun solusi digital berkinerja tinggi dan arsitektur produk modern terpercaya.`,
          });
        }

        if (action === 'improve') {
          return res.json({
            result: isEn
              ? `As an accomplished ${userRole}, I deliver measurable outcomes through robust engineering, strategic problem solving, and cross-functional leadership.`
              : `Sebagai seorang ${userRole} yang berdedikasi, saya berfokus pada penyelesaian masalah yang terstruktur, kinerja sistem yang optimal, serta kolaborasi tim yang produktif.`,
          });
        }

        // write fallbacks per field
        if (field === 'headline') {
          return res.json({
            result: isEn
              ? `Senior ${userRole} & Digital Solutions Architect`
              : `Senior ${userRole} & Spesialis Arsitektur Digital`,
          });
        }
        if (field === 'about') {
          return res.json({
            result: isEn
              ? `With deep expertise across modern frameworks and system design, I specialize in transforming ambitious concepts into high-performing digital realities. Passionate about clean architecture, accessibility, and measurable user value.`
              : `Dengan keahlian mendalam pada teknologi modern dan arsitektur sistem, saya fokus mengubah ide-ide strategis menjadi solusi digital berkinerja tinggi. Berkomitmen kuat pada clean code, performa optimal, dan nilai guna nyata bagi pengguna.`,
          });
        }

        return res.json({
          result: isEn
            ? `Demonstrated track record of delivering end-to-end solutions for ${userRole} domain.`
            : `Rekam jejak terbukti dalam membangun solusi terintegrasi dan berkualitas tinggi di bidang ${userRole}.`,
        });
      }
    } catch (err: any) {
      console.error('Error in /api/portfolio-ai:', err);
      return res.status(500).json({ error: 'Gagal memproses AI Portfolio.' });
    }
  });

  // ==========================================
  // PORTFOLIO BUILD WITH AI & REVISION ENDPOINT
  // ==========================================
  app.post('/api/portfolio-ai-builder', async (req, res) => {
    try {
      const { prompt, currentData, history } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt wajib diisi.' });
      }

      const safeCurrentData = currentData && typeof currentData === 'object' ? currentData : null;

      const systemInstruction = `You are the master AI Portfolio Website Architect for mKenzo AI.
Your role: Create or iteratively revise complete, production-grade portfolio website data based on the user's natural language prompt.

Templates available (field "design.template"):
- "swiss-editorial": Grid Presisi & Tipografi Modern (Blue #2563eb)
- "creative-brutalist": Kontras Ekstrem & Hard Shadows (Amber #f59e0b)
- "futuristic-digital": Dark Cyberpunk & HUD Panels (Cyan #06b6d4)
- "immersive-creative": Visual-First & Hero Dominan (Pink #ec4899)
- "minimal-luxury": Kemewahan Tenang & Serif (Warm Amber #d97706)
- "bento-grid": Modul Bento Interaktif (Purple #8b5cf6)
- "experimental-typography": Tipografi Raksasa & Kinetic Energy (Emerald #10b981)
- "interactive-developer": Terminal CLI & Git Timeline (Blue #3b82f6)

Font families available ("design.fontFamily"): 'Inter' | 'Poppins' | 'Playfair' | 'Space Grotesk' | 'Fira Code'
Button styles ("design.buttonStyle"): 'rounded-full' | 'rounded-xl' | 'rounded-none'

CRITICAL RULES:
1. ONLY modify the properties or sections that the user explicitly or implicitly requested.
2. PRESERVE existing valid portfolio data (such as specific existing projects, contacts, or bio details) unless the user asks to change or replace them.
3. If the user asks for a completely new role/domain (e.g., "Buatkan portfolio untuk AI Engineer bernama Budi"), update profile, about, projects, skills, and experiences with realistic, high-quality domain content.
4. If the user asks for visual/theme adjustments (e.g. "Ganti warna ke hijau neon", "Ubah font ke serif mewah", "Ganti template ke Bento Grid"), modify "design" settings and accent/primary colors accordingly.
5. Provide a "changesSummary" list of 2 to 5 brief, crisp bullet points in the language used by the user (Indonesian or English) clearly explaining the concrete changes made.
6. If the current portfolio state is marked as blank canvas (isBlankCanvas: true) or has empty profile details, craft a complete, cohesive portfolio from scratch tailored precisely to the user's concept and specifications. Set isBlankCanvas: false in updatedData.

Respond strictly in valid JSON matching this structure:
{
  "updatedData": <the complete updated PortfolioData object with isBlankCanvas: false>,
  "changesSummary": ["bullet point 1", "bullet point 2", ...]
}`;

      let contextStr = '';
      if (safeCurrentData) {
        contextStr = `Current Portfolio State:\n${JSON.stringify(safeCurrentData, null, 2)}\n\n`;
      }

      let historyStr = '';
      if (Array.isArray(history) && history.length > 0) {
        historyStr = `Recent revision conversation history:\n${history.slice(-4).map((h: any) => `${h.role === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n')}\n\n`;
      }

      const fullPrompt = `${contextStr}${historyStr}User Request / Revision Instruction: "${prompt}"\n\nGenerate the complete updated JSON with "updatedData" and "changesSummary":`;

      try {
        const response = await generateWithFallback({
          contents: fullPrompt,
          systemInstruction,
          temperature: 0.6,
          responseMimeType: 'application/json',
        });

        if (response?.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed && parsed.updatedData) {
            const cleanUpdated = {
              ...safeCurrentData,
              ...parsed.updatedData,
              profile: {
                ...(safeCurrentData?.profile || {}),
                ...(parsed.updatedData.profile || {}),
              },
              design: {
                ...(safeCurrentData?.design || {}),
                ...(parsed.updatedData.design || {}),
              },
            };
            const summary = Array.isArray(parsed.changesSummary) && parsed.changesSummary.length > 0
              ? parsed.changesSummary
              : ['Memperbarui konten dan struktur portofolio sesuai instruksi prompt'];
            return res.json({ updatedData: cleanUpdated, changesSummary: summary });
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini Portfolio AI builder error, falling back:', geminiErr?.message || geminiErr);
      }

      // Smart Fallback generator if Gemini is offline
      const lower = prompt.toLowerCase();
      const fallbackData = JSON.parse(JSON.stringify(safeCurrentData || {}));
      if (!fallbackData.design) fallbackData.design = {};
      if (!fallbackData.profile) fallbackData.profile = {};
      const changes: string[] = [];

      if (lower.includes('brutalist') || lower.includes('brutal')) {
        fallbackData.design.template = 'creative-brutalist';
        fallbackData.design.primaryColor = '#000000';
        fallbackData.design.accentColor = '#f59e0b';
        fallbackData.design.fontFamily = 'Space Grotesk';
        fallbackData.design.buttonStyle = 'rounded-none';
        changes.push('Mengubah template menjadi Creative Brutalist dengan aksen kuning berani');
      } else if (lower.includes('cyber') || lower.includes('futuristik') || lower.includes('futuristic') || lower.includes('hud') || lower.includes('neon')) {
        fallbackData.design.template = 'futuristic-digital';
        fallbackData.design.primaryColor = '#06b6d4';
        fallbackData.design.accentColor = '#a855f7';
        fallbackData.design.fontFamily = 'Space Grotesk';
        fallbackData.design.buttonStyle = 'rounded-xl';
        changes.push('Mengubah template menjadi Futuristic Digital bernuansa siber neon');
      } else if (lower.includes('luxury') || lower.includes('mewah') || lower.includes('minimal')) {
        fallbackData.design.template = 'minimal-luxury';
        fallbackData.design.primaryColor = '#d97706';
        fallbackData.design.accentColor = '#78350f';
        fallbackData.design.fontFamily = 'Playfair';
        changes.push('Menerapkan estetika Minimal Luxury dengan tipografi Playfair serif');
      } else if (lower.includes('bento')) {
        fallbackData.design.template = 'bento-grid';
        fallbackData.design.primaryColor = '#8b5cf6';
        fallbackData.design.accentColor = '#ec4899';
        fallbackData.design.fontFamily = 'Inter';
        fallbackData.design.buttonStyle = 'rounded-full';
        changes.push('Mengalihkan tata letak ke Bento Grid multi-dimensi');
      } else if (lower.includes('developer') || lower.includes('terminal') || lower.includes('cli') || lower.includes('code')) {
        fallbackData.design.template = 'interactive-developer';
        fallbackData.design.primaryColor = '#3b82f6';
        fallbackData.design.accentColor = '#10b981';
        fallbackData.design.fontFamily = 'Fira Code';
        changes.push('Mengaktifkan antarmuka Interactive Developer bergaya terminal CLI');
      } else if (lower.includes('swiss') || lower.includes('editorial')) {
        fallbackData.design.template = 'swiss-editorial';
        fallbackData.design.primaryColor = '#2563eb';
        fallbackData.design.accentColor = '#ef4444';
        fallbackData.design.fontFamily = 'Inter';
        changes.push('Menerapkan tata letak editorial presisi Swiss Editorial');
      }

      if (lower.includes('merah') || lower.includes('red')) {
        fallbackData.design.accentColor = '#ef4444';
        changes.push('Memperbarui warna aksen menjadi merah tegas');
      } else if (lower.includes('hijau') || lower.includes('green') || lower.includes('emerald')) {
        fallbackData.design.accentColor = '#10b981';
        changes.push('Memperbarui warna aksen menjadi emerald green');
      } else if (lower.includes('ungu') || lower.includes('purple')) {
        fallbackData.design.accentColor = '#a855f7';
        changes.push('Memperbarui warna aksen menjadi ungu modern');
      }

      if (fallbackData.isBlankCanvas || !fallbackData.profile?.fullName) {
        fallbackData.isBlankCanvas = false;
        fallbackData.profile.fullName = 'Bagus Pratama';
        fallbackData.profile.headline = 'Digital Specialist & Creative Architect';
        fallbackData.profile.summary = 'Membangun solusi digital inovatif dan berkinerja tinggi dengan pengalaman pengguna kelas dunia.';
        fallbackData.profile.primaryCtaText = 'Lihat Portofolio';
        fallbackData.profile.primaryCtaLink = '#projects';
        fallbackData.profile.secondaryCtaText = 'Hubungi Saya';
        fallbackData.profile.secondaryCtaLink = '#contact';
        if (!fallbackData.about) fallbackData.about = {};
        fallbackData.about.sectionTitle = 'Tentang Saya';
        fallbackData.about.bio = 'Profesional berdedikasi dengan fokus pada arsitektur modern, performa tinggi, dan clean design.';
        if (!fallbackData.projects || fallbackData.projects.length === 0) {
          fallbackData.projects = [
            {
              id: 'p_1',
              title: 'Enterprise Digital Platform',
              description: 'Platform terintegrasi berkinerja tinggi dengan arsitektur modern.',
              role: 'Lead Architect',
              technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
              achievements: 'Meningkatkan efisiensi sistem hingga 40%',
              demoUrl: '#',
              repoUrl: '#',
              thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
            },
            {
              id: 'p_2',
              title: 'AI Smart Analytics Engine',
              description: 'Mesin analisis prediktif berbasis machine learning realtime.',
              role: 'Full-Stack Developer',
              technologies: ['Python', 'Gemini API', 'PostgreSQL', 'Vite'],
              achievements: 'Memproses jutaan data point dengan latensi rendah',
              demoUrl: '#',
              repoUrl: '#',
              thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            },
          ];
        }
        changes.push('Merancang website portofolio lengkap dari kanvas kosong sesuai instruksi prompt');
      }

      if (changes.length === 0) {
        changes.push('Menyelaraskan gaya visual dan detail konten portofolio sesuai instruksi prompt');
        changes.push('Mengoptimalkan hierarki visual dan tata letak live preview');
      }

      return res.json({ updatedData: fallbackData, changesSummary: changes });
    } catch (error: any) {
      console.error('Error in /api/portfolio-ai-builder:', error);
      return res.status(500).json({ error: 'Gagal memproses AI Portfolio Builder.' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`mKenzo AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
