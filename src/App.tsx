import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Loader2,
  Briefcase,
  Eye,
  X,
  Plus,
  LayoutTemplate,
  Trash2,
  CheckSquare,
  Square,
  Upload,
  Sparkles,
  Send,
  ChevronRight,
  MessageSquare,
  Clock,
  Menu,
  CheckCircle2,
  RefreshCw,
  Palette,
  Copy,
  Check,
  Home,
  Lock,
  LogOut,
  AlertTriangle,
  Globe,
} from 'lucide-react';

import Logo from './components/Logo';
import CoverLetter from './templates/CoverLetter';
import ChatMessageRenderer from './components/ChatMessageRenderer';
import GoogleLoginModal from './components/GoogleLoginModal';
import { PortfolioStudio } from './features/portfolio/PortfolioStudio';
import {
  UserProfile,
  getStoredUser,
  removeStoredUser,
  saveStoredUser,
  getGuestChatCount,
  incrementGuestChatCount,
  resetGuestChatCount,
  FREE_CHATS_COUNT_KEY,
  saveChatMessageToSupabase,
  fetchUserConversations,
  fetchUserChatHistory,
  deleteConversationFromSupabase,
  clearUserChatHistory,
  saveUserToSupabase,
  supabase,
} from './lib/supabase';
import {
  ALL_TEMPLATES,
  TemplateItem,
  TemplateThumbnail,
  UniversalCvRender,
} from './templates';
import { PRESET_COLOR_TONES } from './templates/colorThemes';
import {
  CvData,
  LetterData,
  ChatMessage,
  ConversationSession,
} from './types';
import {
  askAiChat,
  generateJobDescription,
  generateProfileSummary,
  generateSkillsList,
  generateCoverLetterParagraph,
} from './services/api';

const SESSIONS_STORAGE_KEY = 'mkenzo_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'mkenzo_active_session_id';

const DEFAULT_CV_DATA: CvData = {
  titleCV: '',
  name: '',
  title: '',
  phone: '',
  email: '',
  location: '',
  profileImage: '',
  linkedin: '',
  website: '',
  notWorking: false,
  experience: [{ position: '', company: '', year: '', desc: '', aiDesc: false }],
  profile: '',
  aiProfile: false,
  skills: [{ name: '', percentage: 80 }],
  aiSkills: false,
  education: [
    { level: 'SD', school: '', year: '', major: '', isFixed: true },
    { level: 'SMP', school: '', year: '', major: '', isFixed: true },
    { level: 'SMA', school: '', year: '', major: '', isFixed: true },
  ],
  awards: [],
  noProject: false,
  projects: [],
};

const DEFAULT_LETTER_DATA: LetterData = {
  tanggalSurat: '',
  namaPerusahaan: '',
  alamatPerusahaan: '',
  posisiDilamar: '',
  nama: '',
  ttl: '',
  jenisKelamin: 'Laki-laki',
  alamat: '',
  phone: '',
  email: '',
  pendidikanTerakhir: '',
  keahlianTools: '',
  pencapaianSpesifik: '',
  paragrafKualifikasi: '',
  aiParagraf: false,
  lampiran: [
    'Daftar Riwayat Hidup (CV)',
    'Fotocopy Ijazah dan Transkrip Nilai',
    'Fotocopy Kartu Tanda Penduduk (KTP)',
    'Pas Foto Terbaru 4x6',
  ],
};

export default function App() {
  // === SESSIONS & CONVERSATION HISTORY STATES ===
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    try {
      if (!getStoredUser()) return [];
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading sessions from localStorage:', e);
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    try {
      if (!getStoredUser()) return null;
      return localStorage.getItem(ACTIVE_SESSION_KEY) || null;
    } catch {
      return null;
    }
  });

  // Current session working states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mode, setMode] = useState<'cv' | 'letter' | 'general'>('general');
  const [docLanguage, setDocLanguage] = useState<'id' | 'en'>('id');
  const [isDocumentMode, setIsDocumentMode] = useState(false);
  const [appView, setAppView] = useState<'main' | 'portfolio'>('main');

  // UI Modals
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [languageModalConfig, setLanguageModalConfig] = useState<{
    open: boolean;
    targetMode: 'cv' | 'letter';
  } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(ALL_TEMPLATES[0]);
  const [templateFilterTab, setTemplateFilterTab] = useState<'ALL' | 'Creative' | 'ATS'>('ALL');
  const [activeFormPopup, setActiveFormPopup] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Color Tone State for CV Templates (Dynamic Color Picker)
  const [cvColorTone, setCvColorTone] = useState<string>('#f59e0b');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  // User Authentication & Access Gating States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginReason, setLoginReason] = useState<'limit' | 'preview' | 'export' | 'general'>('general');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [formValidationNotice, setFormValidationNotice] = useState<string | null>(null);
  const [chatLimitNotice, setChatLimitNotice] = useState<string | null>(null);

  // Validation for CV Form Completion
  const isCvCompleted = () => {
    const hasName = Boolean(cvData.name && cvData.name.trim().length > 0);
    const hasRole = Boolean((cvData.title && cvData.title.trim().length > 0) || cvData.notWorking);
    const hasContact = Boolean(
      (cvData.email && cvData.email.trim().length > 0) ||
      (cvData.phone && cvData.phone.trim().length > 0)
    );
    return hasName && hasRole && hasContact;
  };

  // Validation for Letter Form Completion
  const isLetterCompleted = () => {
    const hasName = Boolean(letterData.nama && letterData.nama.trim().length > 0);
    const hasPosition = Boolean(letterData.posisiDilamar && letterData.posisiDilamar.trim().length > 0);
    const hasCompany = Boolean(letterData.namaPerusahaan && letterData.namaPerusahaan.trim().length > 0);
    return hasName && hasPosition && hasCompany;
  };

  const isCurrentFormCompleted = () => {
    return mode === 'letter' ? isLetterCompleted() : isCvCompleted();
  };

  // Safe handler for opening Preview (Locked until logged in and form completed)
  const handleOpenPreviewSafely = () => {
    if (!currentUser) {
      setLoginReason('preview');
      setShowLoginModal(true);
      return;
    }
    if (!isCurrentFormCompleted()) {
      setFormValidationNotice(
        mode === 'letter'
          ? 'Silakan lengkapi data formulir Surat Lamaran (Nama, Posisi yang Dilamar, dan Perusahaan Tujuan) terlebih dahulu sebelum membuka pratinjau.'
          : 'Silakan lengkapi data utama CV (Nama Lengkap, Posisi/Profesi, dan Kontak) terlebih dahulu sebelum membuka pratinjau.'
      );
      if (mode === 'letter') setActiveFormPopup(4);
      else setActiveFormPopup(1);
      return;
    }
    setShowPreview(true);
  };

  // Safe handler for Export PDF (Locked until logged in and form completed)
  const handleExportPdfSafely = () => {
    if (!currentUser) {
      setLoginReason('export');
      setShowLoginModal(true);
      return;
    }
    if (!isCurrentFormCompleted()) {
      setFormValidationNotice(
        mode === 'letter'
          ? 'Silakan lengkapi data formulir Surat Lamaran terlebih dahulu sebelum mengekspor dokumen ke PDF.'
          : 'Silakan lengkapi data utama CV terlebih dahulu sebelum mengekspor dokumen ke PDF.'
      );
      if (mode === 'letter') setActiveFormPopup(4);
      else setActiveFormPopup(1);
      return;
    }
    handleExportPDF();
  };

  // Login Success Handler: loads chat conversations from Supabase
  const handleLoginSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    resetGuestChatCount();
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }

    try {
      const { conversations } = await fetchUserConversations(user.email);
      if (conversations && conversations.length > 0) {
        setSessions(conversations);
        const latest = conversations[0];
        setActiveSessionId(latest.id);
        setMessages(latest.messages || []);
        setMode(latest.mode || 'general');
        setIsDocumentMode(Boolean(latest.isDocumentMode));
        if (latest.cvData) setCvData(latest.cvData);
        if (latest.letterData) setLetterData(latest.letterData);
        if (latest.language) setDocLanguage(latest.language);
        if (latest.colorTone) setCvColorTone(latest.colorTone);
        if (latest.templateId) {
          const found = ALL_TEMPLATES.find((t) => t.id === latest.templateId);
          if (found) setSelectedTemplate(found);
        }
      } else {
        setActiveSessionId(null);
        setMessages([]);
        setSessions([]);
      }
    } catch (e) {
      console.warn('Error loading conversations on login:', e);
      setActiveSessionId(null);
      setMessages([]);
      setSessions([]);
    }

    setQuery('');
    setChatLimitNotice(null);
    setIsMobileSidebarOpen(false);
  };

  const handleCopyText = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch (e) {
      console.error('Failed copying message:', e);
    }
  };

  // Field AI Generation loading states
  const [isGeneratingDesc, setIsGeneratingDesc] = useState<{ [key: number]: boolean }>({});
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingLetterParagraph, setIsGeneratingLetterParagraph] = useState(false);

  // Document data states
  const [cvData, setCvData] = useState<CvData>(DEFAULT_CV_DATA);
  const [letterData, setLetterData] = useState<LetterData>(DEFAULT_LETTER_DATA);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist sessions to localStorage
  // Persist sessions to localStorage ONLY for authenticated user
  useEffect(() => {
    if (!currentUser) {
      try {
        localStorage.removeItem(SESSIONS_STORAGE_KEY);
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      } catch (e) {
        console.error(e);
      }
      return;
    }
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed saving sessions:', e);
    }
  }, [sessions, currentUser]);

  // Sync activeSessionId with localStorage ONLY for authenticated user
  useEffect(() => {
    if (!currentUser) return;
    try {
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed saving activeSessionId:', e);
    }
  }, [activeSessionId, currentUser]);

  // Automatically fetch user's saved conversations from Supabase when logged in
  useEffect(() => {
    if (!currentUser?.email) return;
    let isMounted = true;
    fetchUserConversations(currentUser.email).then(({ conversations }) => {
      if (!isMounted) return;
      if (conversations && conversations.length > 0) {
        setSessions(conversations);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser?.email]);

  // Listen for Supabase OAuth login redirect or existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email && !currentUser) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const profile: UserProfile = {
          email,
          name,
          username: email.split('@')[0],
          picture: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          token: 0,
          created_at: new Date().toISOString(),
        };
        saveStoredUser(profile);
        saveUserToSupabase(profile);
        setCurrentUser(profile);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email && !currentUser) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const profile: UserProfile = {
          email,
          name,
          username: email.split('@')[0],
          picture: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          token: 0,
          created_at: new Date().toISOString(),
        };
        saveStoredUser(profile);
        saveUserToSupabase(profile);
        setCurrentUser(profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  // Complete Logout & State Cleanup Handler
  const handleLogout = async () => {
    setIsAiTyping(false);
    setStreamingMsgId(null);
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
    setQuery('');
    setMode('general');
    setIsDocumentMode(false);
    setCvData(DEFAULT_CV_DATA);
    setLetterData(DEFAULT_LETTER_DATA);
    setChatLimitNotice(null);
    setCurrentUser(null);

    removeStoredUser();
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.removeItem(FREE_CHATS_COUNT_KEY);
    } catch (e) {
      console.error('Storage clear error on logout:', e);
    }

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
  };

  // Load session when activeSessionId changes
  useEffect(() => {
    if (activeSessionId) {
      const current = sessions.find((s) => s.id === activeSessionId);
      if (current) {
        setMessages(current.messages || []);
        setMode(current.mode || 'general');
        setCvData(current.cvData || DEFAULT_CV_DATA);
        setLetterData(current.letterData || DEFAULT_LETTER_DATA);
        if (current.language) {
          setDocLanguage(current.language);
        }
        if (current.colorTone) {
          setCvColorTone(current.colorTone);
        }
        if (current.templateId) {
          const found = ALL_TEMPLATES.find((t) => t.id === current.templateId);
          if (found) setSelectedTemplate(found);
        }
        const hasDocMode =
          current.isDocumentMode !== undefined
            ? current.isDocumentMode
            : (current.mode === 'cv' || current.mode === 'letter');
        setIsDocumentMode(hasDocMode);
      }
    }
  }, [activeSessionId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Helper to sync changes to active session
  const updateCurrentSession = (
    updatedMessages: ChatMessage[],
    updatedMode: 'cv' | 'letter' | 'general',
    updatedCvData: CvData,
    updatedLetterData: LetterData,
    updatedLang: 'id' | 'en' = docLanguage,
    updatedColorTone: string = cvColorTone,
    updatedTemplateId: string = selectedTemplate.id,
    updatedIsDocMode: boolean = isDocumentMode,
    forceSessionId?: string
  ) => {
    // Non-user (guest) does not persist sessions to history
    if (!currentUser) {
      return;
    }

    const targetId = forceSessionId || activeSessionId || ('session_' + Date.now());
    if (!activeSessionId) {
      setActiveSessionId(targetId);
    }

    const firstUserMsg = updatedMessages.find((m) => m.role === 'user');
    const isEn = updatedLang === 'en';
    const defaultTitle =
      updatedMode === 'letter'
        ? (isEn ? 'Cover Letter Draft' : 'Pembuatan Surat Lamaran')
        : updatedMode === 'cv'
        ? (isEn ? 'New Resume / CV' : 'Pembuatan CV Baru')
        : (isEn ? 'Conversation' : 'Percakapan');

    const title = firstUserMsg
      ? firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? '...' : '')
      : defaultTitle;

    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === targetId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          updatedAt: new Date().toISOString(),
          messages: updatedMessages,
          mode: updatedMode,
          isDocumentMode: updatedIsDocMode,
          cvData: updatedCvData,
          letterData: updatedLetterData,
          language: updatedLang,
          colorTone: updatedColorTone,
          templateId: updatedTemplateId,
        };
        return copy;
      } else {
        const newSession: ConversationSession = {
          id: targetId,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: updatedMessages,
          mode: updatedMode,
          isDocumentMode: updatedIsDocMode,
          cvData: updatedCvData,
          letterData: updatedLetterData,
          language: updatedLang,
          colorTone: updatedColorTone,
          templateId: updatedTemplateId,
        };
        return [newSession, ...prev];
      }
    });
  };

  // Start fresh chat
  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setQuery('');
    setMode('general');
    setDocLanguage('id');
    setIsDocumentMode(false);
    setCvData(DEFAULT_CV_DATA);
    setLetterData(DEFAULT_LETTER_DATA);
    setChatLimitNotice(null);
    setIsMobileSidebarOpen(false);
  };

  // Action ketika klik "Buat CV Profesional" dari Halaman Awal
  const handleStartCvForm = async (lang: 'id' | 'en' = docLanguage) => {
    // 3-History Quota check for authenticated user
    if (currentUser && sessions.length >= 3 && !activeSessionId) {
      setChatLimitNotice('Kamu sudah mencapai batas 3 riwayat chat. Hapus salah satu riwayat untuk memulai chat baru.');
      return;
    }

    const newSessionId = activeSessionId || ('session_' + Date.now());
    if (!activeSessionId && currentUser) {
      setActiveSessionId(newSessionId);
    }
    setDocLanguage(lang);
    setMode('cv');
    setIsDocumentMode(true);
    const isEn = lang === 'en';
    const initialUserMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: isEn ? 'Please help me create a professional CV / Resume.' : 'Tolong buatkan saya CV profesional.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const initialAiMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'ai',
      text: isEn
        ? 'Hello! I am mKenzo AI, your professional CV & Resume builder. Please fill out Step 1 below to get started with your resume in English.'
        : 'Halo! Saya mKenzo, asisten pembuat CV profesional. Silakan lengkapi formulir Langkah 1 di bawah ini untuk memulai pengisian data CV Anda.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionForm: 1,
    };
    const newMsgs = [initialUserMsg, initialAiMsg];
    setMessages(newMsgs);
    if (currentUser?.email) {
      const convTitle = isEn ? 'Pembuatan CV' : 'Pembuatan CV Baru';
      await saveChatMessageToSupabase(currentUser.email, newSessionId, convTitle, initialUserMsg.text, 'user', null, 'cv');
      await saveChatMessageToSupabase(currentUser.email, newSessionId, convTitle, initialAiMsg.text, 'ai', 1, 'cv');
    }
    setActiveFormPopup(1); // Langsung alihkan ke form Langkah 1
    updateCurrentSession(newMsgs, 'cv', cvData, letterData, lang, cvColorTone, selectedTemplate.id, true, newSessionId);
  };

  // Action ketika klik "Buat Surat Lamaran Kerja" dari Halaman Awal
  const handleStartLetterForm = async (lang: 'id' | 'en' = docLanguage) => {
    // 3-History Quota check for authenticated user
    if (currentUser && sessions.length >= 3 && !activeSessionId) {
      setChatLimitNotice('Kamu sudah mencapai batas 3 riwayat chat. Hapus salah satu riwayat untuk memulai chat baru.');
      return;
    }

    const newSessionId = activeSessionId || ('session_' + Date.now());
    if (!activeSessionId && currentUser) {
      setActiveSessionId(newSessionId);
    }
    setDocLanguage(lang);
    setMode('letter');
    setIsDocumentMode(true);
    const isEn = lang === 'en';
    const initialUserMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: isEn ? 'Please help me draft a formal Cover Letter.' : 'Tolong buatkan saya Surat Lamaran Kerja.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const initialAiMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'ai',
      text: isEn
        ? 'Hello! I am mKenzo AI, your formal Cover Letter builder. Please complete the form below to craft your application letter in English.'
        : 'Halo! Saya mKenzo, asisten pembuat Surat Lamaran Kerja. Silakan isi formulir di bawah ini untuk menyusun surat lamaran pekerjaan Anda.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionForm: 4,
    };
    const newMsgs = [initialUserMsg, initialAiMsg];
    setMessages(newMsgs);
    if (currentUser?.email) {
      const convTitle = isEn ? 'Draft Surat Lamaran' : 'Pembuatan Surat Lamaran';
      await saveChatMessageToSupabase(currentUser.email, newSessionId, convTitle, initialUserMsg.text, 'user', null, 'letter');
      await saveChatMessageToSupabase(currentUser.email, newSessionId, convTitle, initialAiMsg.text, 'ai', 4, 'letter');
    }
    setActiveFormPopup(4); // Langsung alihkan ke form Surat Lamaran
    updateCurrentSession(newMsgs, 'letter', cvData, letterData, lang, cvColorTone, selectedTemplate.id, true, newSessionId);
  };

  // Switch to existing conversation session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setChatLimitNotice(null);
    setIsMobileSidebarOpen(false);
  };

  // Delete a specific conversation session permanently from Database & UI
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (currentUser?.email) {
      await deleteConversationFromSupabase(currentUser.email, sessionId);
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setChatLimitNotice(null); // Quota freed
    if (activeSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  // Clear all conversation sessions
  const handleClearAllSessions = () => {
    setShowClearConfirmModal(true);
  };

  const confirmClearAllSessions = async () => {
    setSessions([]);
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
    if (currentUser?.email) {
      await clearUserChatHistory(currentUser.email);
    }
    setChatLimitNotice(null);
    handleStartNewChat();
    setShowClearConfirmModal(false);
  };

  // Chat Submission Handler
  const handleChatSubmit = async (e: React.FormEvent | null, forcedQuery: string | null = null) => {
    if (e) e.preventDefault();
    const textToSubmit = forcedQuery || query;
    if (!textToSubmit.trim()) return;

    const lowerQ = textToSubmit.toLowerCase().trim();
    let currentMode = mode;
    let isAskingForDocument = false;
    let nextIsDocMode = isDocumentMode;

    // Deteksi intent eksplisit pembuatan dokumen (bukan sekadar pertanyaan umum yang mengandung kata kerja/pekerjaan)
    const isRequestingLetter =
      /\b(buat|buatkan|bikin|bikinin|tulis|tuliskan|create|make|write|draft)\b.*?\b(surat lamaran|cover letter|application letter)\b/i.test(lowerQ) ||
      /\b(surat lamaran|cover letter)\b.*?\b(baru|dong|tolong|please|bantu|buatkan)\b/i.test(lowerQ) ||
      /^(buat|bikin|tulis)\s+(surat|lamaran|cover letter)$/i.test(lowerQ) ||
      /\bsaya mau (buat|bikin|tulis) surat lamaran\b/i.test(lowerQ);

    const isRequestingCv =
      /\b(buat|buatkan|bikin|bikinin|susun|susunkan|create|make|build|generate)\b.*?\b(cv|resume|curriculum vitae|riwayat hidup)\b/i.test(lowerQ) ||
      /\b(cv|resume|curriculum vitae|daftar riwayat hidup)\b.*?\b(baru|dong|tolong|please|bantu|buatkan)\b/i.test(lowerQ) ||
      /^(buat|bikin|susun)\s+(cv|resume)$/i.test(lowerQ) ||
      /\bsaya mau (buat|bikin|susun) cv\b/i.test(lowerQ);

    if (isRequestingLetter) {
      currentMode = 'letter';
      setMode('letter');
      isAskingForDocument = true;
      nextIsDocMode = true;
      setIsDocumentMode(true);
      setActiveFormPopup(4); // Buka formulir surat lamaran
    } else if (isRequestingCv) {
      currentMode = 'cv';
      setMode('cv');
      isAskingForDocument = true;
      nextIsDocMode = true;
      setIsDocumentMode(true);
      setActiveFormPopup(1); // Buka formulir CV langkah 1
    } else {
      // Jika user tidak meminta dokumen dan belum dalam mode dokumen aktif, jadikan general chat alami
      if (!isDocumentMode) {
        currentMode = 'general';
        setMode('general');
        nextIsDocMode = false;
        setIsDocumentMode(false);
      }
    }

    // Gating Akses: Pengguna yang belum login hanya boleh menggunakan 1 kali sesi general chat
    if (!currentUser && !isAskingForDocument && !isDocumentMode && getGuestChatCount() >= 1) {
      setLoginReason('limit');
      setShowLoginModal(true);
      return;
    }

    // 3-History Quota check: if starting a brand new conversation without an active session
    if (currentUser && sessions.length >= 3 && !activeSessionId) {
      setChatLimitNotice('Kamu sudah mencapai batas 3 riwayat chat. Hapus salah satu riwayat untuk memulai chat baru.');
      return;
    }

    const currentConvId = activeSessionId || ('session_' + Date.now());
    if (!activeSessionId && currentUser) {
      setActiveSessionId(currentConvId);
    }

    const currentConvTitle =
      sessions.find((s) => s.id === currentConvId)?.title ||
      (textToSubmit.slice(0, 32) + (textToSubmit.length > 32 ? '...' : ''));

    setQuery('');
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsAiTyping(true);

    if (currentUser?.email) {
      const saveRes = await saveChatMessageToSupabase(
        currentUser.email,
        currentConvId,
        currentConvTitle,
        textToSubmit,
        'user',
        null,
        currentMode
      );
      if (saveRes.limitReached) {
        setChatLimitNotice(saveRes.error || 'Kamu sudah mencapai batas 3 riwayat chat. Hapus salah satu riwayat untuk memulai chat baru.');
        setIsAiTyping(false);
        return;
      }
    }

    try {
      const aiReply = await askAiChat(
        textToSubmit,
        newMessages.map((m) => ({ role: m.role, text: m.text })),
        currentMode,
        isAskingForDocument,
        docLanguage
      );

      const aiMsgId = 'msg_' + (Date.now() + 1);
      const initialAiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionForm: isAskingForDocument ? (currentMode === 'letter' ? 4 : 1) : null,
      };

      const msgsWithAi = [...newMessages, initialAiMsg];
      setMessages(msgsWithAi);
      setIsAiTyping(false);
      setStreamingMsgId(aiMsgId);

      // Efek mengetik dinamis (typewriter streaming)
      let currIndex = 0;
      const totalLen = aiReply.length;
      const chunkSize = Math.max(3, Math.min(10, Math.ceil(totalLen / 60)));
      const typeSpeed = 20; // 20ms per ketikan

      await new Promise<void>((resolve) => {
        const interval = setInterval(async () => {
          currIndex += chunkSize;
          if (currIndex >= totalLen) {
            clearInterval(interval);
            const finishedMsgs = msgsWithAi.map((m) =>
              m.id === aiMsgId ? { ...m, text: aiReply } : m
            );
            setMessages(finishedMsgs);
            setStreamingMsgId(null);
            if (currentUser?.email) {
              await saveChatMessageToSupabase(
                currentUser.email,
                currentConvId,
                currentConvTitle,
                aiReply,
                'ai',
                isAskingForDocument ? (currentMode === 'letter' ? 4 : 1) : null,
                currentMode,
                {
                  isDocumentMode: nextIsDocMode,
                  language: docLanguage,
                  colorTone: cvColorTone,
                  templateId: selectedTemplate.id,
                }
              );
            }
            updateCurrentSession(
              finishedMsgs,
              currentMode,
              cvData,
              letterData,
              docLanguage,
              cvColorTone,
              selectedTemplate.id,
              nextIsDocMode,
              currentConvId
            );

            // Setelah 1 kali balasan general chat selesai, kunci chat dan munculkan popup login Gmail
            if (!currentUser && !nextIsDocMode) {
              incrementGuestChatCount();
              setTimeout(() => {
                setLoginReason('limit');
                setShowLoginModal(true);
              }, 1000);
            }

            resolve();
          } else {
            const partial = aiReply.slice(0, currIndex);
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, text: partial } : m))
            );
          }
        }, typeSpeed);
      });
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAiTyping(false);
      setStreamingMsgId(null);
    }
  };

  // Photo Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...cvData, profileImage: reader.result as string };
        setCvData(updated);
        updateCurrentSession(messages, mode, updated, letterData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Document as PDF
  const handleExportPDF = () => {
    const originalTitle = document.title;
    document.title =
      mode === 'letter'
        ? letterData.nama
          ? `Surat_Lamaran_${letterData.nama.replace(/\s+/g, '_')}`
          : 'Surat_Lamaran_mKenzo'
        : cvData.titleCV || (cvData.name ? `CV_${cvData.name.replace(/\s+/g, '_')}` : 'CV_mKenzo_AI');

    window.print();
    document.title = originalTitle;
  };

  // CV Experience handlers
  const handleExpChange = (index: number, field: string, val: string | boolean) => {
    const newExp = [...cvData.experience];
    newExp[index] = { ...newExp[index], [field]: val };
    const updated = { ...cvData, experience: newExp };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const deleteExp = (index: number) => {
    const updated = {
      ...cvData,
      experience: cvData.experience.filter((_, i) => i !== index),
    };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const deleteSkill = (index: number) => {
    const updated = { ...cvData, skills: cvData.skills.filter((_, i) => i !== index) };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const deleteEdu = (index: number) => {
    const updated = { ...cvData, education: cvData.education.filter((_, i) => i !== index) };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const deleteProject = (index: number) => {
    const updated = { ...cvData, projects: cvData.projects.filter((_, i) => i !== index) };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const deleteAward = (index: number) => {
    const updated = { ...cvData, awards: cvData.awards.filter((_, i) => i !== index) };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  const handleNotWorkingToggle = () => {
    const nextVal = !cvData.notWorking;
    const updated = {
      ...cvData,
      notWorking: nextVal,
      title: nextVal ? 'OPEN TO WORK' : '',
    };
    setCvData(updated);
    updateCurrentSession(messages, mode, updated, letterData);
  };

  // AI Generation Trigger: Job Description
  const toggleAiDesc = async (index: number) => {
    const currentState = cvData.experience[index]?.aiDesc;
    handleExpChange(index, 'aiDesc', !currentState);
    if (!currentState) {
      setIsGeneratingDesc((prev) => ({ ...prev, [index]: true }));
      handleExpChange(
        index,
        'desc',
        docLanguage === 'en'
          ? 'AI is analyzing and crafting 5 professional job descriptions in English...'
          : 'AI sedang menganalisis dan menyusun 5 deskripsi pekerjaan...'
      );

      const exp = cvData.experience[index];
      const descResult = await generateJobDescription(
        exp.position || (docLanguage === 'en' ? 'Professional Staff' : 'Staf Profesional'),
        exp.company,
        docLanguage
      );
      handleExpChange(index, 'desc', descResult);
      setIsGeneratingDesc((prev) => ({ ...prev, [index]: false }));
    }
  };

  // AI Generation Trigger: Profile Summary
  const toggleAiProfile = async () => {
    const currentState = cvData.aiProfile;
    setCvData((prev) => ({ ...prev, aiProfile: !currentState }));
    if (!currentState) {
      setIsGeneratingProfile(true);
      setCvData((prev) => ({
        ...prev,
        profile:
          docLanguage === 'en'
            ? 'AI is crafting your executive summary in English...'
            : 'AI sedang menulis profil menarik Anda...',
      }));

      const expPos =
        cvData.experience[0]?.position || (docLanguage === 'en' ? 'Professional' : 'Profesional');
      const expComp = cvData.experience[0]?.company || '';

      const profileResult = await generateProfileSummary(
        expPos,
        expComp,
        cvData.notWorking,
        cvData.title,
        docLanguage
      );
      const updated = { ...cvData, profile: profileResult, aiProfile: true };
      setCvData(updated);
      updateCurrentSession(messages, mode, updated, letterData);
      setIsGeneratingProfile(false);
    }
  };

  // AI Generation Trigger: Skills
  const toggleAiSkills = async () => {
    const currentState = cvData.aiSkills;
    setCvData((prev) => ({ ...prev, aiSkills: !currentState }));
    if (!currentState) {
      setIsGeneratingSkills(true);
      const role =
        (cvData.notWorking ? cvData.experience[0]?.position : cvData.title) ||
        cvData.experience[0]?.position ||
        (docLanguage === 'en' ? 'Professional' : 'Profesional');

      const generated = await generateSkillsList(role, docLanguage);
      const updated = { ...cvData, skills: generated, aiSkills: true };
      setCvData(updated);
      updateCurrentSession(messages, mode, updated, letterData);
      setIsGeneratingSkills(false);
    }
  };

  // Helper to construct dynamic qualification paragraph preview
  const buildLetterParagraphSync = (
    tools: string,
    achievements: string,
    company: string,
    position: string,
    lang: 'id' | 'en'
  ) => {
    if (lang === 'en') {
      const toolsPart = tools && tools.trim()
        ? `hands-on proficiency in ${tools.trim()}`
        : 'technical proficiency with industry-standard software tools and operational workflows';
      const achievementPart = achievements && achievements.trim()
        ? `proven experience in ${achievements.trim()}`
        : 'a proven track record of delivering measurable outcomes and meeting high performance standards';
      return `Throughout my academic and professional career, I have cultivated ${toolsPart}. Backed by ${achievementPart}, I possess the practical capability and dedicated work ethic required to create immediate impact for ${company || 'your organization'}. I look forward to leveraging these skills to actively support the ongoing success and growth of the ${position || 'team'}.`;
    }

    const toolsPart = tools && tools.trim()
      ? `penguasaan yang baik terhadap perangkat dan aplikasi ${tools.trim()}`
      : 'kemampuan mengoperasikan berbagai perangkat lunak serta aplikasi pendukung kerja';
    const achievementPart = achievements && achievements.trim()
      ? `pengalaman nyata dalam ${achievements.trim()}`
      : 'pengalaman kerja nyata dalam menyelesaikan tanggung jawab secara terukur, cermat, dan tepat waktu';
    return `Selama menempuh pendidikan dan pengalaman kerja sebelumnya, saya telah mengasah ${toolsPart}. Berbekal ${achievementPart}, saya terbiasa bekerja dengan standar profesional tinggi serta berorientasi pada hasil dan efisiensi. Saya meyakini kombinasi kompetensi teknis dan dedikasi ini dapat memberikan kontribusi nyata bagi pencapaian target ${company || 'perusahaan'}.`;
  };

  // AI Generation Trigger: Cover Letter Specific Body Paragraph (Paragraf 2)
  const handleGenerateLetterParagraph = async () => {
    setIsGeneratingLetterParagraph(true);
    const isEn = docLanguage === 'en';
    const initialPlaceholder = isEn
      ? 'AI is crafting a tailored, high-impact qualification paragraph highlighting your tools and achievements...'
      : 'AI sedang merangkai paragraf kualifikasi spesifik dengan alat kerja dan pencapaian Anda...';

    setLetterData((prev) => ({
      ...prev,
      paragrafKualifikasi: initialPlaceholder,
      aiParagraf: true,
    }));

    try {
      const generated = await generateCoverLetterParagraph(
        letterData.posisiDilamar,
        letterData.namaPerusahaan,
        letterData.keahlianTools,
        letterData.pencapaianSpesifik,
        letterData.pendidikanTerakhir,
        docLanguage
      );

      setLetterData((prev) => {
        const updated = {
          ...prev,
          paragrafKualifikasi: generated,
          aiParagraf: true,
        };
        updateCurrentSession(messages, mode, cvData, updated, docLanguage);
        return updated;
      });
    } catch (e) {
      console.error('Error generating cover letter paragraph:', e);
    } finally {
      setIsGeneratingLetterParagraph(false);
    }
  };

  if (appView === 'portfolio') {
    return <PortfolioStudio onBackToApp={() => setAppView('main')} />;
  }

  return (
    <div className="flex h-screen bg-[#131314] overflow-hidden print:bg-white print:h-auto font-sans text-white">
      {/* ================= SIDEBAR (DESKTOP & MOBILE DRAWER) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#1e1f20] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden md:flex'
        }`}
      >
        {/* Brand Header: Hanya Logo dan mKenzo AI (tanpa text tambahan di bawahnya) */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-lg font-bold text-gray-100 tracking-tight">mKenzo AI</span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Home Button (sebelumnya Obrolan Baru) */}
        <div className="p-3 pb-1.5">
          <button
            onClick={handleStartNewChat}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-3 rounded-xl text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Home size={18} /> Home
          </button>
        </div>

        {/* Portfolio Website Builder Navigation Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              setAppView('portfolio');
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-800/50 hover:to-blue-800/50 border border-purple-500/30 p-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>Portfolio Builder</span>
            </span>
            <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-500/40 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              ZIP Export
            </span>
          </button>
        </div>

        {/* RIWAYAT PERCAKAPAN (CONVERSATION SESSIONS) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="flex items-center justify-between px-2 pt-2 pb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" /> Riwayat Percakapan
              {currentUser && sessions.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold border ${
                  sessions.length >= 3
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/10 text-gray-300 border-white/10'
                }`}>
                  {sessions.length}/3
                </span>
              )}
            </span>
            {currentUser && sessions.length > 0 && (
              <button
                onClick={handleClearAllSessions}
                title="Hapus semua riwayat"
                className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
              >
                Hapus Semua
              </button>
            )}
          </div>

          {!currentUser ? (
            <div className="p-4 text-center text-xs text-gray-400 italic">
              Masuk dengan akun Google untuk menyimpan riwayat percakapan.
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 italic">
              Belum ada riwayat percakapan. Mulai percakapan pertama Anda!
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => handleSelectSession(sess.id)}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-medium'
                      : 'text-gray-300 hover:bg-[#2a2b2f]'
                  }`}
                >
                  <MessageSquare
                    size={15}
                    className={isActive ? 'text-blue-400 shrink-0' : 'text-gray-400 shrink-0'}
                  />
                  <div className="flex-1 truncate">
                    <p className="truncate">{sess.title || 'Percakapan'}</p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(sess.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, sess.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-gray-400 p-1 transition-opacity cursor-pointer"
                    title="Hapus sesi ini secara permanen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* AKSI DOKUMEN: HANYA DITAMPILKAN KETIKA USER AKTIF MEMBUAT DOKUMEN (BUKAN CHAT UMUM / GENERAL) */}
        {isDocumentMode && (
          <div className="p-3 border-t border-white/5 space-y-1.5 bg-[#171819]">
            <div className="text-[10px] text-gray-400 font-bold px-2 uppercase tracking-widest flex items-center justify-between">
              <span>Aksi Dokumen</span>
              {!currentUser && (
                <span className="text-[9px] text-amber-400 font-normal flex items-center gap-1">
                  <Lock size={10} /> Terkunci
                </span>
              )}
            </div>
            {mode === 'cv' && (
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="w-full flex items-center gap-2.5 hover:bg-[#2a2b2f] px-3 py-2 rounded-lg text-xs text-gray-300 transition-colors cursor-pointer"
              >
                <LayoutTemplate size={15} className="text-amber-400" /> Pilih Template CV
              </button>
            )}
            <button
              onClick={handleOpenPreviewSafely}
              className="w-full flex items-center justify-between hover:bg-[#2a2b2f] px-3 py-2 rounded-lg text-xs text-gray-300 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <Eye size={15} className="text-blue-400" /> Preview Dokumen
              </span>
              {!currentUser ? (
                <Lock size={13} className="text-amber-400 shrink-0" />
              ) : null}
            </button>
            <button
              onClick={handleExportPdfSafely}
              className="w-full flex items-center justify-between hover:bg-[#2a2b2f] px-3 py-2 rounded-lg text-xs text-gray-300 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <Download size={15} className="text-emerald-400" /> Export ke PDF
              </span>
              {!currentUser ? (
                <Lock size={13} className="text-amber-400 shrink-0" />
              ) : null}
            </button>
          </div>
        )}

        {/* USER PROFILE CARD (DILETAKKAN DI BAWAH KIRI SIDEBAR) */}
        <div className="p-3 border-t border-white/5 bg-[#171819]/90 mt-auto">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    currentUser.picture ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                  }
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/50 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-100 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-blue-400 font-medium truncate">
                    @{currentUser.username}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar / Logout"
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-300 font-medium mb-2">
                <Lock size={12} className="text-amber-400" />
                <span>Akses Tamu (Guest)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginReason('general');
                  setShowLoginModal(true);
                }}
                className="w-full py-2 px-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Masuk via Gmail
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ================= AREA UTAMA (Landing / Chat View) ================= */}
      <main className="flex-1 flex flex-col relative bg-[#131314] print:hidden h-screen overflow-hidden">
        {/* Top Navbar: DITAMPILKAN KETIKA USER BERADA DALAM PERCAKAPAN */}
        {messages.length > 0 ? (
          <header className="h-14 border-b border-white/5 px-4 flex items-center justify-between shrink-0 bg-[#1e1f20]/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden text-gray-300 hover:text-white p-1 cursor-pointer"
              >
                <Menu size={20} />
              </button>
              {isDocumentMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">
                    Mode:{' '}
                    <span className="text-blue-400 capitalize">
                      {mode === 'cv' ? 'Curriculum Vitae (CV)' : 'Surat Lamaran Kerja'}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-blue-400" /> mKenzo AI
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isDocumentMode ? (
                <>
                  {/* Language Switcher Pill */}
                  <div className="flex items-center bg-[#131314] rounded-lg p-0.5 border border-white/10 text-xs mr-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDocLanguage('id');
                        updateCurrentSession(messages, mode, cvData, letterData, 'id', cvColorTone, selectedTemplate.id, true);
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        docLanguage === 'id'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Bahasa Indonesia"
                    >
                      <span>🇮🇩</span> <span className="hidden sm:inline">Indonesia</span><span className="sm:hidden">ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDocLanguage('en');
                        updateCurrentSession(messages, mode, cvData, letterData, 'en', cvColorTone, selectedTemplate.id, true);
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        docLanguage === 'en'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="English (Bahasa Inggris)"
                    >
                      <span>🇬🇧</span> <span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span>
                    </button>
                  </div>

                  <button
                    onClick={handleOpenPreviewSafely}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2b2f] hover:bg-[#34353a] text-xs text-gray-200 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    {!currentUser ? (
                      <Lock size={12} className="text-amber-400" />
                    ) : (
                      <Eye size={14} className="text-blue-400" />
                    )}
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleExportPdfSafely}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {!currentUser ? (
                      <Lock size={12} className="text-emerald-200" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>Export PDF</span>
                  </button>
                </>
              ) : (
                /* Di Mode General: Sediakan tombol cepat jika user sewaktu-waktu ingin membuat dokumen */
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguageModalConfig({ open: true, targetMode: 'cv' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2b2f] hover:bg-[#34353a] text-xs text-gray-200 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
                  >
                    <Briefcase size={14} className="text-blue-400" />
                    <span className="hidden sm:inline">Mulai Buat CV</span>
                    <span className="sm:hidden">CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguageModalConfig({ open: true, targetMode: 'letter' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2b2f] hover:bg-[#34353a] text-xs text-gray-200 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                  >
                    <FileText size={14} className="text-purple-400" />
                    <span className="hidden sm:inline">Surat Lamaran</span>
                    <span className="sm:hidden">Surat</span>
                  </button>
                </div>
              )}
            </div>
          </header>
        ) : (
          /* Mobile menu toggle button saat di halaman awal */
          <div className="md:hidden absolute top-4 left-4 z-20">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-[#1e1f20] border border-white/10 text-gray-300 hover:text-white"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Content Body: Landing or Chat */}
        {/* Content Body: Landing or Chat */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#131314] to-[#131314]">
            <div className="mb-10 flex flex-col items-center text-center max-w-2xl">
              <Logo size="lg" className="mb-6 shadow-2xl shadow-indigo-500/20" />
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 mb-3">
                HI! Saya mKenzo AI
              </h1>
              <p className="text-base md:text-xl text-gray-300 font-medium">
                Ada yang bisa saya bantu?
              </p>
            </div>

            {/* Main Prompt Bar */}
            <form
              onSubmit={(e) => handleChatSubmit(e)}
              className="w-full max-w-2xl relative mb-6 group"
            >
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Sparkles size={19} className="text-blue-400 animate-gemini-glow" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tanya apa saja ke mKenzo"
                className="w-full bg-[#1e1f20] text-gray-100 text-base md:text-lg font-medium rounded-full py-4 pl-12 pr-14 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-xl shadow-black/40 hover:bg-[#252628] placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute inset-y-0 right-2 flex items-center justify-center w-11 h-11 my-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-transparent rounded-full text-white transition-colors cursor-pointer"
              >
                <Send size={18} />
              </button>
            </form>

            {/* Quick Starter Cards: Membuka Modal Pilihan Bahasa atau Portfolio Studio */}
            <div className="flex flex-wrap justify-center gap-3.5 max-w-3xl w-full">
              <button
                onClick={() => setLanguageModalConfig({ open: true, targetMode: 'cv' })}
                className="px-6 py-3.5 bg-[#1e1f20] hover:bg-[#2a2b2f] border border-white/10 hover:border-blue-500/60 rounded-2xl flex items-center gap-3 text-sm md:text-base font-semibold text-gray-100 transition-all hover:scale-[1.02] shadow-md shadow-black/30 cursor-pointer"
              >
                <Briefcase size={19} className="text-blue-400" /> Buat CV Profesional
              </button>
              <button
                onClick={() => setLanguageModalConfig({ open: true, targetMode: 'letter' })}
                className="px-6 py-3.5 bg-[#1e1f20] hover:bg-[#2a2b2f] border border-white/10 hover:border-purple-500/60 rounded-2xl flex items-center gap-3 text-sm md:text-base font-semibold text-gray-100 transition-all hover:scale-[1.02] shadow-md shadow-black/30 cursor-pointer"
              >
                <FileText size={19} className="text-purple-400" /> Buat Surat Lamaran
              </button>
              <button
                onClick={() => setAppView('portfolio')}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-950/40 to-blue-950/40 hover:from-purple-900/50 hover:to-blue-900/50 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl flex items-center gap-3 text-sm md:text-base font-semibold text-gray-100 transition-all hover:scale-[1.02] shadow-md shadow-black/30 cursor-pointer"
              >
                <Globe size={19} className="text-purple-400" /> Portfolio Website Builder
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                  Live Studio
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-7 pb-28">
              <div className="max-w-3xl mx-auto space-y-7">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' ? (
                      <div className="flex gap-3.5 md:gap-4 max-w-[98%] md:max-w-[94%] items-start animate-gemini-message group">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/25 shrink-0 mt-0.5">
                          <div className="w-full h-full bg-[#131418] rounded-[14px] flex items-center justify-center">
                            <Sparkles size={18} className="text-blue-400 animate-gemini-glow" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                          {/* Rich Markdown Gemini Renderer */}
                          <div className="bg-[#1a1c22]/90 backdrop-blur-md p-5 md:p-6 rounded-3xl rounded-tl-md border border-white/10 shadow-xl shadow-black/25 overflow-x-auto">
                            <ChatMessageRenderer
                              content={msg.text}
                              isStreaming={streamingMsgId === msg.id}
                            />
                          </div>

                          {/* Bottom Action Row (Copy + Action Form + Timestamp) */}
                          <div className="flex items-center gap-2 pl-1">
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer font-medium"
                              title="Salin jawaban"
                            >
                              {copiedMsgId === msg.id ? (
                                <>
                                  <Check size={14} className="text-emerald-400" />
                                  <span className="text-emerald-300 font-semibold">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} className="text-gray-400" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>

                            {/* Quick Interactive Form Step Button (Hanya jika sedang dalam mode pembuatan dokumen) */}
                            {msg.actionForm && isDocumentMode && (
                              <button
                                onClick={() => setActiveFormPopup(msg.actionForm!)}
                                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 group shadow-md shadow-blue-600/25 cursor-pointer ml-1"
                              >
                                <FileText size={15} />
                                {msg.actionForm === 4
                                  ? 'Isi Formulir Surat Lamaran'
                                  : `Buka Formulir Langkah ${msg.actionForm}`}
                                <ChevronRight
                                  size={15}
                                  className="group-hover:translate-x-0.5 transition-transform"
                                />
                              </button>
                            )}

                            <span className="text-[11px] text-gray-400 ml-auto font-medium">{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1.5 max-w-[85%] md:max-w-[78%] animate-gemini-message">
                        <div className="text-[15.5px] md:text-base leading-relaxed bg-[#282a30] text-white px-5 py-3.5 rounded-3xl rounded-tr-md border border-white/10 shadow-md font-medium">
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-gray-400 mr-2 font-medium">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex gap-3.5 md:gap-4 max-w-[85%] items-center animate-gemini-message">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/25 shrink-0">
                      <div className="w-full h-full bg-[#131418] rounded-[14px] flex items-center justify-center">
                        <Sparkles size={18} className="text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                    </div>
                    <div className="bg-[#1a1c22] px-5 py-3.5 rounded-3xl rounded-tl-md border border-white/10 flex items-center gap-3.5 shadow-md">
                      <span className="text-sm md:text-base font-semibold text-gray-200">mKenzo sedang berpikir</span>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Fixed Chat Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#131314] via-[#131314]/90 to-transparent">
              <form onSubmit={(e) => handleChatSubmit(e)} className="max-w-3xl mx-auto relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isAiTyping}
                  placeholder="Tanya apa saja ke mKenzo"
                  className="w-full bg-[#1e1f20] text-gray-100 text-[15px] md:text-base font-medium rounded-full py-4 pl-6 pr-14 border border-white/10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xl disabled:opacity-50 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={isAiTyping || !query.trim()}
                  className="absolute inset-y-0 right-2 flex items-center justify-center w-11 h-11 my-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-transparent rounded-full text-white transition-colors cursor-pointer"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ===================== RENDER DOKUMEN CETAK (PRINT MEDIA ONLY) ===================== */}
      <div className="hidden print:block fixed inset-0 bg-white text-black z-[9999] w-full h-full p-0 m-0">
        {mode === 'cv' ? (
          <UniversalCvRender
            cvData={cvData}
            templateId={selectedTemplate.id}
            language={docLanguage}
            colorTone={cvColorTone}
          />
        ) : (
          <CoverLetter letterData={letterData} language={docLanguage} />
        )}
      </div>

      {/* ===================== MODAL PILIHAN BAHASA DOKUMEN ===================== */}
      {languageModalConfig?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 print:hidden">
          <div className="bg-[#1e1f20] rounded-2xl w-full max-w-xl p-6 md:p-8 border border-white/10 relative shadow-2xl">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">🌐</span>
                  Pilih Bahasa Dokumen
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  Pilih bahasa untuk{' '}
                  <span className="text-blue-400 font-semibold">
                    {languageModalConfig.targetMode === 'cv'
                      ? 'CV / Resume'
                      : 'Surat Lamaran Kerja'}
                  </span>{' '}
                  dan instruksi pembuatan otomatis AI.
                </p>
              </div>
              <button
                onClick={() => setLanguageModalConfig(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Option 1: Bahasa Indonesia */}
              <button
                type="button"
                onClick={() => {
                  const target = languageModalConfig.targetMode;
                  setLanguageModalConfig(null);
                  if (target === 'cv') {
                    handleStartCvForm('id');
                  } else {
                    handleStartLetterForm('id');
                  }
                }}
                className="flex flex-col text-left p-5 rounded-2xl bg-[#25262a] hover:bg-[#2c2d33] border-2 border-transparent hover:border-blue-500/70 transition-all group cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🇮🇩</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase tracking-wide">
                    Standar ID
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Bahasa Indonesia
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Format resmi Indonesia. AI akan menyusun deskripsi kerja, keahlian, dan ringkasan dalam Bahasa Indonesia baku yang profesional.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                  Pilih Bahasa Indonesia{' '}
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: English (Bahasa Inggris) */}
              <button
                type="button"
                onClick={() => {
                  const target = languageModalConfig.targetMode;
                  setLanguageModalConfig(null);
                  if (target === 'cv') {
                    handleStartCvForm('en');
                  } else {
                    handleStartLetterForm('en');
                  }
                }}
                className="flex flex-col text-left p-5 rounded-2xl bg-[#25262a] hover:bg-[#2c2d33] border-2 border-transparent hover:border-indigo-500/70 transition-all group cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🇬🇧</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 uppercase tracking-wide">
                    Global / MNC
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  English (Bahasa Inggris)
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Standar internasional. AI wajib membuat deskripsi kerja, keahlian, dan cover letter lengkap dalam bahasa Inggris formal berkualitas tinggi.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  Pilih English{' '}
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLanguageModalConfig(null)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL PREVIEW DOKUMEN ===================== */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-6 print:hidden">
          <div className="bg-[#1e1f20] rounded-2xl w-full max-w-5xl h-[92vh] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#1a1b1c]">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Preview {mode === 'cv' ? `CV (${selectedTemplate.name})` : 'Surat Lamaran Kerja'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Format cetak A4 standard internasional (210mm x 297mm) • Kepadatan Adaptif
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Switcher in Preview Modal */}
                <div className="flex items-center bg-[#131314] rounded-lg p-0.5 border border-white/10 text-xs mr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDocLanguage('id');
                      updateCurrentSession(messages, mode, cvData, letterData, 'id');
                    }}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      docLanguage === 'id'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Bahasa Indonesia"
                  >
                    <span>🇮🇩</span> ID
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDocLanguage('en');
                      updateCurrentSession(messages, mode, cvData, letterData, 'en');
                    }}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      docLanguage === 'en'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="English (Bahasa Inggris)"
                  >
                    <span>🇬🇧</span> EN
                  </button>
                </div>

                {mode === 'cv' && (
                  <>
                    {/* Tombol Color Picker / Tema Warna */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="bg-[#2a2b2f] hover:bg-[#34353a] text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-white/10"
                        title="Ubah Tone / Tema Warna CV"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full ring-2 ring-white/40 shrink-0 shadow-xs"
                          style={{ backgroundColor: cvColorTone }}
                        />
                        <Palette size={14} className="text-pink-400" />
                        <span>Tema Warna</span>
                      </button>

                      {showColorPicker && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1e1f20] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <Palette size={14} className="text-pink-400" />
                              Pilih Tone / Warna Template
                            </h4>
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(false)}
                              className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Swatch Presets */}
                          <div className="mb-3">
                            <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Preset Tone Populer:</label>
                            <div className="grid grid-cols-4 gap-2">
                              {PRESET_COLOR_TONES.map((preset) => {
                                const isSelected = cvColorTone.toLowerCase() === preset.hex.toLowerCase();
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => {
                                      setCvColorTone(preset.hex);
                                      updateCurrentSession(messages, mode, cvData, letterData, docLanguage, preset.hex, selectedTemplate.id);
                                    }}
                                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'border-blue-400 bg-blue-500/20 shadow-md scale-105'
                                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                    }`}
                                    title={preset.name}
                                  >
                                    <span
                                      className="w-5 h-5 rounded-full ring-1 ring-white/20 mb-1"
                                      style={{ backgroundColor: preset.hex }}
                                    />
                                    <span className="text-[9px] text-gray-300 truncate max-w-full font-medium">{preset.name.split(' ')[0]}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom Color Input */}
                          <div className="pt-2 border-t border-white/10">
                            <label className="text-[11px] text-gray-400 block mb-1.5 font-medium">Warna Kustom (Color Picker):</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cvColorTone}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCvColorTone(val);
                                  updateCurrentSession(messages, mode, cvData, letterData, docLanguage, val, selectedTemplate.id);
                                }}
                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
                                title="Buka Palet Warna Sistem"
                              />
                              <input
                                type="text"
                                value={cvColorTone}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCvColorTone(val);
                                  if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                                    updateCurrentSession(messages, mode, cvData, letterData, docLanguage, val, selectedTemplate.id);
                                  }
                                }}
                                placeholder="#f59e0b"
                                className="flex-1 bg-[#131314] text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/10 outline-none uppercase font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultColor = selectedTemplate.id.startsWith('tpl-c') ? '#f59e0b' : '#334155';
                                  setCvColorTone(defaultColor);
                                  updateCurrentSession(messages, mode, cvData, letterData, docLanguage, defaultColor, selectedTemplate.id);
                                }}
                                className="text-[10px] text-gray-400 hover:text-white px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPreview(false);
                        setShowTemplateSelector(true);
                      }}
                      className="bg-[#2a2b2f] hover:bg-[#34353a] text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <LayoutTemplate size={14} className="text-amber-400" /> Ganti Template ({selectedTemplate.type})
                    </button>
                  </>
                )}
                <button
                  onClick={handleExportPDF}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  <Download size={15} /> Export PDF
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Render Area */}
            <div className="flex-1 overflow-y-auto overflow-x-auto bg-[#0e0f10] p-6 flex justify-center items-start">
              <div className="shadow-2xl origin-top my-4">
                {mode === 'cv' ? (
                  <UniversalCvRender
                    cvData={cvData}
                    templateId={selectedTemplate.id}
                    language={docLanguage}
                    colorTone={cvColorTone}
                  />
                ) : (
                  <CoverLetter letterData={letterData} language={docLanguage} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL PEMILIHAN TEMPLATE CV (20 TEMPLATES) ===================== */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 print:hidden">
          <div className="bg-[#1e1f20] rounded-2xl w-full max-w-5xl p-6 border border-white/10 relative max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <LayoutTemplate className="text-amber-400" size={22} />
                  Pilih Template CV (20 Pilihan Desain)
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  10 Template Creative bergaya modern & 10 Template ATS standar screening HRD. Semua didesain padat tanpa void kosong.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 shrink-0 overflow-x-auto pb-1">
              <button
                onClick={() => setTemplateFilterTab('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  templateFilterTab === 'ALL'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#2a2b2f] text-gray-300 hover:bg-[#34353a]'
                }`}
              >
                Semua Desain (20)
              </button>
              <button
                onClick={() => setTemplateFilterTab('Creative')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  templateFilterTab === 'Creative'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30'
                    : 'bg-[#2a2b2f] text-gray-300 hover:bg-[#34353a]'
                }`}
              >
                <Sparkles size={13} className="text-amber-300" /> Creative Modern (10)
              </button>
              <button
                onClick={() => setTemplateFilterTab('ATS')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  templateFilterTab === 'ATS'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#2a2b2f] text-gray-300 hover:bg-[#34353a]'
                }`}
              >
                <CheckCircle2 size={13} className="text-blue-300" /> ATS-Friendly (10)
              </button>
            </div>

            {/* Grid Daftar Template */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_TEMPLATES.filter(
                  (tpl) => templateFilterTab === 'ALL' || tpl.type === templateFilterTab
                ).map((tpl) => {
                  const isSelected = selectedTemplate.id === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setShowTemplateSelector(false);
                        setShowPreview(true);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600/15 shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-[#161719] hover:border-white/30 hover:bg-[#1c1d20]'
                      }`}
                    >
                      <div className="h-44 rounded-xl bg-white overflow-hidden shadow-inner mb-3 transition-transform group-hover:scale-[1.02]">
                        <TemplateThumbnail template={tpl} colorTone={cvColorTone} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              tpl.type === 'Creative'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {tpl.type}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                              Aktif
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-1">
                          {tpl.name}
                        </h3>
                        <p className="text-[10.5px] text-gray-400 line-clamp-1">
                          {tpl.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
              <span>Klik pada template untuk langsung menerapkan & melihat preview</span>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="px-4 py-2 bg-[#2a2b2f] hover:bg-[#34353a] text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FORM POPUP 1: DATA DIRI CV ===================== */}
      {activeFormPopup === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-2xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Langkah 1: Data Diri</h2>
              <button
                onClick={() => setActiveFormPopup(0)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium">Judul Dokumen CV</label>
                <input
                  type="text"
                  className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                  value={cvData.titleCV}
                  onChange={(e) => setCvData({ ...cvData, titleCV: e.target.value })}
                  placeholder="Misal: CV_Frontend_Developer_2026"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                  value={cvData.name}
                  onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
                  placeholder="Nama lengkap Anda beserta gelar (jika ada)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Nomor WhatsApp / Telp</label>
                  <input
                    type="text"
                    className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                    value={cvData.phone}
                    onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                    placeholder="Misal: 0812-3456-7890"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Alamat Email</label>
                  <input
                    type="email"
                    className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                    value={cvData.email}
                    onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    placeholder="nama.anda@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium">Lokasi / Domisili Kota</label>
                <input
                  type="text"
                  className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                  value={cvData.location}
                  onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                  placeholder="Misal: Jakarta Selatan, DKI Jakarta"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium">URL Profil LinkedIn</label>
                  <input
                    type="text"
                    className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                    value={cvData.linkedin}
                    onChange={(e) => setCvData({ ...cvData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Website / Portofolio</label>
                  <input
                    type="text"
                    className="w-full bg-[#131314] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                    value={cvData.website}
                    onChange={(e) => setCvData({ ...cvData, website: e.target.value })}
                    placeholder="portofolio-anda.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Pas Foto</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-[#131314] text-gray-200 px-4 py-3 rounded-xl border border-white/10 hover:border-blue-500 flex-1 text-center text-xs transition-colors">
                    <Upload className="inline mr-2" size={15} /> Upload Pas Foto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {cvData.profileImage && (
                    <div className="relative group">
                      <img
                        src={cvData.profileImage}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-xl border border-white/20"
                      />
                      <button
                        onClick={() => setCvData({ ...cvData, profileImage: '' })}
                        className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 text-white"
                        title="Hapus foto"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActiveFormPopup(0)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setActiveFormPopup(0);
                  updateCurrentSession(messages, mode, cvData, letterData, docLanguage);
                  setIsAiTyping(true);
                  const isEn = docLanguage === 'en';
                  const userNote: ChatMessage = {
                    id: 'msg_' + Date.now(),
                    role: 'user',
                    text: isEn
                      ? 'Personal details have been saved.'
                      : 'Data diri telah saya lengkapi dan simpan.',
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  };
                  setMessages((prev) => [...prev, userNote]);
                  setTimeout(() => {
                    const aiReply: ChatMessage = {
                      id: 'msg_' + (Date.now() + 1),
                      role: 'ai',
                      text: isEn
                        ? 'Great! Your personal info is saved. Now, let’s configure your work experience, executive profile, and key competencies.'
                        : 'Data diri Anda berhasil disimpan! Sekarang mari kita susun riwayat pekerjaan, profil, dan keahlian.',
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                      actionForm: 2,
                    };
                    const finalMsg = [...messages, userNote, aiReply];
                    setMessages(finalMsg);
                    updateCurrentSession(finalMsg, mode, cvData, letterData, docLanguage);
                    setIsAiTyping(false);
                  }, 800);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {docLanguage === 'en' ? 'Save & Continue to Step 2' : 'Simpan & Lanjut ke Langkah 2'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FORM POPUP 2: PEKERJAAN & SKILL ===================== */}
      {activeFormPopup === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">
                Langkah 2: Pekerjaan, Keahlian, & Profil
              </h2>
              <button
                onClick={() => setActiveFormPopup(0)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Pekerjaan Saat Ini */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <label className="text-xs font-semibold text-gray-300 mb-2 block">
                Profesi / Posisi Target
              </label>
              <div
                className="flex items-center gap-2 mb-3 cursor-pointer w-fit select-none"
                onClick={handleNotWorkingToggle}
              >
                {cvData.notWorking ? (
                  <CheckSquare className="text-blue-400" size={17} />
                ) : (
                  <Square className="text-gray-500" size={17} />
                )}
                <span className="text-xs text-gray-300">
                  Sedang tidak bekerja (Otomatis ditandai <b>Open To Work</b>)
                </span>
              </div>
              <input
                type="text"
                disabled={cvData.notWorking}
                className="w-full bg-[#1e1f20] text-white text-sm p-3 rounded-xl border border-white/10 uppercase disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-blue-500"
                value={cvData.title}
                onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                placeholder="Misal: SENIOR SOFTWARE ENGINEER"
              />
            </div>

            {/* Riwayat Pengalaman Kerja */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  Pengalaman Kerja
                </h3>
              </div>
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/5 relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-blue-400 font-semibold">
                      Pengalaman #{idx + 1}
                    </span>
                    <button
                      onClick={() => deleteExp(idx)}
                      className="text-red-400 p-1 hover:text-red-300"
                      title="Hapus pengalaman ini"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] text-gray-400">Posisi / Jabatan</label>
                      <input
                        type="text"
                        className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                        value={exp.position}
                        onChange={(e) => handleExpChange(idx, 'position', e.target.value)}
                        placeholder="Misal: Marketing Specialist"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400">Nama Perusahaan</label>
                      <input
                        type="text"
                        className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                        value={exp.company}
                        onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                        placeholder="PT Contoh Perusahaan"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-[11px] text-gray-400">Periode Tahun</label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                      value={exp.year}
                      onChange={(e) => handleExpChange(idx, 'year', e.target.value)}
                      placeholder="Misal: 2022 - Sekarang / 2020 - 2022"
                    />
                  </div>

                  <div className="mt-2">
                    <div
                      className="flex items-center gap-2 mb-2 cursor-pointer w-fit select-none"
                      onClick={() => toggleAiDesc(idx)}
                    >
                      {exp.aiDesc ? (
                        <CheckSquare className="text-blue-400" size={16} />
                      ) : (
                        <Square className="text-gray-500" size={16} />
                      )}
                      <span className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
                        <Sparkles size={13} /> AI Auto-Generate Deskripsi (Min. 5 Poin)
                      </span>
                      {isGeneratingDesc[idx] && (
                        <Loader2 size={13} className="animate-spin text-blue-400 ml-1" />
                      )}
                    </div>
                    <textarea
                      className={`w-full bg-[#1e1f20] text-white p-3 rounded-xl border border-white/10 min-h-[100px] text-xs outline-none focus:border-blue-500 ${
                        isGeneratingDesc[idx] ? 'opacity-50' : ''
                      }`}
                      value={exp.desc}
                      onChange={(e) => handleExpChange(idx, 'desc', e.target.value)}
                      placeholder="• Poin deskripsi pekerjaan dengan action verbs..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setCvData({
                    ...cvData,
                    experience: [
                      ...cvData.experience,
                      { position: '', company: '', year: '', desc: '', aiDesc: false },
                    ],
                  })
                }
                className="text-blue-400 text-xs flex items-center gap-1.5 mt-2 hover:text-blue-300 font-medium cursor-pointer"
              >
                <Plus size={15} /> Tambah Pengalaman Kerja
              </button>
            </div>

            {/* Keahlian (Skills) */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  Keahlian (Skill)
                </h3>
                <div
                  className="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400 hover:text-purple-300 font-medium select-none"
                  onClick={toggleAiSkills}
                >
                  <Sparkles size={14} />
                  <span>AI Auto-Generate (5 Skill)</span>
                  {isGeneratingSkills && <Loader2 size={13} className="animate-spin ml-1" />}
                </div>
              </div>

              {cvData.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    className="flex-1 bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                    value={skill.name}
                    placeholder="Nama Skill (misal: React.js / Financial Analysis)"
                    onChange={(e) => {
                      const n = [...cvData.skills];
                      n[idx] = { ...n[idx], name: e.target.value };
                      setCvData({ ...cvData, skills: n });
                    }}
                  />
                  <div className="flex items-center gap-1 bg-[#1e1f20] px-2 py-1 rounded-lg border border-white/10">
                    <input
                      type="number"
                      min="50"
                      max="100"
                      className="w-14 bg-transparent text-white text-xs p-1 text-center outline-none"
                      value={skill.percentage}
                      onChange={(e) => {
                        const n = [...cvData.skills];
                        n[idx] = { ...n[idx], percentage: parseInt(e.target.value, 10) || 80 };
                        setCvData({ ...cvData, skills: n });
                      }}
                    />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                  <button
                    onClick={() => deleteSkill(idx)}
                    className="text-red-400 p-1.5 hover:text-red-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setCvData({
                    ...cvData,
                    skills: [...cvData.skills, { name: '', percentage: 80 }],
                  })
                }
                className="text-purple-400 text-xs flex items-center gap-1.5 mt-2 hover:text-purple-300 font-medium cursor-pointer"
              >
                <Plus size={15} /> Tambah Keahlian Manual
              </button>
            </div>

            {/* Profil Singkat (Summary) */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  Profil Singkat
                </h3>
                <div
                  className="flex items-center gap-1.5 cursor-pointer text-xs text-indigo-400 hover:text-indigo-300 font-medium select-none"
                  onClick={toggleAiProfile}
                >
                  <Sparkles size={14} />
                  <span>Generate Profil via AI</span>
                  {isGeneratingProfile && <Loader2 size={13} className="animate-spin ml-1" />}
                </div>
              </div>
              <textarea
                className={`w-full bg-[#1e1f20] text-white p-3 rounded-xl border border-white/10 min-h-[90px] text-xs outline-none focus:border-blue-500 ${
                  isGeneratingProfile ? 'opacity-50' : ''
                }`}
                value={cvData.profile}
                onChange={(e) => setCvData({ ...cvData, profile: e.target.value })}
                placeholder="Ringkasan profesional yang menarik HRD..."
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActiveFormPopup(0)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setActiveFormPopup(0);
                  updateCurrentSession(messages, mode, cvData, letterData, docLanguage);
                  setIsAiTyping(true);
                  const isEn = docLanguage === 'en';
                  const userNote: ChatMessage = {
                    id: 'msg_' + Date.now(),
                    role: 'user',
                    text: isEn
                      ? 'Step 2 details (Experience & Skills) have been saved.'
                      : 'Data Langkah 2 telah disimpan.',
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  };
                  setMessages((prev) => [...prev, userNote]);
                  setTimeout(() => {
                    const aiReply: ChatMessage = {
                      id: 'msg_' + (Date.now() + 1),
                      role: 'ai',
                      text: isEn
                        ? 'Your work experience and skills look crisp! Lastly, please fill out your education history and optional projects.'
                        : 'Pekerjaan dan keahlian Anda tersusun rapi! Terakhir, mari lengkapi riwayat pendidikan dan proyek Anda.',
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                      actionForm: 3,
                    };
                    const finalMsg = [...messages, userNote, aiReply];
                    setMessages(finalMsg);
                    updateCurrentSession(finalMsg, mode, cvData, letterData, docLanguage);
                    setIsAiTyping(false);
                  }, 800);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {docLanguage === 'en' ? 'Save & Continue to Step 3' : 'Simpan & Lanjut ke Langkah 3'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FORM POPUP 3: PENDIDIKAN & PROYEK ===================== */}
      {activeFormPopup === 3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">
                Langkah 3: Pendidikan, Proyek, & Penghargaan
              </h2>
              <button
                onClick={() => setActiveFormPopup(0)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Riwayat Pendidikan */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                Riwayat Pendidikan
              </h3>
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-amber-400 font-semibold">{edu.level}</span>
                    {!edu.isFixed && (
                      <button
                        onClick={() => deleteEdu(idx)}
                        className="text-red-400 p-1 hover:text-red-300"
                        title="Hapus jenjang ini"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      className="bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                      value={edu.school}
                      onChange={(e) => {
                        const n = [...cvData.education];
                        n[idx] = { ...n[idx], school: e.target.value };
                        setCvData({ ...cvData, education: n });
                      }}
                      placeholder={`Nama Sekolah / Universitas (${edu.level})`}
                    />
                    {!edu.isFixed ? (
                      <input
                        type="text"
                        className="bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                        value={edu.major}
                        onChange={(e) => {
                          const n = [...cvData.education];
                          n[idx] = { ...n[idx], major: e.target.value };
                          setCvData({ ...cvData, education: n });
                        }}
                        placeholder="Jurusan / Program Studi"
                      />
                    ) : (
                      <div className="text-[11px] text-gray-500 self-center px-1">
                        Pendidikan Dasar/Menengah
                      </div>
                    )}
                    <input
                      type="text"
                      className="bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                      value={edu.year}
                      onChange={(e) => {
                        const n = [...cvData.education];
                        n[idx] = { ...n[idx], year: e.target.value };
                        setCvData({ ...cvData, education: n });
                      }}
                      placeholder="Tahun (misal: 2018 - 2022)"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setCvData({
                    ...cvData,
                    education: [
                      ...cvData.education,
                      { level: 'S1', school: '', year: '', major: '', isFixed: false },
                    ],
                  })
                }
                className="text-amber-400 text-xs flex items-center gap-1.5 mt-2 hover:text-amber-300 font-medium cursor-pointer"
              >
                <Plus size={15} /> Tambah Pendidikan Tinggi (S1/S2/D3)
              </button>
            </div>

            {/* Proyek / Portofolio */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                Proyek & Portofolio (Opsional)
              </h3>
              {cvData.projects.map((proj, idx) => (
                <div key={idx} className="mb-3 pb-3 border-b border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <input
                      type="text"
                      className="flex-1 bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 mr-2 outline-none"
                      value={proj.name}
                      onChange={(e) => {
                        const n = [...cvData.projects];
                        n[idx] = { ...n[idx], name: e.target.value };
                        setCvData({ ...cvData, projects: n });
                      }}
                      placeholder="Nama Proyek (misal: Aplikasi E-Commerce)"
                    />
                    <button
                      onClick={() => deleteProject(idx)}
                      className="text-red-400 p-1 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 min-h-[60px] outline-none"
                    value={proj.desc}
                    onChange={(e) => {
                      const n = [...cvData.projects];
                      n[idx] = { ...n[idx], desc: e.target.value };
                      setCvData({ ...cvData, projects: n });
                    }}
                    placeholder="Deskripsi singkat kontribusi dan teknologi yang digunakan..."
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setCvData({
                    ...cvData,
                    projects: [...cvData.projects, { name: '', desc: '' }],
                  })
                }
                className="text-amber-400 text-xs flex items-center gap-1.5 mt-2 hover:text-amber-300 font-medium cursor-pointer"
              >
                <Plus size={15} /> Tambah Proyek
              </button>
            </div>

            {/* Penghargaan / Sertifikasi */}
            <div className="mb-5 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                Penghargaan & Sertifikasi (Opsional)
              </h3>
              {cvData.awards.map((award, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    className="flex-1 bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                    value={award.name}
                    onChange={(e) => {
                      const n = [...cvData.awards];
                      n[idx] = { ...n[idx], name: e.target.value };
                      setCvData({ ...cvData, awards: n });
                    }}
                    placeholder="Nama Penghargaan / Sertifikat"
                  />
                  <input
                    type="text"
                    className="w-1/3 bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                    value={award.issuer}
                    onChange={(e) => {
                      const n = [...cvData.awards];
                      n[idx] = { ...n[idx], issuer: e.target.value };
                      setCvData({ ...cvData, awards: n });
                    }}
                    placeholder="Penerbit / Lembaga"
                  />
                  <button
                    onClick={() => deleteAward(idx)}
                    className="text-red-400 p-1.5 hover:text-red-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setCvData({
                    ...cvData,
                    awards: [...cvData.awards, { name: '', issuer: '', year: '' }],
                  })
                }
                className="text-amber-400 text-xs flex items-center gap-1.5 mt-2 hover:text-amber-300 font-medium cursor-pointer"
              >
                <Plus size={15} /> Tambah Sertifikat / Penghargaan
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActiveFormPopup(0)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setActiveFormPopup(0);
                  updateCurrentSession(messages, mode, cvData, letterData, docLanguage);
                  setIsAiTyping(true);
                  const isEn = docLanguage === 'en';
                  const userNote: ChatMessage = {
                    id: 'msg_' + Date.now(),
                    role: 'user',
                    text: isEn
                      ? 'Step 3 details (Education & Credentials) have been saved.'
                      : 'Semua data langkah 3 telah disimpan.',
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  };
                  setMessages((prev) => [...prev, userNote]);
                  setTimeout(() => {
                    const aiReply: ChatMessage = {
                      id: 'msg_' + (Date.now() + 1),
                      role: 'ai',
                      text: isEn
                        ? 'Outstanding! Your CV is completely structured and formatted. Click "Preview" or "Export to PDF" on the top bar to inspect and download your resume.'
                        : 'Luar biasa! Dokumen CV Anda sudah lengkap. Anda dapat mengklik tombol "Preview Dokumen" atau "Export ke PDF" di bilah atas untuk melihat dan mengunduhnya.',
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    };
                    const finalMsg = [...messages, userNote, aiReply];
                    setMessages(finalMsg);
                    updateCurrentSession(finalMsg, mode, cvData, letterData, docLanguage);
                    setIsAiTyping(false);
                  }, 800);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {docLanguage === 'en' ? 'Finish & Ready to Download' : 'Selesai & Siap Unduh'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FORM POPUP 4: SURAT LAMARAN KERJA ===================== */}
      {activeFormPopup === 4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Formulir Surat Lamaran Kerja</h2>
              <button
                onClick={() => setActiveFormPopup(0)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Tempat, Tanggal Surat</label>
                  <input
                    type="text"
                    className="w-full bg-[#131314] text-white text-xs p-3 rounded-xl mt-1 border border-white/10 outline-none"
                    value={letterData.tanggalSurat}
                    onChange={(e) =>
                      setLetterData({ ...letterData, tanggalSurat: e.target.value })
                    }
                    placeholder="Misal: Jakarta, 22 Oktober 2026"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Posisi yang Dilamar</label>
                  <input
                    type="text"
                    className="w-full bg-[#131314] text-white text-xs p-3 rounded-xl mt-1 border border-white/10 outline-none"
                    value={letterData.posisiDilamar}
                    onChange={(e) =>
                      setLetterData({ ...letterData, posisiDilamar: e.target.value })
                    }
                    placeholder="Misal: Staff Administrasi & Operasional"
                  />
                </div>
              </div>

              {/* Tujuan Perusahaan */}
              <div className="p-4 bg-[#131314] rounded-xl border border-white/5 space-y-3">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  Tujuan Perusahaan
                </h3>
                <div>
                  <label className="text-xs text-gray-400">Nama Perusahaan / Instansi</label>
                  <input
                    type="text"
                    className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    value={letterData.namaPerusahaan}
                    onChange={(e) =>
                      setLetterData({ ...letterData, namaPerusahaan: e.target.value })
                    }
                    placeholder="PT Nama Perusahaan Tujuan"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Alamat Lengkap Perusahaan</label>
                  <input
                    type="text"
                    className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    value={letterData.alamatPerusahaan}
                    onChange={(e) =>
                      setLetterData({ ...letterData, alamatPerusahaan: e.target.value })
                    }
                    placeholder="Jl. Sudirman Kav. 12, Jakarta"
                  />
                </div>
              </div>

              {/* Data Diri Pelamar */}
              <div className="p-4 bg-[#131314] rounded-xl border border-white/5 space-y-3">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  Data Diri Pelamar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.nama}
                      onChange={(e) => setLetterData({ ...letterData, nama: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Tempat, Tanggal Lahir</label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.ttl}
                      onChange={(e) => setLetterData({ ...letterData, ttl: e.target.value })}
                      placeholder="Bandung, 10 Mei 1999"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Jenis Kelamin</label>
                    <select
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.jenisKelamin}
                      onChange={(e) =>
                        setLetterData({ ...letterData, jenisKelamin: e.target.value })
                      }
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.pendidikanTerakhir}
                      onChange={(e) =>
                        setLetterData({ ...letterData, pendidikanTerakhir: e.target.value })
                      }
                      placeholder="S1 Manajemen Bisnis"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Alamat Tempat Tinggal</label>
                  <textarea
                    className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    value={letterData.alamat}
                    onChange={(e) => setLetterData({ ...letterData, alamat: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Nomor WhatsApp / Telp</label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.phone}
                      onChange={(e) => setLetterData({ ...letterData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Email</label>
                    <input
                      type="email"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      value={letterData.email}
                      onChange={(e) => setLetterData({ ...letterData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Spesifikasi Kualifikasi & Nilai Tambah Pelamar (Paragraf 2) */}
              <div className="p-4 bg-[#131314] rounded-xl border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      {docLanguage === 'en'
                        ? 'Paragraph 2 Specification (Core Competencies & Real Impact)'
                        : 'Spesifikasi Paragraf 2 (Keahlian Nyata & Nilai Tambah)'}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {docLanguage === 'en'
                        ? 'Make your cover letter distinct by detailing tools mastered and specific accomplishments, or let AI write it.'
                        : 'Buat surat lamaran lebih persuasif & tidak umum dengan mencantumkan alat/software dan pencapaian nyata, atau biarkan AI merangkainya.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateLetterParagraph}
                    disabled={isGeneratingLetterParagraph}
                    className="self-start sm:self-auto px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer shrink-0"
                  >
                    {isGeneratingLetterParagraph ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{docLanguage === 'en' ? 'Crafting with AI...' : 'AI Sedang Menyusun...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} className="text-amber-300" />
                        <span>{docLanguage === 'en' ? 'Generate with AI' : 'Buatkan dengan AI'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-medium">
                      {docLanguage === 'en' ? 'Tools / Software Mastered' : 'Alat, Software & Aplikasi yang Dikuasai'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1 focus:border-purple-500"
                      value={letterData.keahlianTools || ''}
                      onChange={(e) => {
                        const newTools = e.target.value;
                        setLetterData((prev) => {
                          const updated = { ...prev, keahlianTools: newTools };
                          if (!prev.aiParagraf) {
                            updated.paragrafKualifikasi = buildLetterParagraphSync(
                              newTools,
                              prev.pencapaianSpesifik || '',
                              prev.namaPerusahaan || '',
                              prev.posisiDilamar || '',
                              docLanguage
                            );
                          }
                          return updated;
                        });
                      }}
                      placeholder={
                        docLanguage === 'en'
                          ? 'e.g. Microsoft Excel (Advanced), Salesforce, Figma, Python, Google Ads'
                          : 'Misal: Microsoft Excel (VLOOKUP & Pivot), SAP ERP, Canva, Google Ads'
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium">
                      {docLanguage === 'en' ? 'Key Achievement / Measurable Experience' : 'Pencapaian Nyata / Pengalaman Terukur'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1 focus:border-purple-500"
                      value={letterData.pencapaianSpesifik || ''}
                      onChange={(e) => {
                        const newAch = e.target.value;
                        setLetterData((prev) => {
                          const updated = { ...prev, pencapaianSpesifik: newAch };
                          if (!prev.aiParagraf) {
                            updated.paragrafKualifikasi = buildLetterParagraphSync(
                              prev.keahlianTools || '',
                              newAch,
                              prev.namaPerusahaan || '',
                              prev.posisiDilamar || '',
                              docLanguage
                            );
                          }
                          return updated;
                        });
                      }}
                      placeholder={
                        docLanguage === 'en'
                          ? 'e.g. Increased organic traffic by 35%, managed cross-functional team of 6'
                          : 'Misal: Meningkatkan omzet 25%, merapikan 500+ arsip, melayani 40+ klien/hari'
                      }
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[11px]">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                  <span>
                    {docLanguage === 'en'
                      ? 'Tools and achievements are automatically displayed on your candidate summary, qualification paragraph, and specification points in the cover letter.'
                      : 'Alat software & pencapaian otomatis tercantum di Data Diri Pelamar, Paragraf Kualifikasi, serta Poin Spesifikasi Surat Lamaran.'}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-400 font-medium">
                      {docLanguage === 'en'
                        ? 'Full Paragraph 2 Text (Editable Preview)'
                        : 'Teks Lengkap Paragraf Kedua (Dapat Diedit Langsung)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLetterData((prev) => ({
                            ...prev,
                            paragrafKualifikasi: buildLetterParagraphSync(
                              prev.keahlianTools || '',
                              prev.pencapaianSpesifik || '',
                              prev.namaPerusahaan || '',
                              prev.posisiDilamar || '',
                              docLanguage
                            ),
                            aiParagraf: false,
                          }));
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                        title={
                          docLanguage === 'en'
                            ? 'Re-sync paragraph text to current tools & achievements'
                            : 'Sinkronkan ulang teks paragraf dengan input alat & pencapaian'
                        }
                      >
                        <RefreshCw size={11} />
                        <span>{docLanguage === 'en' ? 'Re-sync text' : 'Sinkronkan Teks'}</span>
                      </button>
                      {letterData.aiParagraf && (
                        <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles size={11} /> AI Assisted
                        </span>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    className={`w-full bg-[#1e1f20] text-white text-xs p-3 rounded-lg border border-white/10 outline-none leading-relaxed focus:border-purple-500 ${
                      isGeneratingLetterParagraph ? 'opacity-50' : ''
                    }`}
                    value={letterData.paragrafKualifikasi || ''}
                    onChange={(e) =>
                      setLetterData({ ...letterData, paragrafKualifikasi: e.target.value })
                    }
                    placeholder={
                      docLanguage === 'en'
                        ? 'Type custom paragraph here, or click "Generate with AI" above to automatically create specific wording tailored to your tools and achievements...'
                        : 'Tulis paragraf kustom di sini, atau klik tombol "Buatkan dengan AI" di atas untuk merangkai kalimat spesifik otomatis...'
                    }
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    {docLanguage === 'en'
                      ? 'Note: This text replaces the generic body paragraph in your cover letter.'
                      : 'Catatan: Teks ini akan langsung menggantikan paragraf kedua dalam surat lamaran kerja Anda.'}
                  </p>
                </div>
              </div>

              {/* Lampiran Berkas */}
              <div className="p-4 bg-[#131314] rounded-xl border border-white/5">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-2">
                  Daftar Berkas Lampiran
                </h3>
                {letterData.lampiran.map((lamp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      className="flex-1 bg-[#1e1f20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none"
                      value={lamp}
                      onChange={(e) => {
                        const n = [...letterData.lampiran];
                        n[idx] = e.target.value;
                        setLetterData({ ...letterData, lampiran: n });
                      }}
                    />
                    <button
                      onClick={() =>
                        setLetterData({
                          ...letterData,
                          lampiran: letterData.lampiran.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-red-400 p-2 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setLetterData({ ...letterData, lampiran: [...letterData.lampiran, ''] })
                  }
                  className="text-purple-400 text-xs flex items-center gap-1.5 mt-2 hover:text-purple-300 font-medium cursor-pointer"
                >
                  <Plus size={15} /> Tambah Lampiran Lainnya
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActiveFormPopup(0)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setActiveFormPopup(0);
                  const finalLetter = { ...letterData };
                  if (!finalLetter.paragrafKualifikasi || !finalLetter.paragrafKualifikasi.trim()) {
                    finalLetter.paragrafKualifikasi = buildLetterParagraphSync(
                      finalLetter.keahlianTools || '',
                      finalLetter.pencapaianSpesifik || '',
                      finalLetter.namaPerusahaan || '',
                      finalLetter.posisiDilamar || '',
                      docLanguage
                    );
                    setLetterData(finalLetter);
                  }
                  updateCurrentSession(messages, mode, cvData, finalLetter, docLanguage);
                  setIsAiTyping(true);
                  const isEn = docLanguage === 'en';
                  const userNote: ChatMessage = {
                    id: 'msg_' + Date.now(),
                    role: 'user',
                    text: isEn
                      ? 'Cover Letter form details have been submitted.'
                      : 'Data formulir Surat Lamaran telah saya isi.',
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  };
                  setMessages((prev) => [...prev, userNote]);
                  setTimeout(() => {
                    const aiReply: ChatMessage = {
                      id: 'msg_' + (Date.now() + 1),
                      role: 'ai',
                      text: isEn
                        ? 'Perfect! Your formal Cover Letter has been assembled in standard English business letter format. You can click "Preview" or "Export to PDF" on the top bar to inspect and download it.'
                        : 'Sempurna! Surat Lamaran Kerja Anda telah disusun rapi sesuai standar formal. Silakan periksa melalui tombol "Preview" atau cetak menggunakan "Export ke PDF" di bilah atas.',
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    };
                    const finalMsg = [...messages, userNote, aiReply];
                    setMessages(finalMsg);
                    updateCurrentSession(finalMsg, mode, cvData, letterData, docLanguage);
                    setIsAiTyping(false);
                  }, 800);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {docLanguage === 'en' ? 'Save & Generate Cover Letter' : 'Simpan & Buat Surat Lamaran'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL LOGIN GOOGLE (GMAIL) ================= */}
      <GoogleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        reason={loginReason}
      />

      {/* ================= MODAL KONFIRMASI HAPUS SEMUA RIWAYAT ================= */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1f20] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-full bg-red-500/10 border border-red-500/20">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-100">Hapus Semua Riwayat?</h3>
                <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Semua percakapan dan riwayat chat yang tersimpan di perangkat ini akan dihapus secara permanen. Apakah Anda yakin ingin melanjutkan?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmClearAllSessions}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PERINGATAN KELENGKAPAN FORMULIR ================= */}
      {formValidationNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1f20] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-100">Formulir Belum Lengkap</h3>
                <p className="text-xs text-gray-400">Lengkapi data sebelum melanjutkan</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {formValidationNotice}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFormValidationNotice(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                Mengerti & Lengkapi Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL BATAS 3 RIWAYAT CHAT ================= */}
      {chatLimitNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1f20] border border-amber-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-100">Batas Riwayat Percakapan</h3>
                <p className="text-xs text-amber-400 font-medium">Maksimal 3 riwayat per akun</p>
              </div>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
              {chatLimitNotice}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setChatLimitNotice(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
