import { SkillItem } from '../types';

/**
 * Panggilan ke proxy AI server (tanpa mengekspos API key di client)
 */
export async function callRealAI(
  prompt: string,
  systemInstruction = 'Anda adalah asisten AI yang cerdas, ramah, dan serbaguna.'
): Promise<string> {
  try {
    const proxyRes = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction }),
    });
    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      if (proxyData.content) return proxyData.content.trim();
    }
  } catch (proxyErr) {
    console.warn('Server AI proxy error:', proxyErr);
  }

  return 'Maaf, gagal terhubung ke AI. Pastikan server aktif dan layanan tersedia.';
}

/**
 * Chat handler mKenzo AI mendukung Bahasa Indonesia & English via /api/chat
 */
export async function askAiChat(
  message: string,
  history: Array<{ role: string; text: string }>,
  mode: 'cv' | 'letter' | 'general',
  isAskingForDocument: boolean,
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const isEn = language === 'en';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        mode,
        isAskingForDocument,
        language,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text.trim();
    }
  } catch (err) {
    console.warn('Fetch to /api/chat error, falling back:', err);
  }

  // Graceful default responses
  if (isAskingForDocument) {
    if (isEn) {
      return mode === 'letter'
        ? 'Hello! I am ready to help create your Cover Letter. Please fill in the document form to begin.'
        : 'Hello! I am ready to help build your professional Resume. Please fill in the document form to begin.';
    } else {
      return mode === 'letter'
        ? 'Halo! Saya siap membantu membuat Surat Lamaran Kerja Anda. Silakan isi form dokumen untuk memulai.'
        : 'Halo! Saya siap membantu menyusun CV profesional Anda. Silakan isi form dokumen untuk memulai langkah pertama.';
    }
  }

  if (mode === 'general') {
    return isEn
      ? 'Hello! How can I help you today? Feel free to ask or chat about anything.'
      : 'Halo! Ada yang bisa saya bantu hari ini? Silakan tanya atau ajak ngobrol tentang hal apa saja.';
  }

  return isEn
    ? 'Hello! How may I assist you with building your Resume or Cover Letter today?'
    : 'Halo! Ada yang bisa saya bantu untuk pembuatan CV atau Surat Lamaran Anda?';
}

/**
 * Generate 5 bullet points deskripsi pengalaman kerja (Bahasa Indonesia / English)
 */
export async function generateJobDescription(
  position: string,
  company: string,
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const isEn = language === 'en';

  try {
    const res = await fetch('/api/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, company, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.desc) return data.desc.trim();
    }
  } catch (err) {
    console.warn('Fetch to /api/generate-description error:', err);
  }

  // Local fallback
  if (isEn) {
    return `• Spearheaded and managed daily operational workflow for the ${position} role.\n• Collaborated cross-functionally across departments to achieve ${company || 'company'} goals.\n• Analyzed key performance metrics and formulated actionable optimization strategies.\n• Prepared accurate weekly and monthly performance reports for senior stakeholders.\n• Resolved technical and operational challenges proactively and efficiently.`;
  }

  return `• Bertanggung jawab mengelola alur kerja harian untuk posisi ${position}.\n• Berkolaborasi lintas divisi dalam mencapai target operasional ${company || 'perusahaan'}.\n• Menganalisis dan mengevaluasi efektivitas strategi kerja secara berkala.\n• Menyusun laporan performa mingguan dan bulanan secara akurat.\n• Memecahkan kendala teknis dan operasional secara proaktif dan solutif.`;
}

/**
 * Generate ringkasan profil profesional CV (Bahasa Indonesia / English)
 */
export async function generateProfileSummary(
  position: string,
  company: string,
  notWorking: boolean,
  title: string,
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const isEn = language === 'en';

  try {
    const res = await fetch('/api/generate-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, company, notWorking, title, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.profile) return data.profile.trim();
    }
  } catch (err) {
    console.warn('Fetch to /api/generate-profile error:', err);
  }

  const headline = notWorking
    ? (isEn ? 'dedicated professional' : 'pencari kerja berdedikasi tinggi')
    : (title || position || (isEn ? 'dedicated professional' : 'profesional berdedikasi'));

  if (isEn) {
    return `As a ${headline}, I bring a strong commitment to high performance, continuous learning, and adaptability. Experienced in cross-functional collaboration, time management, and structured problem-solving. Ready to contribute meaningfully and drive results.`;
  }

  return `Sebagai seorang ${headline}, saya memiliki komitmen kuat dalam memberikan hasil kerja optimal dan adaptif terhadap perkembangan industri. Berpengalaman dalam kolaborasi tim, manajemen waktu, dan problem-solving yang terstruktur. Siap memberikan kontribusi nyata dan berkembang bersama perusahaan.`;
}

/**
 * Generate 5 skill dengan persentase JSON (Bahasa Indonesia / English)
 */
export async function generateSkillsList(
  role: string,
  language: 'id' | 'en' = 'id'
): Promise<SkillItem[]> {
  const isEn = language === 'en';
  const targetTitle = role || (isEn ? 'General Professional' : 'Profesional Umum');

  try {
    const res = await fetch('/api/generate-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        return data.skills;
      }
    }
  } catch (err) {
    console.warn('Fetch to /api/generate-skills error:', err);
  }

  if (isEn) {
    return [
      { name: `Core ${targetTitle} Skills`, percentage: 90 },
      { name: 'Professional Communication & Stakeholder Alignment', percentage: 88 },
      { name: 'Time Management & Prioritization', percentage: 85 },
      { name: 'Critical Problem Solving & Analysis', percentage: 92 },
      { name: 'Team Collaboration & Adaptability', percentage: 87 },
    ];
  }

  return [
    { name: `Keahlian Utama ${targetTitle}`, percentage: 90 },
    { name: 'Komunikasi Profesional & Negosiasi', percentage: 88 },
    { name: 'Manajemen Waktu & Prioritas Kerja', percentage: 85 },
    { name: 'Pemecahan Masalah & Berpikir Kritis', percentage: 92 },
    { name: 'Kolaborasi Tim & Adaptabilitas', percentage: 87 },
  ];
}

/**
 * Generate paragraf kedua surat lamaran kerja dengan spesifikasi alat, pencapaian, dan pengalaman nyata
 */
export async function generateCoverLetterParagraph(
  position: string,
  company: string,
  tools?: string,
  achievements?: string,
  education?: string,
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const isEn = language === 'en';
  const pos = position || (isEn ? 'the open position' : 'posisi yang dilamar');
  const comp = company || (isEn ? 'your company' : 'perusahaan');

  try {
    const res = await fetch('/api/generate-cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, company, tools, achievements, education, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.paragraph) return data.paragraph.trim();
    }
  } catch (err) {
    console.warn('Fetch to /api/generate-cover-letter error:', err);
  }

  if (isEn) {
    return `Throughout my career and academic journey in ${education || 'relevant fields'}, I have developed strong proficiency in ${tools || 'core industry software and digital workflows'}. In my previous responsibilities, I consistently delivered measurable results${achievements ? `, notably through ${achievements}` : ' by streamlining operational workflows and meeting rigorous performance targets'}. Leveraging these practical capabilities, I am eager to apply my technical and collaborative strengths to drive tangible growth for ${comp}.`;
  }

  return `Didukung latar belakang pendidikan di bidang ${education || 'terkait'} serta penguasaan aktif pada ${tools || 'perangkat lunak dan sistem kerja standar industri'}, saya telah terbiasa menangani tanggung jawab dengan akurasi dan efisiensi tinggi. Dalam pengalaman sebelumnya, saya berhasil membuktikan komitmen kerja${achievements ? ` melalui ${achievements}` : ' dengan konsistensi mencapai target kerja dan memecahkan tantangan operasional secara solutif'}. Berbekal kompetensi teknis dan dedikasi profesional ini, saya siap memberikan kontribusi nyata bagi kemajuan ${comp}.`;
}
