import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Loader2, Briefcase, Eye, X, Plus, Home, LayoutTemplate, Trash2, CheckSquare, Square, Upload, Mail, Phone, MapPin, Globe, User, Sparkles, Send, ChevronRight } from 'lucide-react';

import Logo from './components/Logo';
import ModernOrangeResume from './templates/creative/ModernOrangeResume';
import CoverLetter from './templates/CoverLetter'; 

// ==========================================
// KONFIGURASI API AI (RESMI GROQ)
// ==========================================
const AI_API_KEY = "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"; 
const AI_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"; 
const AI_MODEL = "openai/gpt-oss-120b"; 

const callRealAI = async (prompt, systemInstruction = "Anda adalah asisten pembuat CV profesional.") => {
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return "Maaf, gagal terhubung ke AI. Pastikan sambungan internet dan API Key Anda valid.";
  }
};

const TEMPLATES = [
  { id: 'tpl-16', name: 'Modern Orange Two-Column', type: 'Creative' }
];

function TemplateThumbnail({ type, id }) {
  if (id === 'tpl-16') {
    return (
      <div className="flex h-full w-full bg-white border border-slate-200">
        <div className="w-[38%] bg-[#22252a] p-2 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border-2 border-amber-500 bg-slate-700 mb-2"></div>
          <div className="w-full border border-amber-500 h-1 mb-1"></div>
          <div className="w-full h-1 bg-slate-500 rounded mb-1"></div>
        </div>
        <div className="w-[62%]"><div className="w-full h-4 bg-amber-500 mb-2"></div></div>
      </div>
    );
  }
  if (type === 'ATS') return <div className="p-3 space-y-2 bg-white h-full w-full"><div className="w-1/2 h-2.5 bg-slate-800 rounded"></div><div className="w-full border-b border-slate-300 my-1"></div></div>;
  return <div className="flex h-full w-full bg-white"><div className="w-1/3 bg-slate-800 p-2"></div><div className="w-2/3 p-3"><div className="w-1/2 h-2 bg-blue-500 rounded"></div></div></div>;
}

function DynamicCvRender({ cvData, selectedTemplate }) {
  if (selectedTemplate?.id === 'tpl-16') {
    return <ModernOrangeResume cvData={cvData} selectedTemplate={selectedTemplate} />;
  }

  const contact = {
    phone: cvData.phone,
    email: cvData.email,
    location: cvData.location,
    linkedin: cvData.linkedin,
    website: cvData.website,
  };

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-800 p-10 font-sans flex flex-col justify-between shadow-lg">
      <div>
        <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold uppercase text-slate-900 tracking-wide">{cvData.name || 'NAMA LENGKAP'}</h1>
            <p className="text-blue-600 font-semibold text-sm capitalize mt-1 tracking-wider">{cvData.title || 'Profesi'}</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 flex flex-wrap gap-4 mb-6 bg-slate-100 p-3 rounded-lg border border-slate-200">
          {contact.email && <span>Email: {contact.email}</span>}
          {contact.phone && <span>• Telp: {contact.phone}</span>}
          {contact.location && <span>• Lokasi: {contact.location}</span>}
          {contact.linkedin && <span className="flex items-center gap-1"><Globe size={12}/> {contact.linkedin}</span>}
          {contact.website && <span className="flex items-center gap-1"><Globe size={12}/> {contact.website}</span>}
        </div>

        {cvData.profile && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">PROFIL SINGKAT</h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{cvData.profile}</p>
          </div>
        )}

        {cvData.experience && cvData.experience.length > 0 && cvData.experience[0].position && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">PENGALAMAN KERJA</h2>
            <div className="space-y-4">
              {cvData.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <h3 className="text-xs font-bold text-slate-800">{exp.position}</h3>
                    <span className="text-xs text-slate-500 font-semibold">{exp.year}</span>
                  </div>
                  <p className="text-xs text-blue-700 font-medium mb-1">{exp.company}</p>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {cvData.skills && cvData.skills.length > 0 && cvData.skills[0].name && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">KEAHLIAN (SKILL)</h2>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              {cvData.skills.map((s, i) => (
                <div key={i} className="flex justify-between bg-slate-50 p-2 rounded border border-slate-200">
                  <span>• {s.name}</span>
                  <span className="font-semibold text-slate-500">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cvData.education && cvData.education.some(edu => edu.school.trim() !== '') && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">RIWAYAT PENDIDIKAN</h2>
            <div className="space-y-2 text-xs text-slate-700">
              {cvData.education.map((edu, i) => {
                if (!edu.school.trim()) return null;
                return (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> {edu.major ? `- ${edu.major}` : ''} ({edu.level})</span>
                    <span className="text-slate-500 font-medium">{edu.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // === UI & CHAT STATES ===
  const [messages, setMessages] = useState([]); // Jika 0, tampil landing page
  const [query, setQuery] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mode, setMode] = useState('cv'); 
  const [isDocumentMode, setIsDocumentMode] = useState(false); 
  
  const [showPreview, setShowPreview] = useState(false); 
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [activeFormPopup, setActiveFormPopup] = useState(0);

  const [isGeneratingDesc, setIsGeneratingDesc] = useState({});
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);

  const messagesEndRef = useRef(null);

  // === DATA CV STATES ===
  const [cvData, setCvData] = useState({
    titleCV: "", name: "", title: "", phone: "", email: "", location: "", profileImage: "", linkedin: "", website: "",
    notWorking: false,
    experience: [{ position: "", company: "", year: "", desc: "", aiDesc: false }],
    profile: "", aiProfile: false,
    skills: [{ name: "", percentage: 80 }], aiSkills: false,
    education: [
      { level: "SD", school: "", year: "", major: "", isFixed: true },
      { level: "SMP", school: "", year: "", major: "", isFixed: true },
      { level: "SMA", school: "", year: "", major: "", isFixed: true }
    ],
    awards: [], noProject: false, projects: []
  });

  // === DATA SURAT LAMARAN STATES ===
  const [letterData, setLetterData] = useState({
    tanggalSurat: "", namaPerusahaan: "", alamatPerusahaan: "", posisiDilamar: "",
    nama: "", ttl: "", jenisKelamin: "Laki-laki", alamat: "", phone: "", email: "", pendidikanTerakhir: "",
    lampiran: ["Daftar Riwayat Hidup (CV)", "Fotocopy Ijazah dan Transkrip Nilai", "Fotocopy Kartu Tanda Penduduk (KTP)", "Pas Foto Terbaru 4x6"]
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  // === FUNGSI CHAT INTERAKTIF (TRANSTISI GEMINI STYLE) ===
  const handleChatSubmit = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const textToSubmit = forcedQuery || query;
    if (!textToSubmit.trim()) return;

    setQuery("");
    setMessages(prev => [...prev, { role: 'user', text: textToSubmit }]);
    setIsAiTyping(true);
    
    const lowerQ = textToSubmit.toLowerCase();
    let currentMode = mode;
    let isAskingForDocument = false;

    // Deteksi jika user ingin buat dokumen
    if (lowerQ.includes("surat") || lowerQ.includes("lamaran") || lowerQ.includes("cover")) {
      currentMode = 'letter';
      setMode('letter');
      isAskingForDocument = true;
      setIsDocumentMode(true); 
    } else if (lowerQ.includes("cv") || lowerQ.includes("resume")) {
      currentMode = 'cv';
      setMode('cv');
      isAskingForDocument = true;
      setIsDocumentMode(true); 
    }

    // Default prompt untuk sapaan / obrolan santai
    let sysPrompt = "Anda adalah mKenzo, AI asisten profesional. Jawab sapaan atau pertanyaan umum user dengan ramah, informatif, ringkas, dan natural layaknya teman mengobrol.";
    
    // Prompt yang lebih ketat jika user meminta dokumen (TIDAK BOLEH memberi contoh format panjang)
    if (isAskingForDocument) {
      sysPrompt = currentMode === 'letter' 
        ? "Anda adalah mKenzo, asisten pembuat Surat Lamaran. PENTING: Jawab SANGAT SINGKAT (1-2 kalimat saja). JANGAN pernah memberikan contoh isi surat atau format template. Cukup sapa pengguna dan persilakan mereka mengklik tombol form di bawah ini untuk mulai mengisi data."
        : "Anda adalah mKenzo, asisten pembuat CV. PENTING: Jawab SANGAT SINGKAT (1-2 kalimat saja). JANGAN pernah memberikan contoh isi CV atau format template. Cukup sapa pengguna dan persilakan mereka mengklik tombol form di bawah ini untuk mulai mengisi data.";
    }

    const aiResp = await callRealAI(textToSubmit, sysPrompt);
    
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: aiResp, 
      actionForm: isAskingForDocument ? (currentMode === 'letter' ? 4 : 1) : null 
    }]);
    setIsAiTyping(false);
  };

  const handleResetHome = () => {
    setMessages([]);
    setMode('cv');
    setIsDocumentMode(false); 
  };

  // === FUNGSI-FUNGSI PENDUKUNG CV ===
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCvData({...cvData, profileImage: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = () => {
    const originalTitle = document.title;
    document.title = mode === 'letter' ? (letterData.nama || 'Surat_Lamaran') : (cvData.titleCV || 'CV_Baru_mKenz');
    window.print();
    document.title = originalTitle;
  };

  const handleExpChange = (index, field, val) => { 
    const newExp = [...cvData.experience]; newExp[index][field] = val; setCvData({...cvData, experience: newExp}); 
  };
  const deleteExp = (index) => setCvData({...cvData, experience: cvData.experience.filter((_, i) => i !== index)});
  const deleteSkill = (index) => setCvData({...cvData, skills: cvData.skills.filter((_, i) => i !== index)});
  const deleteEdu = (index) => setCvData({...cvData, education: cvData.education.filter((_, i) => i !== index)});
  const deleteProject = (index) => setCvData({...cvData, projects: cvData.projects.filter((_, i) => i !== index)});
  const deleteAward = (index) => setCvData({...cvData, awards: cvData.awards.filter((_, i) => i !== index)});

  const handleNotWorkingToggle = () => {
    const nextVal = !cvData.notWorking;
    setCvData(prev => ({
      ...prev,
      notWorking: nextVal,
      title: nextVal ? "OPEN TO WORK" : ""
    }));
  };

  const toggleAiDesc = async (index) => {
    const currentState = cvData.experience[index].aiDesc;
    handleExpChange(index, 'aiDesc', !currentState);
    if (!currentState) {
      setIsGeneratingDesc(prev => ({...prev, [index]: true}));
      handleExpChange(index, 'desc', 'AI sedang menganalisis dan menyusun 5 deskripsi pekerjaan...');
      
      const exp = cvData.experience[index];
      const prompt = `Tuliskan MINIMAL 5 poin deskripsi pekerjaan (bullet point dengan simbol •) profesional untuk posisi ${exp.position} di perusahaan ${exp.company}. Gunakan Bahasa Indonesia formal dan kata kerja aksi. Pastikan hasilnya HANYA berupa 5 baris bullet point tanpa kalimat pembuka/penutup.`;
      
      const aiResult = await callRealAI(prompt, "Anda adalah HR Expert yang ahli menulis deskripsi riwayat kerja di CV secara ringkas, berbobot, dan menggunakan action verbs.");
      handleExpChange(index, 'desc', aiResult);
      setIsGeneratingDesc(prev => ({...prev, [index]: false}));
    }
  };

  const toggleAiProfile = async () => {
    const currentState = cvData.aiProfile;
    setCvData({...cvData, aiProfile: !currentState});
    if (!currentState) {
      setIsGeneratingProfile(true);
      setCvData(prev => ({...prev, profile: 'AI sedang menulis profil menarik Anda...'}));
      
      const expPos = cvData.experience[0]?.position || "Profesional";
      const expComp = cvData.experience[0]?.company || "";
      
      let prompt = "";
      if (cvData.notWorking) {
        prompt = `Buatkan profil profesional (summary CV) untuk seorang pencari kerja antusias dengan latar belakang ${expPos}${expComp ? ` di ${expComp}` : ''}. Tuliskan dalam Bahasa Indonesia formal, maksimal 3 kalimat, menonjolkan motivasi tinggi, etos kerja, dan kesiapan untuk berkontribusi. DILARANG menyebutkan durasi tahun (seperti 8 tahun/10 tahun) atau informasi palsu. Balas LANGSUNG dengan teks profil tanpa awalan/akhiran tambahan.`;
      } else {
        const title = cvData.title || expPos;
        prompt = `Buatkan profil profesional (summary CV) untuk seorang ${title}${expComp ? ` di ${expComp}` : ''}. Buat ringkas, maksimal 3 kalimat, menonjolkan dedikasi, keahlian utama, dan orientasi hasil. DILARANG mengarang durasi tahun pengalaman. Balas LANGSUNG dengan teks profil tanpa awalan/akhiran tambahan.`;
      }
      
      const aiResult = await callRealAI(prompt, "Anda adalah penulis profil profesional CV yang jujur, ringkas, dan persuasif.");
      setCvData(prev => ({...prev, profile: aiResult}));
      setIsGeneratingProfile(false);
    }
  };

  const toggleAiSkills = async () => {
    const currentState = cvData.aiSkills;
    setCvData({...cvData, aiSkills: !currentState});
    if (!currentState) {
      setIsGeneratingSkills(true);
      const title = (cvData.notWorking ? cvData.experience[0]?.position : cvData.title) || cvData.experience[0]?.position || "Profesional Umum";
      
      const prompt = `Berikan MINIMAL 5 keahlian (campuran hard skill dan soft skill spesifik) yang sangat relevan untuk posisi ${title}. 
      WAJIB balas HANYA dengan format JSON valid berisi array dari 5 objek seperti ini tanpa teks lain, tanpa markdown: [{"name": "Nama Skill 1", "percentage": 90}, {"name": "Nama Skill 2", "percentage": 85}, {"name": "Nama Skill 3", "percentage": 88}, {"name": "Nama Skill 4", "percentage": 80}, {"name": "Nama Skill 5", "percentage": 85}]`;
      
      const aiResult = await callRealAI(prompt, "Anda adalah sistem API yang HANYA membalas dengan JSON array valid berisi minimal 5 item skill. Jangan tambahkan teks markdown di dalam output.");
      try {
        const cleanedJson = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedSkills = JSON.parse(cleanedJson);
        setCvData(prev => ({...prev, skills: parsedSkills}));
      } catch (e) {
        console.error("Gagal parsing JSON dari AI", e, aiResult);
        alert("Gagal merender format Skill dari AI. Coba lagi atau isikan secara manual.");
      }
      setIsGeneratingSkills(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#131314] overflow-hidden print:bg-white print:h-auto font-sans text-white">
      
      {/* ================= SIDEBAR ================= */}
      <div className={`w-[280px] bg-[#1e1f20] flex-col border-r border-white/5 z-30 print:hidden shrink-0 transition-all duration-300 ${messages.length > 0 && isDocumentMode ? 'hidden md:flex' : 'hidden'}`}>
         <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4 ml-2 mt-2">
              <Sparkles className="text-blue-400" size={24} />
              <span className="text-xl font-medium text-gray-200 tracking-wide">mKenzo AI</span>
            </div>
            <button onClick={handleResetHome} className="w-full flex items-center gap-3 bg-[#131314] hover:bg-[#2a2b2f] p-3 rounded-xl text-sm font-medium text-gray-200 transition-colors border border-white/5">
              <Home size={18} className="text-blue-400" /> Beranda Utama
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <div className="text-[11px] text-gray-500 font-bold mb-3 uppercase tracking-widest mt-2">Tindakan Cepat</div>
           {mode === 'cv' && (
             <button onClick={() => setShowTemplateSelector(true)} className="w-full flex items-center gap-3 hover:bg-[#2a2b2f] p-3 rounded-xl text-sm text-gray-200 transition-colors">
               <LayoutTemplate size={18} className="text-purple-400" /> Pilih Template CV
             </button>
           )}
           <button onClick={() => setShowPreview(true)} className="w-full flex items-center gap-3 hover:bg-[#2a2b2f] p-3 rounded-xl text-sm text-gray-200 transition-colors">
             <Eye size={18} className="text-blue-400" /> Preview Dokumen
           </button>
           <button onClick={handleExportPDF} className="w-full flex items-center gap-3 hover:bg-[#2a2b2f] p-3 rounded-xl text-sm text-gray-200 transition-colors">
             <Download size={18} className="text-green-400" /> Export ke PDF
           </button>
         </div>
      </div>

      {/* ================= AREA UTAMA (Landing / Chat) ================= */}
      <div className="flex-1 flex flex-col relative bg-[#131314] print:hidden h-screen">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e293b]/40 via-[#131314] to-[#131314] animate-in fade-in duration-700">
            <div className="mb-10 flex flex-col items-center justify-center">
              <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg shadow-purple-500/20 mb-6">
                <Sparkles size={40} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 text-center">
                HI! Saya mKenzo AI, Ada yang bisa saya bantu?
              </h1>
            </div>

            <form onSubmit={e => handleChatSubmit(e)} className="w-full max-w-3xl relative mb-8 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Sparkles size={20} className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tanya mKenzo untuk membuat CV / Surat Lamaran..."
                className="w-full bg-[#1e1f20] text-gray-100 text-lg rounded-full py-4 pl-14 pr-16 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-xl shadow-black/20 hover:bg-[#252628]"
              />
              <button type="submit" className="absolute inset-y-0 right-2 flex items-center justify-center w-12 h-12 my-auto bg-transparent hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <Send size={20} className="text-gray-400" />
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
              <button onClick={() => handleChatSubmit(null, "Tolong buatkan saya CV profesional.")} className="px-5 py-3 bg-[#1e1f20] hover:bg-[#2a2b2f] border border-white/5 rounded-2xl flex items-center gap-2 text-sm text-gray-300 transition-colors shadow-sm cursor-pointer">
                <Briefcase size={18} className="text-blue-400" /> Buat CV Profesional
              </button>
              <button onClick={() => handleChatSubmit(null, "Tolong buatkan saya Surat Lamaran Kerja.")} className="px-5 py-3 bg-[#1e1f20] hover:bg-[#2a2b2f] border border-white/5 rounded-2xl flex items-center gap-2 text-sm text-gray-300 transition-colors shadow-sm cursor-pointer">
                <FileText size={18} className="text-purple-400" /> Buat Surat Lamaran Kerja
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-36 scroll-smooth animate-in slide-in-from-bottom-8 duration-500">
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {msg.role === 'ai' ? (
                      <div className="flex gap-4 max-w-[90%] relative">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={16} className="text-blue-400" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="text-[15px] leading-relaxed text-gray-100 whitespace-pre-line bg-transparent pt-1.5">
                            {msg.text}
                          </div>
                          
                          {msg.actionForm && (
                            <div className="mt-2">
                              <button 
                                onClick={() => setActiveFormPopup(msg.actionForm)} 
                                className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#2a2b2f] border border-white/10 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2 group shadow-sm cursor-pointer"
                              >
                                <FileText size={16} className="text-blue-400 group-hover:scale-110 transition-transform" /> 
                                {msg.actionForm === 4 ? "Isi Form Surat Lamaran" : `Buka Form Langkah ${msg.actionForm}`}
                                <ChevronRight size={16} className="text-gray-500 ml-1" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[15px] leading-relaxed bg-[#2a2b2f] text-gray-100 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] border border-white/5 shadow-sm">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex gap-4 max-w-[85%] animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-blue-400" />
                    </div>
                    <div className="flex items-center gap-1.5 h-8">
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#131314] via-[#131314] to-transparent">
              <form onSubmit={e => handleChatSubmit(e)} className="max-w-3xl mx-auto relative">
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  disabled={isAiTyping}
                  placeholder="Ketik balasan untuk mKenzo..." 
                  className="w-full bg-[#1e1f20] text-gray-100 rounded-full py-4 pl-6 pr-16 border border-white/10 outline-none focus:border-blue-500/50 shadow-lg disabled:opacity-50" 
                />
                <button type="submit" disabled={isAiTyping || !query.trim()} className="absolute inset-y-0 right-2 flex items-center justify-center w-12 h-12 my-auto bg-transparent hover:bg-white/10 rounded-full transition-colors cursor-pointer disabled:opacity-50">
                  <Send size={20} className="text-gray-400" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* ===================== RENDER DOKUMEN CETAK ===================== */}
      <div className="hidden print:block fixed inset-0 bg-white text-black z-[9999] w-full h-full p-0 m-0">
        {mode === 'cv' ? <DynamicCvRender cvData={cvData} selectedTemplate={selectedTemplate} /> : <CoverLetter letterData={letterData} />}
      </div>

      {/* ===================== POPUPS & MODALS ===================== */}
      {showPreview && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 print:hidden">
          <div className="bg-[#1e1f20] rounded-2xl w-full max-w-4xl p-4 sm:p-6 border border-white/10 flex flex-col relative max-h-[95vh]">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h2 className="text-xl font-bold text-white">Preview Dokumen</h2>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer">Export PDF</button>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white cursor-pointer"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-auto bg-slate-700 p-4 flex justify-center items-start rounded-xl">
              <div className="bg-white text-black shadow-2xl origin-top mb-10">
                {mode === 'cv' ? <DynamicCvRender cvData={cvData} selectedTemplate={selectedTemplate} /> : <CoverLetter letterData={letterData} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateSelector && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#131314]/90 p-4 print:hidden">
          <div className="bg-[#1e1f20] rounded-2xl w-full max-w-4xl p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => setShowTemplateSelector(false)} className="absolute top-6 right-6 text-gray-400 cursor-pointer"><X/></button>
             <h2 className="text-2xl font-medium text-white mb-6">Pilih Template CV</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               {TEMPLATES.map(tpl => (
                 <div key={tpl.id} onClick={() => { setSelectedTemplate(tpl); setShowTemplateSelector(false); }} className="cursor-pointer group">
                   <div className={`h-56 rounded-2xl bg-white overflow-hidden border-2 shadow-md ${selectedTemplate.id === tpl.id ? 'border-amber-500' : 'border-transparent'}`}><TemplateThumbnail type={tpl.type} id={tpl.id} /></div>
                   <h3 className="text-center text-gray-100 text-sm mt-3">{tpl.name}</h3>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* ===================== FORM 4: SURAT LAMARAN KERJA ===================== */}
      {activeFormPopup === 4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Formulir Surat Lamaran Kerja</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-400">Tempat, Tanggal Surat</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={letterData.tanggalSurat} onChange={e => setLetterData({...letterData, tanggalSurat: e.target.value})} placeholder="Misal: Jakarta, 12 Agustus 2026" /></div>
                <div><label className="text-sm text-gray-400">Posisi yang Dilamar</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={letterData.posisiDilamar} onChange={e => setLetterData({...letterData, posisiDilamar: e.target.value})} placeholder="Misal: Staff Administrasi" /></div>
              </div>

              <div className="p-4 bg-[#131314] rounded-xl border border-white/5">
                <h3 className="text-white font-medium mb-3">Tujuan Surat</h3>
                <div className="space-y-3">
                  <div><label className="text-sm text-gray-400">Nama Perusahaan / Instansi</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.namaPerusahaan} onChange={e => setLetterData({...letterData, namaPerusahaan: e.target.value})} placeholder="PT Nama Perusahaan" /></div>
                  <div><label className="text-sm text-gray-400">Alamat Perusahaan</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.alamatPerusahaan} onChange={e => setLetterData({...letterData, alamatPerusahaan: e.target.value})} placeholder="Jl. Sudirman No. 123, Jakarta" /></div>
                </div>
              </div>

              <div className="p-4 bg-[#131314] rounded-xl border border-white/5">
                <h3 className="text-white font-medium mb-3">Data Diri Pelamar</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div><label className="text-sm text-gray-400">Nama Lengkap</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.nama} onChange={e => setLetterData({...letterData, nama: e.target.value})} /></div>
                  <div><label className="text-sm text-gray-400">Tempat, Tanggal Lahir</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.ttl} onChange={e => setLetterData({...letterData, ttl: e.target.value})} placeholder="Bandung, 10 Mei 1998" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div><label className="text-sm text-gray-400">Jenis Kelamin</label>
                    <select className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.jenisKelamin} onChange={e => setLetterData({...letterData, jenisKelamin: e.target.value})}>
                      <option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div><label className="text-sm text-gray-400">Pendidikan Terakhir</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.pendidikanTerakhir} onChange={e => setLetterData({...letterData, pendidikanTerakhir: e.target.value})} placeholder="S1 Teknik Informatika" /></div>
                </div>
                <div className="mb-3"><label className="text-sm text-gray-400">Alamat Lengkap</label><textarea className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.alamat} onChange={e => setLetterData({...letterData, alamat: e.target.value})}></textarea></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400">Nomor Telp/HP</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.phone} onChange={e => setLetterData({...letterData, phone: e.target.value})} /></div>
                  <div><label className="text-sm text-gray-400">Email</label><input type="email" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={letterData.email} onChange={e => setLetterData({...letterData, email: e.target.value})} /></div>
                </div>
              </div>

              <div className="p-4 bg-[#131314] rounded-xl border border-white/5">
                <h3 className="text-white font-medium mb-3">Lampiran</h3>
                {letterData.lampiran.map((lamp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10 text-sm" value={lamp} onChange={e => { const n = [...letterData.lampiran]; n[idx] = e.target.value; setLetterData({...letterData, lampiran: n})}} />
                    <button onClick={() => setLetterData({...letterData, lampiran: letterData.lampiran.filter((_, i) => i !== idx)})} className="text-red-400 p-2 hover:text-red-300 cursor-pointer"><Trash2 size={18}/></button>
                  </div>
                ))}
                <button onClick={() => setLetterData({...letterData, lampiran: [...letterData.lampiran, '']})} className="text-purple-400 text-sm flex items-center gap-1 mt-2 hover:text-purple-300 cursor-pointer"><Plus size={16}/> Tambah Lampiran</button>
              </div>

            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setActiveFormPopup(0)} className="text-gray-400 hover:text-white px-4 py-2 transition cursor-pointer">Tutup</button>
              <button onClick={() => {
                setActiveFormPopup(0);
                setIsAiTyping(true);
                setMessages(prev => [...prev, { role: 'user', text: 'Data Surat Lamaran telah saya lengkapi dan simpan.' }]);
                setTimeout(() => {
                  setMessages(prev => [...prev, { role: 'ai', text: 'Sempurna! Surat Lamaran Kerja Anda sudah siap. Silakan klik tombol Preview atau Export PDF di menu samping.' }]);
                  setIsAiTyping(false);
                }, 1200);
              }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 font-medium cursor-pointer">Simpan Dokumen</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FORM 1, 2, 3: CV LENGKAP ===================== */}
      {activeFormPopup === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-2xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">1. Data Diri</h2>
            <div className="space-y-4">
              <div><label className="text-sm text-gray-400">Nama CV</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.titleCV} onChange={e => setCvData({...cvData, titleCV: e.target.value})} placeholder="CV_Nama" /></div>
              <div><label className="text-sm text-gray-400">Nama Lengkap</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.name} onChange={e => setCvData({...cvData, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-400">Telp</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.phone} onChange={e => setCvData({...cvData, phone: e.target.value})} /></div>
                <div><label className="text-sm text-gray-400">Email</label><input type="email" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.email} onChange={e => setCvData({...cvData, email: e.target.value})} /></div>
              </div>
              <div><label className="text-sm text-gray-400">Lokasi / Kota</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.location} onChange={e => setCvData({...cvData, location: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-400">LinkedIn URL</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.linkedin} onChange={e => setCvData({...cvData, linkedin: e.target.value})} /></div>
                <div><label className="text-sm text-gray-400">Web URL</label><input type="text" className="w-full bg-[#131314] text-white p-3 rounded-lg mt-1 border border-white/5" value={cvData.website} onChange={e => setCvData({...cvData, website: e.target.value})} /></div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Pas Foto</label>
                <div className="flex gap-4"><label className="cursor-pointer bg-[#131314] text-gray-200 px-4 py-3 rounded-lg border border-white/5 flex-1 text-center"><Upload className="inline mr-2" size={16}/> Upload<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/></label>{cvData.profileImage && <img src={cvData.profileImage} alt="Preview" className="w-12 h-12 object-cover rounded" />}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => {
                setActiveFormPopup(0);
                setIsAiTyping(true);
                setMessages(prev => [...prev, { role: 'user', text: `Data Langkah 1 telah disimpan.` }]);
                setTimeout(() => {
                  setMessages(prev => [...prev, { role: 'ai', text: "Hebat! Data diri sudah aman. Selanjutnya mari kita susun riwayat pekerjaan dan keahlian Anda.", actionForm: 2 }]);
                  setIsAiTyping(false);
                }, 1200);
              }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 cursor-pointer">Simpan & Lanjut</button>
            </div>
          </div>
        </div>
      )}

      {activeFormPopup === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">2. Pekerjaan, Skill, & Profil</h2>
            
            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Pekerjaan Saat Ini</h3>
              <div className="flex items-center gap-2 mb-3 cursor-pointer w-fit" onClick={handleNotWorkingToggle}>
                {cvData.notWorking ? <CheckSquare className="text-blue-400" size={18}/> : <Square className="text-gray-500" size={18}/>}
                <span className="text-sm text-gray-300 select-none">Sedang tidak bekerja (Otomatis Open To Work)</span>
              </div>
              <input 
                type="text" 
                disabled={cvData.notWorking} 
                className="w-full bg-[#1e1f20] text-white p-3 rounded-lg mt-1 border border-white/10 uppercase disabled:opacity-50 disabled:cursor-not-allowed" 
                value={cvData.title} 
                onChange={e => setCvData({...cvData, title: e.target.value})} 
                placeholder="Misal: ART DIRECTOR" 
              />
            </div>

            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Pengalaman Kerja</h3>
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/5 relative">
                  <div className="flex justify-end mb-2"><button onClick={() => deleteExp(idx)} className="text-red-400 p-1 hover:text-red-300 cursor-pointer"><Trash2 size={16}/></button></div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><label className="text-sm text-gray-400">Posisi</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={exp.position} onChange={e => handleExpChange(idx, 'position', e.target.value)} /></div>
                    <div><label className="text-sm text-gray-400">Perusahaan</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={exp.company} onChange={e => handleExpChange(idx, 'company', e.target.value)} /></div>
                  </div>
                  <div className="mb-3"><label className="text-sm text-gray-400">Tahun</label><input type="text" className="w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10" value={exp.year} onChange={e => handleExpChange(idx, 'year', e.target.value)} /></div>
                  
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2 cursor-pointer w-fit" onClick={() => toggleAiDesc(idx)}>
                      {exp.aiDesc ? <CheckSquare className="text-blue-400" size={16}/> : <Square className="text-gray-500" size={16}/>}
                      <span className="text-xs text-blue-300">Gunakan AI untuk generate deskripsi (Min. 5 Poin)</span>
                      {isGeneratingDesc[idx] && <Loader2 size={12} className="animate-spin text-blue-400 ml-1" />}
                    </div>
                    <textarea className={`w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10 min-h-[110px] text-sm ${isGeneratingDesc[idx] ? 'opacity-50' : ''}`} value={exp.desc} onChange={e => handleExpChange(idx, 'desc', e.target.value)}></textarea>
                  </div>
                </div>
              ))}
              <button onClick={() => setCvData({...cvData, experience: [...cvData.experience, {position:'', company:'', year:'', desc:'', aiDesc: false}]})} className="text-purple-400 text-sm flex items-center gap-1 mt-2 hover:text-purple-300 cursor-pointer"><Plus size={16}/> Tambah Pengalaman</button>
            </div>

            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3 flex justify-between items-center">Keahlian (Skill)
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleAiSkills}>
                  {cvData.aiSkills ? <CheckSquare className="text-purple-400" size={16}/> : <Square className="text-gray-500" size={16}/>}
                  <span className="text-xs text-purple-300">AI Auto-Generate (Min. 5 Skill)</span>
                  {isGeneratingSkills && <Loader2 size={12} className="animate-spin text-purple-400 ml-1" />}
                </div>
              </h3>
              {cvData.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input type="text" className="flex-1 bg-[#1e1f20] text-white p-2 rounded border border-white/10" value={skill.name} onChange={e => { const n = [...cvData.skills]; n[idx].name = e.target.value; setCvData({...cvData, skills: n})}} />
                  <input type="number" className="w-20 bg-[#1e1f20] text-white p-2 rounded border border-white/10" value={skill.percentage} onChange={e => { const n = [...cvData.skills]; n[idx].percentage = e.target.value; setCvData({...cvData, skills: n})}} />
                  <button onClick={() => deleteSkill(idx)} className="text-red-400 p-1 hover:text-red-300 cursor-pointer"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={() => setCvData({...cvData, skills: [...cvData.skills, {name:'', percentage: 80}]})} className="text-purple-400 text-sm flex items-center gap-1 mt-2 hover:text-purple-300 cursor-pointer"><Plus size={16}/> Tambah Skill</button>
            </div>

            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Profil Singkat</h3>
              <div className="flex items-center gap-2 mb-2 cursor-pointer w-fit" onClick={toggleAiProfile}>
                 {cvData.aiProfile ? <CheckSquare className="text-purple-400" size={16}/> : <Square className="text-gray-500" size={16}/>}
                 <span className="text-xs text-purple-300">Generate Profil via AI</span>
                 {isGeneratingProfile && <Loader2 size={12} className="animate-spin text-purple-400 ml-1" />}
               </div>
              <textarea className={`w-full bg-[#1e1f20] text-white p-2.5 rounded-lg border border-white/10 min-h-[90px] text-sm ${isGeneratingProfile ? 'opacity-50' : ''}`} value={cvData.profile} onChange={e => setCvData({...cvData, profile: e.target.value})}></textarea>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => {
                setActiveFormPopup(0);
                setIsAiTyping(true);
                setMessages(prev => [...prev, { role: 'user', text: `Data Langkah 2 telah disimpan.` }]);
                setTimeout(() => {
                  setMessages(prev => [...prev, { role: 'ai', text: "Luar biasa! Profil dan pekerjaan Anda terlihat solid. Terakhir, lengkapi data pendidikan dan proyek.", actionForm: 3 }]);
                  setIsAiTyping(false);
                }, 1200);
              }} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 cursor-pointer">Simpan & Lanjut</button>
            </div>
          </div>
        </div>
      )}

      {activeFormPopup === 3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:hidden">
          <div className="bg-[#1e1f20] w-full max-w-3xl rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">3. Pendidikan, Proyek, & Penghargaan</h2>
            
            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Riwayat Pendidikan</h3>
              
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-white/5 relative">
                  {!edu.isFixed && (
                    <div className="flex justify-end mb-2">
                      <button onClick={() => deleteEdu(idx)} className="text-red-400 p-1 hover:text-red-300 cursor-pointer"><Trash2 size={16}/></button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <select 
                      className="bg-[#1e1f20] text-white p-2.5 rounded border border-white/10 disabled:opacity-50" 
                      value={edu.level} 
                      disabled={edu.isFixed}
                      onChange={e => { const n = [...cvData.education]; n[idx].level = e.target.value; setCvData({...cvData, education: n})}}
                    >
                      {edu.isFixed ? (
                        <option value={edu.level}>{edu.level}</option>
                      ) : (
                        <>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                          <option value="D3">D3</option>
                          <option value="D4">D4</option>
                        </>
                      )}
                    </select>
                    <input 
                      type="text" 
                      className="col-span-2 bg-[#1e1f20] text-white p-2.5 rounded border border-white/10" 
                      value={edu.school} 
                      onChange={e => { const n = [...cvData.education]; n[idx].school = e.target.value; setCvData({...cvData, education: n})}} 
                      placeholder={`Nama Institusi (${edu.level})`} 
                    />
                  </div>
                  
                  <div className={`grid ${edu.isFixed ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    {!edu.isFixed && (
                      <input 
                        type="text" 
                        className="bg-[#1e1f20] text-white p-2.5 rounded border border-white/10" 
                        value={edu.major} 
                        onChange={e => { const n = [...cvData.education]; n[idx].major = e.target.value; setCvData({...cvData, education: n})}} 
                        placeholder="Jurusan" 
                      />
                    )}
                    <input 
                      type="text" 
                      className="bg-[#1e1f20] text-white p-2.5 rounded border border-white/10" 
                      value={edu.year} 
                      onChange={e => { const n = [...cvData.education]; n[idx].year = e.target.value; setCvData({...cvData, education: n})}} 
                      placeholder="Tahun (Misal: 2011-2014)" 
                    />
                  </div>
                </div>
              ))}
              
              <button onClick={() => setCvData({...cvData, education: [...cvData.education, {level:'S1', school:'', year:'', major:'', isFixed: false}]})} className="text-amber-400 text-sm flex items-center gap-1 mt-2 hover:text-amber-300 cursor-pointer"><Plus size={16}/> Tambah Pendidikan Tinggi</button>
            </div>

            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Proyek / Portofolio (Opsional)</h3>
              {cvData.projects.map((proj, idx) => (
                <div key={idx} className="mb-3 border-b border-white/5 pb-3">
                  <div className="flex justify-between mb-1">
                    <input type="text" className="flex-1 bg-[#1e1f20] text-white p-2.5 rounded border border-white/10 mr-2" value={proj.name} onChange={e => { const n = [...cvData.projects]; n[idx].name = e.target.value; setCvData({...cvData, projects: n})}} placeholder="Nama Proyek" />
                    <button onClick={() => deleteProject(idx)} className="text-red-400 p-1 hover:text-red-300 cursor-pointer"><Trash2 size={16}/></button>
                  </div>
                  <textarea className="w-full bg-[#1e1f20] text-white p-2.5 rounded border border-white/10 text-xs min-h-[60px]" value={proj.desc} onChange={e => { const n = [...cvData.projects]; n[idx].desc = e.target.value; setCvData({...cvData, projects: n})}} placeholder="Deskripsi"></textarea>
                </div>
              ))}
              <button onClick={() => setCvData({...cvData, projects: [...cvData.projects, {name:'', desc:''}]})} className="text-amber-400 text-sm flex items-center gap-1 mt-2 hover:text-amber-300 cursor-pointer"><Plus size={16}/> Tambah Proyek</button>
            </div>

            <div className="mb-6 bg-[#131314] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-3">Penghargaan / Sertifikasi (Opsional)</h3>
              {cvData.awards.map((award, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input type="text" className="flex-1 bg-[#1e1f20] text-white p-2 rounded border border-white/10" value={award.name} onChange={e => { const n = [...cvData.awards]; n[idx].name = e.target.value; setCvData({...cvData, awards: n})}} placeholder="Nama Sertifikat" />
                  <input type="text" className="w-1/4 bg-[#1e1f20] text-white p-2 rounded border border-white/10" value={award.issuer} onChange={e => { const n = [...cvData.awards]; n[idx].issuer = e.target.value; setCvData({...cvData, awards: n})}} placeholder="Lembaga" />
                  <button onClick={() => deleteAward(idx)} className="text-red-400 p-1 hover:text-red-300 cursor-pointer"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={() => setCvData({...cvData, awards: [...cvData.awards, {name:'', issuer:'', year:''}]})} className="text-amber-400 text-sm flex items-center gap-1 mt-2 hover:text-amber-300 cursor-pointer"><Plus size={16}/> Tambah Penghargaan</button>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => {
                setActiveFormPopup(0);
                setIsAiTyping(true);
                setMessages(prev => [...prev, { role: 'user', text: `Data Langkah 3 telah disimpan.` }]);
                setTimeout(() => {
                  setMessages(prev => [...prev, { role: 'ai', text: "Sempurna! Semua data CV telah lengkap. Anda dapat melihat pratinjau (Preview) atau mengunduhnya sebagai PDF sekarang." }]);
                  setIsAiTyping(false);
                }, 1200);
              }} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-500 cursor-pointer">Selesai & Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}