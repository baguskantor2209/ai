import React, { useState } from 'react';
import {
  PortfolioData,
  WorkExperience,
  EducationItem,
  ProjectItem,
  SkillItem,
  CertificationItem,
  PORTFOLIO_TEMPLATES,
} from '../portfolioTypes';
import { AiWritingModal } from './AiWritingModal';
import {
  User,
  Info,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Mail,
  Palette,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Languages,
  Wand2,
} from 'lucide-react';

const handleImageUpload = (file: File, callback: (dataUrl: string) => void) => {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const rawResult = e.target?.result as string;
    if (!rawResult) return;

    const img = new Image();
    img.onload = () => {
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        callback(canvas.toDataURL(mime, 0.85));
        return;
      }
      callback(rawResult);
    };
    img.onerror = () => {
      callback(rawResult);
    };
    img.src = rawResult;
  };
  reader.readAsDataURL(file);
};

interface Props {
  data: PortfolioData;
  onChange: (updated: PortfolioData) => void;
}

type TabKey =
  | 'profile'
  | 'about'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'design';

export const PortfolioFormEditor: React.FC<Props> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  // AI Assistant Modal state
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    mode: 'write' | 'improve' | 'translate';
    field: 'headline' | 'about' | 'experience' | 'project' | 'skills' | 'cta';
    text: string;
    targetExpIdx?: number;
    targetProjIdx?: number;
  }>({
    isOpen: false,
    mode: 'write',
    field: 'headline',
    text: '',
  });

  const handleAiApply = (resultText: string) => {
    if (aiModal.field === 'headline') {
      updateProfile('headline', resultText);
    } else if (aiModal.field === 'about') {
      updateAbout('bio', resultText);
    } else if (aiModal.field === 'experience' && aiModal.targetExpIdx !== undefined) {
      handleUpdateExperience(aiModal.targetExpIdx, { description: resultText });
    } else if (aiModal.field === 'project' && aiModal.targetProjIdx !== undefined) {
      handleUpdateProject(aiModal.targetProjIdx, { description: resultText });
    } else if (aiModal.field === 'cta') {
      updateProfile('primaryCtaText', resultText);
    } else {
      updateProfile('summary', resultText);
    }
  };

  // Helper updaters
  const updateProfile = (field: keyof PortfolioData['profile'], val: string) => {
    onChange({
      ...data,
      profile: { ...data.profile, [field]: val },
    });
  };

  const updateAbout = (field: keyof PortfolioData['about'], val: any) => {
    onChange({
      ...data,
      about: { ...data.about, [field]: val },
    });
  };

  const updateContact = (field: keyof PortfolioData['contact'], val: string) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: val },
    });
  };

  const updateDesign = (field: keyof PortfolioData['design'], val: any) => {
    onChange({
      ...data,
      design: { ...data.design, [field]: val },
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: 'exp_' + Date.now(),
      company: '',
      position: '',
      startDate: '2024',
      endDate: 'Sekarang',
      current: true,
      description: '',
      achievements: ['Meningkatkan performa sistem dan kepuasan pengguna'],
    };
    onChange({
      ...data,
      experiences: [newExp, ...data.experiences],
    });
  };

  const handleUpdateExperience = (idx: number, updated: Partial<WorkExperience>) => {
    const list = [...data.experiences];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...data, experiences: list });
  };

  const handleDeleteExperience = (idx: number) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((_, i) => i !== idx),
    });
  };

  const handleMoveExperience = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.experiences];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    onChange({ ...data, experiences: list });
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: 'proj_' + Date.now(),
      title: 'Proyek Baru',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      description: 'Deskripsi proyek inovatif yang memberikan dampak positif bagi pengguna.',
      role: 'Full-Stack Developer',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      achievements: 'Berhasil diimplementasikan dan digunakan secara luas.',
      demoUrl: 'https://example.com',
      repoUrl: 'https://github.com',
    };
    onChange({
      ...data,
      projects: [newProj, ...data.projects],
    });
  };

  const handleUpdateProject = (idx: number, updated: Partial<ProjectItem>) => {
    const list = [...data.projects];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...data, projects: list });
  };

  const handleDeleteProject = (idx: number) => {
    onChange({
      ...data,
      projects: data.projects.filter((_, i) => i !== idx),
    });
  };

  const handleMoveProject = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.projects];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    onChange({ ...data, projects: list });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: 'edu_' + Date.now(),
      institution: '',
      degree: 'Sarjana Komputer (S.Kom)',
      fieldOfStudy: '',
      startYear: '2019',
      endYear: '2023',
      description: '',
    };
    onChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const handleUpdateEducation = (idx: number, updated: Partial<EducationItem>) => {
    const list = [...data.education];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...data, education: list });
  };

  const handleDeleteEducation = (idx: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== idx),
    });
  };

  const navItems = [
    { key: 'profile', label: 'Profil Utama', icon: User },
    { key: 'about', label: 'Tentang Saya', icon: Info },
    { key: 'experience', label: 'Pengalaman', count: data.experiences.length, icon: Briefcase },
    { key: 'projects', label: 'Proyek', count: data.projects.length, icon: FolderGit2 },
    { key: 'skills', label: 'Keahlian & Sertifikasi', icon: Wrench },
    { key: 'education', label: 'Pendidikan', count: data.education.length, icon: GraduationCap },
    { key: 'contact', label: 'Kontak', icon: Mail },
    { key: 'design', label: 'Desain & Tema', icon: Palette },
  ];

  return (
    <div className="h-full flex flex-col bg-[#16181d] text-gray-200">
      {/* Top Section Nav Tabs */}
      <div className="p-2 border-b border-white/5 bg-[#121316] overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key as TabKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-gray-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* ================= 1. PROFIL UTAMA ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Profil Utama & Headline</h3>
              <p className="text-xs text-gray-400">
                Informasi penting yang langsung tampil di bagian teratas (Hero) website portofolio Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  value={data.profile.fullName}
                  onChange={(e) => updateProfile('fullName', e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-[#121316] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium">Foto Profil</label>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mt-1.5 p-3 rounded-xl bg-[#121316] border border-white/10">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#181a20] border border-white/10 flex items-center justify-center shrink-0">
                    {data.profile.avatarUrl ? (
                      <img
                        src={data.profile.avatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all">
                        <Upload size={14} />
                        <span>{data.profile.avatarUrl ? 'Ganti Foto' : 'Upload Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) => updateProfile('avatarUrl', url));
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {data.profile.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => updateProfile('avatarUrl', '')}
                          className="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Pilih foto dari perangkat (JPG, PNG, WebP).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400 font-medium">Profesi / Headline Utama</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'write',
                          field: 'headline',
                          text: data.profile.headline,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Buat Headline Baru dengan AI"
                    >
                      <Wand2 size={11} />
                      <span>Tulis AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'improve',
                          field: 'headline',
                          text: data.profile.headline,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Sempurnakan Teks Headline dengan AI"
                    >
                      <Sparkles size={11} />
                      <span>Perbaiki AI</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={data.profile.headline}
                  onChange={(e) => updateProfile('headline', e.target.value)}
                  placeholder="Misal: Senior Frontend Engineer & UI Designer"
                  className="w-full bg-[#121316] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400 font-medium">Ringkasan Profesional</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'write',
                          field: 'about',
                          text: data.profile.summary,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Wand2 size={11} />
                      <span>Tulis AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'improve',
                          field: 'about',
                          text: data.profile.summary,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles size={11} />
                      <span>Perbaiki AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'translate',
                          field: 'about',
                          text: data.profile.summary,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Terjemahkan Teks ID ↔ EN"
                    >
                      <Languages size={11} />
                      <span>Terjemahkan</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={data.profile.summary}
                  onChange={(e) => updateProfile('summary', e.target.value)}
                  placeholder="Deskripsikan value utama dan keahlian Anda secara ringkas..."
                  className="w-full bg-[#121316] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Teks Tombol Utama (CTA 1)</label>
                  <input
                    type="text"
                    value={data.profile.primaryCtaText}
                    onChange={(e) => updateProfile('primaryCtaText', e.target.value)}
                    placeholder="Lihat Portofolio"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Tautan Tombol Utama</label>
                  <input
                    type="text"
                    value={data.profile.primaryCtaLink}
                    onChange={(e) => updateProfile('primaryCtaLink', e.target.value)}
                    placeholder="#projects"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Teks Tombol Kedua (CTA 2)</label>
                  <input
                    type="text"
                    value={data.profile.secondaryCtaText}
                    onChange={(e) => updateProfile('secondaryCtaText', e.target.value)}
                    placeholder="Hubungi Saya"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Tautan Tombol Kedua</label>
                  <input
                    type="text"
                    value={data.profile.secondaryCtaLink}
                    onChange={(e) => updateProfile('secondaryCtaLink', e.target.value)}
                    placeholder="#contact"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. TENTANG SAYA ================= */}
        {activeTab === 'about' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Tentang Saya</h3>
              <p className="text-xs text-gray-400">
                Ceritakan latar belakang, fokus profesional, dan pencapaian unggulan Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 font-medium">Judul Bagian</label>
                <input
                  type="text"
                  value={data.about.sectionTitle}
                  onChange={(e) => updateAbout('sectionTitle', e.target.value)}
                  placeholder="Tentang Saya"
                  className="w-full bg-[#121316] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400 font-medium">Biografi / Deskripsi Diri</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'write',
                          field: 'about',
                          text: data.about.bio,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Wand2 size={11} />
                      <span>Tulis AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'improve',
                          field: 'about',
                          text: data.about.bio,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles size={11} />
                      <span>Perbaiki AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAiModal({
                          isOpen: true,
                          mode: 'translate',
                          field: 'about',
                          text: data.about.bio,
                        })
                      }
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Languages size={11} />
                      <span>Terjemahkan</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={data.about.bio}
                  onChange={(e) => updateAbout('bio', e.target.value)}
                  placeholder="Tuliskan cerita singkat tentang perjalanan karir dan keahlian Anda..."
                  className="w-full bg-[#121316] text-white text-sm p-3 rounded-xl mt-1 border border-white/10 outline-none"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400 font-medium">Poin Unggulan (Highlights)</label>
                  <button
                    type="button"
                    onClick={() => updateAbout('highlights', [...data.about.highlights, ''])}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                  >
                    <Plus size={14} /> Tambah Highlight
                  </button>
                </div>
                {data.about.highlights.map((h, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const list = [...data.about.highlights];
                        list[idx] = e.target.value;
                        updateAbout('highlights', list);
                      }}
                      placeholder="Misal: 5+ Tahun Pengalaman Pengembangan Web Modern"
                      className="flex-1 bg-[#121316] text-white text-xs p-2.5 rounded-xl border border-white/10 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateAbout(
                          'highlights',
                          data.about.highlights.filter((_, i) => i !== idx)
                        )
                      }
                      className="p-2 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium">Informasi Tambahan / Catatan Personal</label>
                <input
                  type="text"
                  value={data.about.additionalInfo}
                  onChange={(e) => updateAbout('additionalInfo', e.target.value)}
                  placeholder="Hobi, minat riset, atau kontribusi open-source..."
                  className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. PENGALAMAN KERJA ================= */}
        {activeTab === 'experience' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Pengalaman Kerja</h3>
                <p className="text-xs text-gray-400">
                  Daftar riwayat karir profesional yang dapat ditambah, diedit, dan diurutkan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus size={15} /> Tambah Pengalaman
              </button>
            </div>

            <div className="space-y-4">
              {data.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-blue-400">
                      Pengalaman #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveExperience(idx, 'up')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        title="Geser ke Atas"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === data.experiences.length - 1}
                        onClick={() => handleMoveExperience(idx, 'down')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        title="Geser ke Bawah"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(idx)}
                        className="p-1 text-gray-400 hover:text-red-400 ml-1"
                        title="Hapus Pengalaman"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Perusahaan</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, { company: e.target.value })}
                        placeholder="Nama Perusahaan"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Posisi / Jabatan</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleUpdateExperience(idx, { position: e.target.value })}
                        placeholder="Lead Engineer"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Tanggal Mulai</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(idx, { startDate: e.target.value })}
                        placeholder="2021"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Tanggal Selesai</label>
                      <input
                        type="text"
                        value={exp.current ? 'Sekarang' : exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => handleUpdateExperience(idx, { endDate: e.target.value })}
                        placeholder="2024 atau Sekarang"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        handleUpdateExperience(idx, {
                          current: e.target.checked,
                          endDate: e.target.checked ? 'Sekarang' : '2024',
                        })
                      }
                      className="rounded accent-blue-600"
                    />
                    <span>Masih aktif bekerja di sini sampai saat ini</span>
                  </label>

                  <div>
                    <label className="text-[11px] text-gray-400 font-medium">Deskripsi Pekerjaan</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(idx, { description: e.target.value })}
                      placeholder="Jelaskan peran dan tanggung jawab utama Anda..."
                      className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    />
                  </div>

                  {/* Achievements */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-400 font-medium">Pencapaian Utama</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateExperience(idx, {
                            achievements: [...exp.achievements, ''],
                          })
                        }
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus size={12} /> Tambah Pencapaian
                      </button>
                    </div>
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => {
                            const newAch = [...exp.achievements];
                            newAch[aIdx] = e.target.value;
                            handleUpdateExperience(idx, { achievements: newAch });
                          }}
                          placeholder="Pencapaian / Dampak (misal: Meningkatkan konversi 20%)"
                          className="flex-1 bg-[#181a20] text-white text-xs p-2 rounded-lg border border-white/10 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateExperience(idx, {
                              achievements: exp.achievements.filter((_, i) => i !== aIdx),
                            });
                          }}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. PROYEK ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Proyek & Portofolio</h3>
                <p className="text-xs text-gray-400">
                  Pamerkan karya terbaik Anda dengan thumbnail, deskripsi, teknologi, dan link demo/github.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus size={15} /> Tambah Proyek
              </button>
            </div>

            <div className="space-y-4">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-emerald-400">
                      Proyek #{idx + 1}: {proj.title || 'Tanpa Judul'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveProject(idx, 'up')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        title="Geser ke Atas"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === data.projects.length - 1}
                        onClick={() => handleMoveProject(idx, 'down')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        title="Geser ke Bawah"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(idx)}
                        className="p-1 text-gray-400 hover:text-red-400 ml-1"
                        title="Hapus Proyek"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Judul Proyek</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(idx, { title: e.target.value })}
                        placeholder="Nama Proyek"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Peran Anda</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => handleUpdateProject(idx, { role: e.target.value })}
                        placeholder="Full-Stack Developer"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-medium">Gambar / Thumbnail Proyek</label>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mt-1 p-2.5 rounded-xl bg-[#181a20] border border-white/10">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#121316] border border-white/10 flex items-center justify-center shrink-0">
                        {proj.thumbnail ? (
                          <img
                            src={proj.thumbnail}
                            alt="thumb"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={18} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all">
                          <Upload size={13} />
                          <span>{proj.thumbnail ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) =>
                                  handleUpdateProject(idx, { thumbnail: url })
                                );
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {proj.thumbnail && (
                          <button
                            type="button"
                            onClick={() => handleUpdateProject(idx, { thumbnail: '' })}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-medium">Deskripsi Proyek</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, { description: e.target.value })}
                      placeholder="Jelaskan tujuan dan fungsi aplikasi/proyek ini..."
                      className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-medium">
                      Teknologi yang Digunakan (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) =>
                        handleUpdateProject(idx, {
                          technologies: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="React, TypeScript, Tailwind, Node.js"
                      className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Tautan Live Demo</label>
                      <input
                        type="text"
                        value={proj.demoUrl}
                        onChange={(e) => handleUpdateProject(idx, { demoUrl: e.target.value })}
                        placeholder="https://demo.example.com"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Tautan Repository (GitHub)</label>
                      <input
                        type="text"
                        value={proj.repoUrl}
                        onChange={(e) => handleUpdateProject(idx, { repoUrl: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. SKILLS & SERTIFIKASI ================= */}
        {activeTab === 'skills' && (
          <div className="space-y-6 max-w-2xl">
            {/* Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Daftar Keahlian</h3>
                  <p className="text-xs text-gray-400">Atur skill teknis dan tingkat kemahirannya (0-100%).</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      skills: [...data.skills, { name: '', category: 'Tools', level: 85 }],
                    })
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <Plus size={14} /> Tambah Skill
                </button>
              </div>

              <div className="space-y-2">
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-[#121316] p-2 rounded-xl border border-white/5">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const list = [...data.skills];
                        list[idx] = { ...list[idx], name: e.target.value };
                        onChange({ ...data, skills: list });
                      }}
                      placeholder="Nama Skill (React.js)"
                      className="flex-1 bg-[#181a20] text-white text-xs p-2 rounded-lg border border-white/10 outline-none"
                    />
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => {
                        const list = [...data.skills];
                        list[idx] = { ...list[idx], category: e.target.value };
                        onChange({ ...data, skills: list });
                      }}
                      placeholder="Kategori"
                      className="w-24 bg-[#181a20] text-white text-xs p-2 rounded-lg border border-white/10 outline-none"
                    />
                    <div className="flex items-center gap-1 bg-[#181a20] px-2 py-1 rounded-lg border border-white/10">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={skill.level}
                        onChange={(e) => {
                          const list = [...data.skills];
                          list[idx] = { ...list[idx], level: parseInt(e.target.value, 10) || 80 };
                          onChange({ ...data, skills: list });
                        }}
                        className="w-10 bg-transparent text-white text-xs text-center outline-none"
                      />
                      <span className="text-[10px] text-gray-400">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...data,
                          skills: data.skills.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-1 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Sertifikasi & Lisensi</h3>
                  <p className="text-xs text-gray-400">Bukti keahlian dan kualifikasi resmi.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      certifications: [
                        ...data.certifications,
                        { id: 'cert_' + Date.now(), name: '', issuer: '', year: '2024' },
                      ],
                    })
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <Plus size={14} /> Tambah Sertifikasi
                </button>
              </div>

              <div className="space-y-2">
                {data.certifications.map((c, idx) => (
                  <div key={c.id} className="flex gap-2 items-center bg-[#121316] p-2 rounded-xl border border-white/5">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const list = [...data.certifications];
                        list[idx] = { ...list[idx], name: e.target.value };
                        onChange({ ...data, certifications: list });
                      }}
                      placeholder="Nama Sertifikasi (AWS Solutions Architect)"
                      className="flex-1 bg-[#181a20] text-white text-xs p-2 rounded-lg border border-white/10 outline-none"
                    />
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => {
                        const list = [...data.certifications];
                        list[idx] = { ...list[idx], issuer: e.target.value };
                        onChange({ ...data, certifications: list });
                      }}
                      placeholder="Penerbit"
                      className="w-32 bg-[#181a20] text-white text-xs p-2 rounded-lg border border-white/10 outline-none"
                    />
                    <input
                      type="text"
                      value={c.year}
                      onChange={(e) => {
                        const list = [...data.certifications];
                        list[idx] = { ...list[idx], year: e.target.value };
                        onChange({ ...data, certifications: list });
                      }}
                      placeholder="Tahun"
                      className="w-16 bg-[#181a20] text-white text-xs p-2 text-center rounded-lg border border-white/10 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...data,
                          certifications: data.certifications.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-1 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. PENDIDIKAN ================= */}
        {activeTab === 'education' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Riwayat Pendidikan</h3>
                <p className="text-xs text-gray-400">Pendidikan formal, gelar, dan program studi.</p>
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus size={15} /> Tambah Pendidikan
              </button>
            </div>

            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-amber-400">Pendidikan #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(idx)}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Nama Institusi / Universitas</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(idx, { institution: e.target.value })}
                        placeholder="Universitas Indonesia"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Gelar</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, { degree: e.target.value })}
                        placeholder="Sarjana Komputer (S.Kom)"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-gray-400 font-medium">Jurusan / Program Studi</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleUpdateEducation(idx, { fieldOfStudy: e.target.value })}
                        placeholder="Teknik Informatika"
                        className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-medium">Periode Tahun</label>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => handleUpdateEducation(idx, { startYear: e.target.value })}
                          placeholder="2019"
                          className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none text-center"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => handleUpdateEducation(idx, { endYear: e.target.value })}
                          placeholder="2023"
                          className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-medium">Deskripsi / Catatan Tambahan (Opsional)</label>
                    <input
                      type="text"
                      value={edu.description || ''}
                      onChange={(e) => handleUpdateEducation(idx, { description: e.target.value })}
                      placeholder="IPK 3.85 / Cum Laude / Organisasi"
                      className="w-full bg-[#181a20] text-white text-xs p-2.5 rounded-lg border border-white/10 outline-none mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. KONTAK ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Kontak & Media Sosial</h3>
              <p className="text-xs text-gray-400">
                Informasi bagi calon perekrut atau klien untuk menghubungi Anda secara langsung.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Alamat Email</label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="nama@example.com"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Nomor WhatsApp / Telp</label>
                  <input
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium">Lokasi / Domisili</label>
                <input
                  type="text"
                  value={data.contact.location}
                  onChange={(e) => updateContact('location', e.target.value)}
                  placeholder="Jakarta, Indonesia"
                  className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Tautan LinkedIn</label>
                  <input
                    type="text"
                    value={data.contact.linkedin}
                    onChange={(e) => updateContact('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Tautan GitHub</label>
                  <input
                    type="text"
                    value={data.contact.github}
                    onChange={(e) => updateContact('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Website Pribadi</label>
                  <input
                    type="text"
                    value={data.contact.website}
                    onChange={(e) => updateContact('website', e.target.value)}
                    placeholder="https://mywebsite.com"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Twitter / X</label>
                  <input
                    type="text"
                    value={data.contact.twitter}
                    onChange={(e) => updateContact('twitter', e.target.value)}
                    placeholder="https://x.com/username"
                    className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl mt-1 border border-white/10 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. DESAIN & TEMA ================= */}
        {activeTab === 'design' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Desain & Tampilan</h3>
              <p className="text-xs text-gray-400">
                Pilih template, palet warna, tipografi, dan atur visibilitas setiap bagian.
              </p>
            </div>

            {/* Bilingual Content Language Selector */}
            <div className="space-y-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Languages size={15} className="text-blue-400" />
                    <span>Bahasa Konten Portofolio (Bilingual ID / EN)</span>
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Mengubah bahasa seluruh label template, navigasi, seksi, dan tombol secara instan.
                  </p>
                </div>
                <div className="flex bg-[#121316] p-1 rounded-xl border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateDesign('contentLanguage', 'id')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      data.design.contentLanguage === 'id' || !data.design.contentLanguage
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇮🇩 Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDesign('contentLanguage', 'en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      data.design.contentLanguage === 'en'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selector Cards (8 Distinct Creative Templates) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400 font-medium">
                  Pilihan 8 Template Portofolio Kreatif
                </label>
                <span className="text-[11px] text-blue-400 font-mono font-bold">
                  8 Template Unik Tersedia
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PORTFOLIO_TEMPLATES.map((tpl) => {
                  const isSelected = data.design.template === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => updateDesign('template', tpl.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600/15 shadow-md shadow-blue-500/25 ring-1 ring-blue-500/50'
                          : 'border-white/10 bg-[#121316] hover:border-white/25 hover:bg-[#15171c]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${tpl.accent}25`,
                              color: tpl.accent,
                              border: `1px solid ${tpl.accent}40`,
                            }}
                          >
                            {tpl.badge}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            Cocok untuk: {tpl.bestFor.split(',')[0]}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{tpl.name}</span>
                        </h4>
                        <p className="text-[11px] text-blue-300/90 font-medium">{tpl.tagline}</p>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                          {tpl.styleDescription}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {tpl.bestFor}
                        </span>
                        <span
                          className={`font-bold text-xs ${
                            isSelected ? 'text-blue-400' : 'text-gray-500'
                          }`}
                        >
                          {isSelected ? '✓ Sedang Aktif' : 'Gunakan Template'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Warna Utama (Primary)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.design.primaryColor}
                    onChange={(e) => updateDesign('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    value={data.design.primaryColor}
                    onChange={(e) => updateDesign('primaryColor', e.target.value)}
                    className="flex-1 bg-[#121316] text-white text-xs p-2.5 rounded-xl border border-white/10 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Warna Aksen (Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.design.accentColor}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    value={data.design.accentColor}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="flex-1 bg-[#121316] text-white text-xs p-2.5 rounded-xl border border-white/10 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Typography & Button Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Pilihan Font Family</label>
                <select
                  value={data.design.fontFamily}
                  onChange={(e) => updateDesign('fontFamily', e.target.value)}
                  className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl border border-white/10 outline-none"
                >
                  <option value="Inter">Inter (Bersih & Modern)</option>
                  <option value="Poppins">Poppins (Geometrik & Ramah)</option>
                  <option value="Playfair">Playfair Display (Elegan & Klasik)</option>
                  <option value="Space Grotesk">Space Grotesk (Tech & Berani)</option>
                  <option value="Fira Code">Fira Code (Developer Vibe)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Gaya Sudut Tombol (Button Radius)</label>
                <select
                  value={data.design.buttonStyle}
                  onChange={(e) => updateDesign('buttonStyle', e.target.value)}
                  className="w-full bg-[#121316] text-white text-xs p-2.5 rounded-xl border border-white/10 outline-none"
                >
                  <option value="rounded-xl">Rounded XL (Modern Melengkung)</option>
                  <option value="rounded-full">Pill (Bulat Penuh)</option>
                  <option value="rounded-none">Sharp (Kotak Tegas)</option>
                </select>
              </div>
            </div>

            {/* Section Visibility Toggles */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs text-gray-300 font-bold block">
                Visibilitas Bagian Website (Tampilkan / Sembunyikan)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { key: 'about', label: 'Tentang Saya' },
                  { key: 'experience', label: 'Pengalaman' },
                  { key: 'education', label: 'Pendidikan' },
                  { key: 'projects', label: 'Proyek' },
                  { key: 'skills', label: 'Keahlian' },
                  { key: 'certifications', label: 'Sertifikasi' },
                  { key: 'contact', label: 'Kontak' },
                ].map((sec) => {
                  const isVisible = (data.design.visibleSections as any)[sec.key];
                  return (
                    <button
                      key={sec.key}
                      type="button"
                      onClick={() =>
                        updateDesign('visibleSections', {
                          ...data.design.visibleSections,
                          [sec.key]: !isVisible,
                        })
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isVisible
                          ? 'bg-blue-600/15 border-blue-500/40 text-blue-200'
                          : 'bg-white/5 border-white/5 text-gray-500'
                      }`}
                    >
                      <span>{sec.label}</span>
                      {isVisible ? (
                        <Eye size={14} className="text-blue-400" />
                      ) : (
                        <EyeOff size={14} className="text-gray-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Writing & Improvement Modal */}
      <AiWritingModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
        onApply={handleAiApply}
        initialMode={aiModal.mode}
        initialField={aiModal.field}
        initialText={aiModal.text}
        userProfession={data.profile.headline}
        portfolioLang={data.design.contentLanguage || 'id'}
      />
    </div>
  );
};
