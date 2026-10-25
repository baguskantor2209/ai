import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  CheckCircle2,
  User,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Star,
  Terminal,
  Layers,
  Compass,
} from 'lucide-react';
import { CvData } from '../../types';
import { getColorPalette } from '../colorThemes';

export interface CreativeThemeInfo {
  id: string;
  name: string;
  subtitle: string;
  layoutType: string;
  defaultHex: string;
}

export const CREATIVE_TEMPLATES: CreativeThemeInfo[] = [
  {
    id: 'tpl-c1',
    name: 'Modern Asymmetric Right Sidebar',
    subtitle: 'Sidebar gelap di kanan (37%) dengan pas foto bulat & ring warna',
    layoutType: 'Right Sidebar Split',
    defaultHex: '#f59e0b',
  },
  {
    id: 'tpl-c2',
    name: 'Nordic Left Drawer Full-Height',
    subtitle: 'Sidebar kiri penuh (35%) dengan foto squircle & kartu pengalaman putih',
    layoutType: 'Left Sidebar Full-Height',
    defaultHex: '#0d9488',
  },
  {
    id: 'tpl-c3',
    name: 'Top Hero Banner + 2 Equal Columns',
    subtitle: 'Banner horizontal penuh di atas, bawah 2 kolom seimbang 50/50',
    layoutType: 'Top Banner + 2 Equal Columns',
    defaultHex: '#4f46e5',
  },
  {
    id: 'tpl-c4',
    name: 'Modular Dashboard Grid',
    subtitle: 'Tata letak kartu modular berbingkai mirip dashboard eksekutif',
    layoutType: 'Modular Card Grid',
    defaultHex: '#e11d48',
  },
  {
    id: 'tpl-c5',
    name: 'Cyber Terminal Tech',
    subtitle: 'Estetika IT dark tech dengan badge terminal & matriks keahlian',
    layoutType: 'Dark Terminal Layout',
    defaultHex: '#06b6d4',
  },
  {
    id: 'tpl-c6',
    name: 'Center Spine Symmetrical Timeline',
    subtitle: 'Garis timeline vertikal di tengah dengan konten kiri-kanan bergantian',
    layoutType: 'Centered Spine Timeline',
    defaultHex: '#059669',
  },
  {
    id: 'tpl-c7',
    name: 'Bold Geometric Ribbon 3-Column',
    subtitle: 'Header pita geometris tegas dengan grid 3-seksi studio',
    layoutType: '3-Column Studio Grid',
    defaultHex: '#b91c1c',
  },
  {
    id: 'tpl-c8',
    name: 'Double-Frame Luxury Elegance',
    subtitle: 'Bingkai ganda klasik, tipografi serif elegan & rating skala bintang',
    layoutType: 'Double-Frame Luxury',
    defaultHex: '#b45309',
  },
  {
    id: 'tpl-c9',
    name: 'Numbered Pipeline Steps (01-04)',
    subtitle: 'Badge nomor langkah melingkar (01, 02, 03, 04) dengan garis konektor',
    layoutType: 'Numbered Pipeline Steps',
    defaultHex: '#0284c7',
  },
  {
    id: 'tpl-c10',
    name: 'Magazine Editorial Spread',
    subtitle: 'Gaya majalah mode/eksekutif kontemporer dengan foto bingkai offset',
    layoutType: 'Editorial Magazine Spread',
    defaultHex: '#334155',
  },
];

export default function CreativeRenderer({
  cvData,
  themeId = 'tpl-c1',
  language = 'id',
  colorTone,
}: {
  cvData: CvData;
  themeId?: string;
  language?: 'id' | 'en';
  colorTone?: string;
}) {
  const isEn = language === 'en';
  const currentTemplate = CREATIVE_TEMPLATES.find((t) => t.id === themeId) || CREATIVE_TEMPLATES[0];
  const activeHex = colorTone || currentTemplate.defaultHex;
  const palette = getColorPalette(activeHex);

  const contact = {
    phone: cvData.phone,
    email: cvData.email,
    location: cvData.location,
    linkedin: cvData.linkedin,
    website: cvData.website,
  };

  const hasExp = cvData.experience && cvData.experience.some((e) => e.position && e.position.trim());
  const hasEdu = cvData.education && cvData.education.some((e) => e.school && e.school.trim());
  const hasSkills = cvData.skills && cvData.skills.some((s) => s.name && s.name.trim());
  const hasAwards = cvData.awards && cvData.awards.some((a) => a.name && a.name.trim());
  const hasProjects = !cvData.noProject && cvData.projects && cvData.projects.some((p) => p.name && p.name.trim());

  const expCount = cvData.experience?.filter((e) => e.position?.trim()).length || 0;
  const isCompact = expCount <= 2;

  // =========================================================================
  // 1. TEMPLATE C1: Modern Asymmetric Right Sidebar (37% Right Dark Sidebar)
  // =========================================================================
  if (themeId === 'tpl-c1') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans flex overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        {/* Kolom Kiri Utama (63%) */}
        <div className="w-[63%] p-8 pb-6 flex flex-col bg-white h-full justify-between border-r border-slate-100">
          <div>
            <div
              className="-mx-8 -mt-8 p-8 mb-6 text-white relative shrink-0 shadow-md"
              style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
            >
              <h1 className="text-3xl font-black uppercase tracking-wider leading-tight drop-shadow-sm">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded">
                  {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi / Posisi Anda')}
                </span>
              </div>
            </div>

            {cvData.profile && (
              <div className={isCompact ? 'mb-6' : 'mb-5'}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <h2
                    className="font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    {isEn ? 'ABOUT ME' : 'TENTANG SAYA'}
                  </h2>
                </div>
                <p className={`text-slate-700 leading-relaxed text-justify whitespace-pre-line ${isCompact ? 'text-[12.5px]' : 'text-xs'}`}>
                  {cvData.profile}
                </p>
              </div>
            )}

            {hasExp && (
              <div className={isCompact ? 'mb-6' : 'mb-5'}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <h2
                    className="font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
                  </h2>
                </div>
                <div
                  className={`relative pl-4 border-l-2 ml-2 ${isCompact ? 'space-y-4' : 'space-y-3.5'}`}
                  style={{ borderColor: palette.primaryBorder }}
                >
                  {cvData.experience.map((exp, i) => {
                    if (!exp.position || !exp.position.trim()) return null;
                    return (
                      <div key={i} className="relative">
                        <div
                          className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-xs font-bold text-slate-900">{exp.position}</span>
                          <span
                            className="text-[11px] font-bold whitespace-nowrap ml-2 px-2 py-0.5 rounded border"
                            style={{ color: palette.primary, backgroundColor: palette.primaryLighter, borderColor: palette.primaryBorder }}
                          >
                            {exp.year}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 mb-1">{exp.company}</p>
                        <p className={`text-slate-700 leading-relaxed whitespace-pre-line pl-1 ${isCompact ? 'text-[11.5px]' : 'text-[11px]'}`}>
                          {exp.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasEdu && (
              <div className={isCompact ? 'mb-6' : 'mb-5'}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <h2
                    className="font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}
                  </h2>
                </div>
                <div
                  className={`relative pl-4 border-l-2 ml-2 ${isCompact ? 'space-y-3.5' : 'space-y-3'}`}
                  style={{ borderColor: palette.primaryBorder }}
                >
                  {cvData.education.map((edu, i) => {
                    if (!edu.school || !edu.school.trim()) return null;
                    return (
                      <div key={i} className="relative">
                        <div
                          className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-xs font-bold text-slate-900">{edu.school}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                        </div>
                        <p className="text-[11px] font-semibold" style={{ color: palette.primary }}>
                          {edu.level} {edu.major ? `• ${isEn ? 'Major in ' : 'Jurusan '}${edu.major}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasProjects && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <h2
                    className="font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    {isEn ? 'PROJECTS & PORTFOLIO' : 'PROYEK / PORTOFOLIO'}
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {cvData.projects.map((proj, i) => {
                    if (!proj.name || !proj.name.trim()) return null;
                    return (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{proj.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3 mt-auto flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 italic">
              <CheckCircle2 size={12} style={{ color: palette.primary }} className="shrink-0" />
              {isEn ? 'Official verified document' : 'Dokumen resmi akurat & dapat dipertanggungjawabkan'}
            </span>
            <span className="font-semibold text-slate-400">Curriculum Vitae</span>
          </div>
        </div>

        {/* Kolom Kanan Sidebar (37%) */}
        <div
          className="w-[37%] text-white p-6 pb-6 flex flex-col items-center text-center h-full justify-between"
          style={{ backgroundColor: palette.darkSidebar }}
        >
          <div className="w-full flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full border-4 p-1 mb-5 overflow-hidden flex justify-center items-center shrink-0 shadow-lg"
              style={{ borderColor: palette.primary, backgroundColor: palette.darkSidebarCard }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto Profil" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-slate-700 rounded-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <User size={32} className="text-slate-500 mb-1" />
                  <span>Pas Foto</span>
                </div>
              )}
            </div>

            <div className="w-full mb-5">
              <div
                className="py-1 px-3 text-xs font-bold uppercase tracking-widest mb-3 border-y"
                style={{ color: palette.primary, borderColor: palette.primaryBorder, backgroundColor: palette.primaryLight }}
              >
                {isEn ? 'CONTACT DETAILS' : 'KONTAK SAYA'}
              </div>
              <div className="text-left text-[11px] space-y-2 text-slate-200">
                {contact.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={13} style={{ color: palette.primary }} className="shrink-0 mt-0.5" />
                    <span className="break-words leading-tight">{contact.location}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} style={{ color: palette.primary }} className="shrink-0" />
                    <span className="break-all">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} style={{ color: palette.primary }} className="shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-center gap-2">
                    <Share2 size={13} style={{ color: palette.primary }} className="shrink-0" />
                    <span className="break-all">{contact.linkedin}</span>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} style={{ color: palette.primary }} className="shrink-0" />
                    <span className="break-all">{contact.website}</span>
                  </div>
                )}
              </div>
            </div>

            {hasSkills && (
              <div className="w-full mb-5">
                <div
                  className="py-1 px-3 text-xs font-bold uppercase tracking-widest mb-3 border-y"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder, backgroundColor: palette.primaryLight }}
                >
                  {isEn ? 'CORE SKILLS' : 'KEAHLIAN UTAMA'}
                </div>
                <div className="space-y-2 text-left">
                  {cvData.skills.map((s, i) => {
                    if (!s.name || !s.name.trim()) return null;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-[10.5px] font-medium tracking-wide mb-1 text-slate-200">
                          <span>{s.name}</span>
                          <span style={{ color: palette.primary }} className="font-bold">{s.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(15, s.percentage))}%`, backgroundColor: palette.primary }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasAwards && (
              <div className="w-full mb-4">
                <div
                  className="py-1 px-3 text-xs font-bold uppercase tracking-widest mb-2.5 border-y"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder, backgroundColor: palette.primaryLight }}
                >
                  {isEn ? 'HONORS & AWARDS' : 'SERTIFIKASI & PRESTASI'}
                </div>
                <div className="space-y-2 text-left text-[10.5px] text-slate-300">
                  {cvData.awards.map((award, i) => {
                    if (!award.name || !award.name.trim()) return null;
                    return (
                      <div key={i} className="border-l-2 pl-2" style={{ borderColor: palette.primary }}>
                        <div className="font-bold leading-tight" style={{ color: palette.primary }}>{award.name}</div>
                        <div className="text-slate-400 text-[9.5px]">
                          {award.issuer} {award.year ? `(${award.year})` : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="w-full pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 text-center">
            <p className="tracking-wide">{isEn ? 'Languages: English (Fluent) • Indonesian' : 'Bahasa: Indonesia (Aktif) • Inggris'}</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE C2: Nordic Left Drawer (Full-Height Left Drawer)
  // =========================================================================
  if (themeId === 'tpl-c2') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans flex overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        {/* SIDEBAR DI SEBELAH KIRI */}
        <div
          className="w-[35%] text-white p-6 flex flex-col justify-between h-full"
          style={{ backgroundColor: palette.darkSidebar }}
        >
          <div>
            <div
              className="w-32 h-32 rounded-2xl border-2 p-1 mb-5 overflow-hidden mx-auto flex items-center justify-center shadow-md"
              style={{ borderColor: palette.primary, backgroundColor: palette.darkSidebarCard }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <User size={36} style={{ color: palette.primary }} />
              )}
            </div>

            <div className="mb-6">
              <h3
                className="text-xs font-bold uppercase tracking-widest border-b pb-1.5 mb-3 flex items-center gap-1.5"
                style={{ color: palette.primary, borderColor: palette.primaryBorder }}
              >
                <Mail size={13} /> {isEn ? 'CONTACT DETAILS' : 'KONTAK SAYA'}
              </h3>
              <div className="text-xs space-y-2.5 text-slate-200 font-light">
                {contact.location && <div className="flex items-center gap-2"><MapPin size={13} style={{ color: palette.primary }} className="shrink-0" /><span>{contact.location}</span></div>}
                {contact.email && <div className="flex items-center gap-2"><Mail size={13} style={{ color: palette.primary }} className="shrink-0" /><span className="break-all">{contact.email}</span></div>}
                {contact.phone && <div className="flex items-center gap-2"><Phone size={13} style={{ color: palette.primary }} className="shrink-0" /><span>{contact.phone}</span></div>}
                {contact.linkedin && <div className="flex items-center gap-2"><Share2 size={13} style={{ color: palette.primary }} className="shrink-0" /><span className="break-all">{contact.linkedin}</span></div>}
                {contact.website && <div className="flex items-center gap-2"><Globe size={13} style={{ color: palette.primary }} className="shrink-0" /><span className="break-all">{contact.website}</span></div>}
              </div>
            </div>

            {hasSkills && (
              <div className="mb-6">
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1.5 mb-3"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                >
                  {isEn ? 'TECHNICAL SKILLS' : 'KEAHLIAN TEKNIS'}
                </h3>
                <div className="space-y-2">
                  {cvData.skills.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>{s.name}</span>
                        <span style={{ color: palette.primary }} className="font-bold">{s.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasAwards && (
              <div className="mb-4">
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1.5 mb-2.5"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                >
                  {isEn ? 'RECOGNITIONS' : 'PRESTASI'}
                </h3>
                <div className="space-y-2 text-[10.5px] text-slate-200">
                  {cvData.awards.map((a, i) => (
                    <div key={i} className="border-l-2 pl-2" style={{ borderColor: palette.primary }}>
                      <div className="font-semibold" style={{ color: palette.primary }}>{a.name}</div>
                      <div className="text-slate-400 text-[9.5px]">{a.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-700 text-center text-[10px] text-slate-400">
            <span>{isEn ? 'Official Professional Profile' : 'Profil Profesional Resmi'}</span>
          </div>
        </div>

        {/* KONTEN KANAN UTAMA */}
        <div className="w-[65%] p-8 pb-6 flex flex-col justify-between h-full bg-slate-50/40">
          <div>
            <div className="border-b-2 pb-5 mb-5" style={{ borderColor: palette.primary }}>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: palette.primaryLight, color: palette.primary }}
              >
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
              </span>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mt-1">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
            </div>

            {cvData.profile && (
              <div className="mb-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: palette.primary }}>
                  {isEn ? 'PROFESSIONAL SUMMARY' : 'RINGKASAN EKSEKUTIF'}
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">{cvData.profile}</p>
              </div>
            )}

            {hasExp && (
              <div className="mb-5">
                <h2
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 flex items-center gap-1.5"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                >
                  <Briefcase size={14} /> {isEn ? 'CAREER EXPERIENCE' : 'PENGALAMAN KERJA'}
                </h2>
                <div className="space-y-3">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{exp.position}</span>
                        <span className="text-[10.5px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600 mb-1">{exp.company}</p>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasEdu && (
              <div className="mb-4">
                <h2
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2.5 flex items-center gap-1.5"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                >
                  <GraduationCap size={14} /> {isEn ? 'EDUCATION & CREDENTIALS' : 'PENDIDIKAN'}
                </h2>
                <div className="space-y-2 text-xs">
                  {cvData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between bg-white p-2.5 rounded border border-slate-200">
                      <div>
                        <strong className="text-slate-900">{edu.school}</strong>
                        <p className="text-[11px] font-medium" style={{ color: palette.primary }}>
                          {edu.level} {edu.major ? `- ${edu.major}` : ''}
                        </p>
                      </div>
                      <span className="text-slate-500 font-medium text-xs">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between">
            <span>Curriculum Vitae Profesional</span>
            <span>{isEn ? 'References Available Upon Request' : 'Referensi tersedia atas permintaan'}</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. TEMPLATE C3: Top Hero Banner + 2 Equal Columns (50/50 Symmetrical Split)
  // =========================================================================
  if (themeId === 'tpl-c3') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        {/* BANNER ATAS PENUH */}
        <div
          className="text-white p-7 shrink-0 flex items-center gap-6 shadow-md"
          style={{ backgroundColor: palette.darkSidebar }}
        >
          <div
            className="w-28 h-28 rounded-2xl border-4 p-1 overflow-hidden shrink-0 shadow-lg"
            style={{ borderColor: palette.primary, backgroundColor: palette.darkSidebarCard }}
          >
            {cvData.profileImage ? (
              <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: palette.primary }}>
                <User size={40} />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-sm font-semibold tracking-widest uppercase mt-1" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-200 mt-2.5">
              {contact.location && <span className="flex items-center gap-1"><MapPin size={12} style={{ color: palette.primary }} /> {contact.location}</span>}
              {contact.phone && <span className="flex items-center gap-1"><Phone size={12} style={{ color: palette.primary }} /> {contact.phone}</span>}
              {contact.email && <span className="flex items-center gap-1"><Mail size={12} style={{ color: palette.primary }} /> {contact.email}</span>}
              {contact.linkedin && <span className="flex items-center gap-1"><Share2 size={12} style={{ color: palette.primary }} /> {contact.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* DUA KOLOM SEIMBANG DI BAWAH BANNER */}
        <div className="p-8 pb-6 flex-1 flex gap-6 overflow-hidden">
          {/* KOLOM KIRI (50%) */}
          <div className="w-1/2 flex flex-col justify-between">
            <div>
              {cvData.profile && (
                <div className="mb-5 p-3.5 rounded-xl border" style={{ backgroundColor: palette.primaryLighter, borderColor: palette.primaryBorder }}>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: palette.primary }}>
                    {isEn ? 'EXECUTIVE PROFILE' : 'PROFIL PROFESIONAL'}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{cvData.profile}</p>
                </div>
              )}

              {hasExp && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: palette.primary }}>
                    {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
                  </h3>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 pl-3" style={{ borderColor: palette.primary }}>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-slate-900">{exp.position}</span>
                          <span className="text-[10.5px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 mb-0.5">{exp.company}</p>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN (50%) */}
          <div className="w-1/2 flex flex-col justify-between border-l border-slate-200 pl-6">
            <div>
              {hasEdu && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: palette.primary }}>
                    {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}
                  </h3>
                  <div className="space-y-2.5">
                    {cvData.education.map((edu, i) => (
                      <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{edu.school}</span>
                          <span className="font-semibold text-[11px]" style={{ color: palette.primary }}>{edu.year}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSkills && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: palette.primary }}>
                    {isEn ? 'CORE SKILLS' : 'KEAHLIAN & SKOR'}
                  </h3>
                  <div className="space-y-2">
                    {cvData.skills.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-800">{s.name}</span>
                          <span className="font-bold" style={{ color: palette.primary }}>{s.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div className="mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: palette.primary }}>
                    {isEn ? 'CERTIFICATIONS' : 'SERTIFIKASI & PENGHARGAAN'}
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {cvData.awards.map((a, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-semibold">{a.name}</span>
                        <span className="text-slate-500 text-[11px]">{a.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-8 mb-4 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
          <span>Format Executive Banner • Resmi & Terpercaya</span>
          <span>{isEn ? 'Languages: English (Fluent) • Indonesian' : 'Bahasa: Indonesia (Aktif) • Inggris'}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. TEMPLATE C4: Modular Dashboard Grid (4-Card Floating Layout)
  // =========================================================================
  if (themeId === 'tpl-c4') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-[#f8fafc] text-slate-800 font-sans p-8 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER CARD BESAR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-6 mb-5">
            <div
              className="w-24 h-24 rounded-2xl border-2 p-1 overflow-hidden shrink-0 shadow-md"
              style={{ borderColor: palette.primary, backgroundColor: palette.primaryLight }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: palette.primary }}>
                  <User size={32} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <span
                className="text-[10px] font-bold uppercase tracking-widest border px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: palette.primaryLighter, color: palette.primary, borderColor: palette.primaryBorder }}
              >
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'KANDIDAT PROFESIONAL')}
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                {contact.location && <span>📍 {contact.location}</span>}
                {contact.phone && <span>📞 {contact.phone}</span>}
                {contact.email && <span>✉️ {contact.email}</span>}
                {contact.linkedin && <span>🌐 {contact.linkedin}</span>}
              </div>
            </div>
          </div>

          {/* GRID 2 KOLOM KARTU MODULAR */}
          <div className="grid grid-cols-2 gap-5">
            {/* KARTU 1: PENGALAMAN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b pb-2"
                  style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                >
                  <Briefcase size={14} /> {isEn ? 'CAREER HISTORY' : 'RIWAYAT PEKERJAAN'}
                </h3>
                <div className="space-y-3.5">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="border-l-2 pl-3" style={{ borderColor: palette.primary }}>
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{exp.position}</span>
                        <span className="text-[10.5px] font-medium" style={{ color: palette.primary }}>{exp.year}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600">{exp.company}</p>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed mt-1 whitespace-pre-line">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KARTU 2: RINGKASAN & SKILL & EDUKASI */}
            <div className="space-y-5">
              {cvData.profile && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-2"
                    style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                  >
                    {isEn ? 'PROFILE SUMMARY' : 'TENTANG PROFIL'}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">{cvData.profile}</p>
                </div>
              )}

              {hasSkills && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
                    style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                  >
                    {isEn ? 'TOP SKILLS' : 'KEAHLIAN UTAMA'}
                  </h3>
                  <div className="space-y-2">
                    {cvData.skills.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] mb-1 font-medium">
                          <span>{s.name}</span>
                          <span className="font-bold" style={{ color: palette.primary }}>{s.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasEdu && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-2.5 border-b pb-2 flex items-center gap-1.5"
                    style={{ color: palette.primary, borderColor: palette.primaryBorder }}
                  >
                    <GraduationCap size={14} /> {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
                  </h3>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu, i) => (
                      <div key={i} className="flex justify-between">
                        <span><strong>{edu.school}</strong> ({edu.level})</span>
                        <span className="text-slate-500 text-[11px]">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Modular Card Dashboard • Desain Terpadat & Modern</span>
          <span>CV Resmi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. TEMPLATE C5: Cyber Terminal Tech (Dark IDE Aesthetic)
  // =========================================================================
  if (themeId === 'tpl-c5') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-[#0c131d] text-slate-200 font-sans p-8 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-slate-800">
        <div>
          {/* HEADER TECH TERMINAL */}
          <div className="border-b border-slate-700/60 pb-5 mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.primary }} />
                <span className="text-[11px] font-mono tracking-wider" style={{ color: palette.primary }}>
                  DEV // PORTFOLIO_V2
                </span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-white font-mono">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <p className="text-xs font-mono font-bold uppercase mt-0.5" style={{ color: palette.primary }}>
                {`> ${cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Software Engineer / IT')}`}
              </p>
            </div>

            <div
              className="w-24 h-24 rounded-xl border p-1 overflow-hidden shrink-0"
              style={{ borderColor: palette.primaryBorder, backgroundColor: palette.darkSidebarCard }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: palette.primary }}>
                  <Terminal size={30} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#121c2a] p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-5 font-mono">
            {contact.email && <div><span style={{ color: palette.primary }} className="font-bold">EMAIL:</span> {contact.email}</div>}
            {contact.phone && <div><span style={{ color: palette.primary }} className="font-bold">TEL:</span> {contact.phone}</div>}
            {contact.location && <div><span style={{ color: palette.primary }} className="font-bold">LOC:</span> {contact.location}</div>}
            {contact.linkedin && <div className="col-span-2"><span style={{ color: palette.primary }} className="font-bold">LINKEDIN:</span> {contact.linkedin}</div>}
            {contact.website && <div><span style={{ color: palette.primary }} className="font-bold">WEB:</span> {contact.website}</div>}
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 space-y-5">
              {cvData.profile && (
                <div className="bg-[#121c2a]/70 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-1.5" style={{ color: palette.primary }}>
                    // BIO_SUMMARY
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{cvData.profile}</p>
                </div>
              )}

              {hasExp && (
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest border-b border-slate-800 pb-1 mb-3" style={{ color: palette.primary }}>
                    // EXPERIENCE_LOG
                  </h3>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 pl-3" style={{ borderColor: palette.primary }}>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-white">{exp.position}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900" style={{ color: palette.primary }}>
                            {exp.year}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">{exp.company}</p>
                        <p className="text-[11.5px] text-slate-300 leading-relaxed mt-1 whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-2 space-y-5">
              {hasSkills && (
                <div className="bg-[#121c2a]/70 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-3" style={{ color: palette.primary }}>
                    // TECH_STACK
                  </h3>
                  <div className="space-y-2.5">
                    {cvData.skills.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span>{s.name}</span>
                          <span className="font-bold" style={{ color: palette.primary }}>{s.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasEdu && (
                <div className="bg-[#121c2a]/70 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-2.5" style={{ color: palette.primary }}>
                    // ACADEMIA
                  </h3>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu, i) => (
                      <div key={i}>
                        <div className="font-bold text-white">{edu.school}</div>
                        <p className="text-[11px] text-slate-400">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>STATUS: READY_FOR_DEPLOYMENT</span>
          <span>CYBER TECH RESUME</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. TEMPLATE C6: Center Spine Symmetrical Timeline
  // =========================================================================
  if (themeId === 'tpl-c6') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans p-8 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER SIMETRIS DI TENGAH */}
          <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: palette.primaryBorder }}>
            <div
              className="w-24 h-24 rounded-full border-4 p-1 mx-auto mb-3 shadow-md"
              style={{ borderColor: palette.primary }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: palette.primaryLight, color: palette.primary }}>
                  <User size={30} />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
              {contact.location && <span>📍 {contact.location}</span>}
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉️ {contact.email}</span>}
              {contact.linkedin && <span>🌐 {contact.linkedin}</span>}
            </div>
          </div>

          {/* DUA KOLOM DENGAN GARIS TENGAH */}
          <div className="grid grid-cols-2 gap-8 relative">
            <div className="space-y-5">
              {cvData.profile && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'CORE PROFILE' : 'PROFIL UTAMA'}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">{cvData.profile}</p>
                </div>
              )}

              {hasExp && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
                  </h3>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="p-3 rounded-lg border" style={{ backgroundColor: palette.primaryLighter, borderColor: palette.primaryBorder }}>
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{exp.position}</span>
                          <span className="text-[10.5px]" style={{ color: palette.primary }}>{exp.year}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 mb-1">{exp.company}</p>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 border-l pl-8" style={{ borderColor: palette.primaryBorder }}>
              {hasEdu && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
                  </h3>
                  <div className="space-y-2">
                    {cvData.education.map((edu, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{edu.school}</span>
                          <span className="text-[11px]" style={{ color: palette.primary }}>{edu.year}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSkills && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'COMPETENCIES' : 'KOMPETENSI & SKILL'}
                  </h3>
                  <div className="space-y-2">
                    {cvData.skills.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-800">{s.name}</span>
                          <span className="font-bold" style={{ color: palette.primary }}>{s.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'CERTIFICATIONS' : 'SERTIFIKASI'}
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {cvData.awards.map((a, i) => (
                      <div key={i} className="border-l-2 pl-2" style={{ borderColor: palette.primary }}>
                        <span className="font-bold">{a.name}</span> — <span className="text-slate-500">{a.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Center Spine Timeline • Keseimbangan Simetris</span>
          <span>Dokumen Resmi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. TEMPLATE C7: Bold Geometric Ribbon & 3-Column Studio Grid
  // =========================================================================
  if (themeId === 'tpl-c7') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans p-6 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* GEOMETRIC RIBBON HEADER */}
          <div className="relative mb-5 bg-slate-900 rounded-xl overflow-hidden p-6 text-white flex justify-between items-center shadow-md">
            <div
              className="absolute left-0 top-0 bottom-0 w-3"
              style={{ backgroundColor: palette.primary }}
            />
            <div className="pl-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
              >
                STUDIO RESUME // 07
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi / Posisi Anda')}
              </p>
            </div>
            <div
              className="w-20 h-20 rounded-xl border-2 p-1 overflow-hidden shrink-0 shadow"
              style={{ borderColor: palette.primary, backgroundColor: palette.darkSidebarCard }}
            >
              {cvData.profileImage ? (
                <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={28} /></div>
              )}
            </div>
          </div>

          {/* 3-SEKSI STUDIO GRID (25% - 45% - 30%) */}
          <div className="grid grid-cols-12 gap-5">
            {/* KOLOM 1: KONTAK & SKILL TAGS (Col 3 / 25%) */}
            <div className="col-span-3 space-y-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2">
                <h4 className="font-bold text-[11px] uppercase tracking-wider border-b pb-1" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                  {isEn ? 'CONTACT' : 'KONTAK'}
                </h4>
                {contact.phone && <div className="text-[11px] break-all">📞 {contact.phone}</div>}
                {contact.email && <div className="text-[11px] break-all">✉️ {contact.email}</div>}
                {contact.location && <div className="text-[11px]">📍 {contact.location}</div>}
                {contact.linkedin && <div className="text-[11px] break-all">🌐 {contact.linkedin}</div>}
              </div>

              {hasSkills && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'CORE SKILLS' : 'KEAHLIAN'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded border"
                        style={{ backgroundColor: palette.primaryLighter, borderColor: palette.primaryBorder, color: palette.primary }}
                      >
                        {s.name} ({s.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'AWARDS' : 'PRESTASI'}
                  </h4>
                  <div className="space-y-1 text-[10.5px]">
                    {cvData.awards.map((a, i) => (
                      <div key={i}>
                        <div className="font-semibold text-slate-800">{a.name}</div>
                        <div className="text-slate-500 text-[9.5px]">{a.issuer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* KOLOM 2: PENGALAMAN KERJA (Col 6 / 50%) */}
            <div className="col-span-6 space-y-4">
              {cvData.profile && (
                <div className="border-l-3 pl-3" style={{ borderColor: palette.primary }}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: palette.primary }}>
                    {isEn ? 'SUMMARY' : 'RINGKASAN'}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">{cvData.profile}</p>
                </div>
              )}

              {hasExp && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider border-b pb-1 mb-3" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
                  </h4>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="bg-slate-50/60 p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{exp.position}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: palette.primaryLight, color: palette.primary }}>
                            {exp.year}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 mb-1">{exp.company}</p>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* KOLOM 3: EDUKASI & PROYEK (Col 3 / 25%) */}
            <div className="col-span-3 space-y-4">
              {hasEdu && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider border-b pb-1 mb-2.5" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu, i) => (
                      <div key={i} className="p-2 rounded border border-slate-200 bg-white">
                        <div className="font-bold text-[11px] text-slate-900">{edu.school}</div>
                        <div className="text-[10.5px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasProjects && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'PROJECTS' : 'PROYEK'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {cvData.projects.map((proj, i) => (
                      <div key={i} className="p-2 rounded border border-slate-200 bg-white">
                        <div className="font-bold text-[11px] text-slate-900">{proj.name}</div>
                        <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{proj.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
          <span>Studio 3-Column Grid • Desain Asimetris Modern</span>
          <span>Curriculum Vitae</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. TEMPLATE C8: Double-Frame Luxury Elegance
  // =========================================================================
  if (themeId === 'tpl-c8') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-[#faf8f5] text-slate-900 font-serif p-10 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border-4 border-double" style={{ borderColor: palette.primary }}>
        <div>
          {/* HEADER DENGAN BINGKAI ORNAMEN EMAS/WARNA */}
          <div className="text-center pb-5 mb-5 border-b border-double border-b-4" style={{ borderColor: palette.primaryBorder }}>
            <div className="flex justify-center items-center gap-4 mb-2">
              <span className="w-12 h-px" style={{ backgroundColor: palette.primary }} />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded" style={{ backgroundColor: palette.primaryLight, color: palette.primary }}>
                CURRICULUM VITAE
              </span>
              <span className="w-12 h-px" style={{ backgroundColor: palette.primary }} />
            </div>

            <h1 className="text-3xl font-normal tracking-wide uppercase text-slate-950">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-xs font-sans font-semibold tracking-widest uppercase mt-1 text-slate-600">
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>

            <div className="flex justify-center gap-4 text-xs font-sans text-slate-600 mt-2.5">
              {contact.phone && <span>{contact.phone}</span>}
              {contact.email && <span>• {contact.email}</span>}
              {contact.location && <span>• {contact.location}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-5 p-4 rounded border text-center" style={{ backgroundColor: palette.primaryLighter, borderColor: palette.primaryBorder }}>
              <p className="text-xs text-slate-800 leading-relaxed italic max-w-2xl mx-auto">
                &ldquo;{cvData.profile}&rdquo;
              </p>
            </div>
          )}

          {/* DUA KOLOM ASIMETRIS (60% - 40%) */}
          <div className="grid grid-cols-5 gap-6">
            {/* PENGALAMAN (3 Cols / 60%) */}
            <div className="col-span-3 space-y-4">
              {hasExp && (
                <div>
                  <h3 className="text-xs font-sans font-bold uppercase tracking-widest border-b pb-1 mb-3 flex items-center gap-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    <span>◆</span> {isEn ? 'PROFESSIONAL EXPERIENCE' : 'PENGALAMAN PROFESIONAL'}
                  </h3>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="relative pl-3 border-l" style={{ borderColor: palette.primary }}>
                        <div className="flex justify-between items-baseline font-bold text-xs text-slate-900 font-sans">
                          <span>{exp.position}</span>
                          <span className="text-[11px] font-normal text-slate-500">{exp.year}</span>
                        </div>
                        <p className="text-xs italic text-slate-700 mb-1">{exp.company}</p>
                        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PENDIDIKAN & SKILL (2 Cols / 40%) */}
            <div className="col-span-2 space-y-5 border-l pl-5" style={{ borderColor: palette.primaryBorder }}>
              {hasEdu && (
                <div>
                  <h3 className="text-xs font-sans font-bold uppercase tracking-widest border-b pb-1 mb-2.5 flex items-center gap-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    <span>◆</span> {isEn ? 'ACADEMIC BACKGROUND' : 'RIWAYAT PENDIDIKAN'}
                  </h3>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu, i) => (
                      <div key={i}>
                        <div className="font-bold text-slate-900">{edu.school}</div>
                        <div className="text-[11px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSkills && (
                <div>
                  <h3 className="text-xs font-sans font-bold uppercase tracking-widest border-b pb-1 mb-2.5 flex items-center gap-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    <span>◆</span> {isEn ? 'KEY EXPERTISE' : 'KOMPETENSI UTAMA'}
                  </h3>
                  <div className="space-y-2 font-sans text-xs">
                    {cvData.skills.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span>{s.name}</span>
                          <span className="font-semibold" style={{ color: palette.primary }}>{s.percentage}%</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div>
                  <h3 className="text-xs font-sans font-bold uppercase tracking-widest border-b pb-1 mb-2 flex items-center gap-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    <span>◆</span> {isEn ? 'HONORS' : 'PENGHARGAAN'}
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {cvData.awards.map((a, i) => (
                      <div key={i}>
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-[10px] text-slate-500">{a.issuer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] font-sans text-slate-500 flex justify-between">
          <span>Double-Frame Luxury • Edisi Eksekutif Klasik</span>
          <span>Dokumen Resmi Terverifikasi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. TEMPLATE C9: Numbered Pipeline Steps (01-04 Process Layout)
  // =========================================================================
  if (themeId === 'tpl-c9') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans p-8 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER PROSES DENGAN KARTU IDENTITAS */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white" style={{ backgroundColor: palette.primary }}>
                  STEP-BY-STEP CV
                </span>
                <span className="text-xs text-slate-500 font-medium">Pipeline Portfolio</span>
              </div>
              <h1 className="text-3xl font-black uppercase text-slate-950 tracking-tight">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.primary }}>
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-xs text-slate-600 space-y-0.5 font-medium">
                {contact.phone && <div>📞 {contact.phone}</div>}
                {contact.email && <div>✉️ {contact.email}</div>}
                {contact.location && <div>📍 {contact.location}</div>}
              </div>
              <div
                className="w-16 h-16 rounded-xl border-2 p-0.5 overflow-hidden shrink-0 shadow-sm"
                style={{ borderColor: palette.primary }}
              >
                {cvData.profileImage ? (
                  <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                )}
              </div>
            </div>
          </div>

          {/* 4 LANGKAH PROSES (01 - 02 - 03 - 04) */}
          <div className="space-y-4">
            {/* STEP 01: PROFILE */}
            {cvData.profile && (
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                  style={{ backgroundColor: palette.primary }}
                >
                  01
                </div>
                <div className="flex-1 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: palette.primary }}>
                    {isEn ? 'CAREER OBJECTIVE & PROFILE' : 'PROFIL & TUJUAN KARIR'}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">{cvData.profile}</p>
                </div>
              </div>
            )}

            {/* STEP 02: PENGALAMAN */}
            {hasExp && (
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                  style={{ backgroundColor: palette.primary }}
                >
                  02
                </div>
                <div className="flex-1 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.primary }}>
                    {isEn ? 'EXPERIENCE & ACHIEVEMENTS' : 'PENGALAMAN KERJA & PENCAPAIAN'}
                  </h3>
                  <div className="space-y-3">
                    {cvData.experience.map((exp, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{exp.position} — <span className="font-semibold text-slate-600">{exp.company}</span></span>
                          <span className="text-[11px] font-medium" style={{ color: palette.primary }}>{exp.year}</span>
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed mt-0.5 whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 03: KEAHLIAN & KOMPETENSI */}
            {hasSkills && (
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                  style={{ backgroundColor: palette.primary }}
                >
                  03
                </div>
                <div className="flex-1 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.primary }}>
                    {isEn ? 'TOOLKIT & COMPETENCY' : 'KEAHLIAN & KOMPETENSI TEKNIS'}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {cvData.skills.map((s, i) => (
                      <div key={i} className="p-1.5 rounded border border-slate-200 bg-white flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-800">{s.name}</span>
                        <span className="font-bold text-[11px]" style={{ color: palette.primary }}>{s.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 04: PENDIDIKAN & SERTIFIKASI */}
            <div className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                style={{ backgroundColor: palette.primary }}
              >
                04
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.primary }}>
                  {isEn ? 'EDUCATION & CERTIFICATIONS' : 'PENDIDIKAN & SERTIFIKASI'}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {hasEdu && (
                    <div className="space-y-1.5">
                      {cvData.education.map((edu, i) => (
                        <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="font-bold text-slate-900">{edu.school}</div>
                          <div className="text-[11px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {hasAwards && (
                    <div className="space-y-1.5">
                      {cvData.awards.map((a, i) => (
                        <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="font-bold text-slate-900">{a.name}</div>
                          <div className="text-[11px] text-slate-500">{a.issuer}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Numbered Pipeline Steps • 01 - 04 Alur Profesional</span>
          <span>CV Resmi Terstruktur</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 10. TEMPLATE C10: Magazine Editorial Spread
  // =========================================================================
  return (
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-8 flex flex-col justify-between overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
      <div>
        {/* EDITORIAL TOP HEADER WITH MONOGRAM & LARGE HEADLINE */}
        <div className="border-b-4 border-slate-950 pb-5 mb-5 flex items-start gap-6">
          <div
            className="w-24 h-28 border-2 p-1 bg-white shrink-0 shadow-md relative"
            style={{ borderColor: palette.primary }}
          >
            {cvData.profileImage ? (
              <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-serif text-3xl font-bold">
                {cvData.name ? cvData.name.charAt(0) : 'M'}
              </div>
            )}
            <div
              className="absolute -bottom-2 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 uppercase tracking-widest shadow"
              style={{ backgroundColor: palette.primary }}
            >
              ED. 2026
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                THE PROFESSIONAL DOSSIER
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 leading-none">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-1.5" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉️ {contact.email}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
              {contact.linkedin && <span>🌐 {contact.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* 2-KOLOM NEWSPAPER EDITORIAL COLUMNS */}
        <div className="grid grid-cols-12 gap-6">
          {/* KOLOM KIRI (7 Cols / 58%) */}
          <div className="col-span-7 space-y-4">
            {cvData.profile && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 flex items-center justify-between"
                  style={{ borderColor: palette.primaryBorder }}
                >
                  <span style={{ color: palette.primary }}>{isEn ? 'LEAD STORY // EXECUTIVE PROFILE' : 'PROFIL UTAMA // RINGKASAN'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">SEC. 01</span>
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed text-justify first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                  {cvData.profile}
                </p>
              </div>
            )}

            {hasExp && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 flex items-center justify-between"
                  style={{ borderColor: palette.primaryBorder }}
                >
                  <span style={{ color: palette.primary }}>{isEn ? 'CHRONICLE // CAREER HISTORY' : 'KRONIK // PENGALAMAN KERJA'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">SEC. 02</span>
                </h3>
                <div className="space-y-3.5">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="border-b border-slate-100 pb-2.5">
                      <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                        <span>{exp.position}</span>
                        <span className="text-[11px] font-mono font-medium" style={{ color: palette.primary }}>{exp.year}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mb-0.5">{exp.company}</p>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (5 Cols / 42%) */}
          <div className="col-span-5 space-y-4 border-l border-slate-200 pl-6">
            {hasSkills && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2.5 flex items-center justify-between"
                  style={{ borderColor: palette.primaryBorder }}
                >
                  <span style={{ color: palette.primary }}>{isEn ? 'COMPETENCY METRICS' : 'MATRIKS KEAHLIAN'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">SEC. 03</span>
                </h3>
                <div className="space-y-2">
                  {cvData.skills.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5 font-medium">
                        <span>{s.name}</span>
                        <span className="font-bold" style={{ color: palette.primary }}>{s.percentage}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: palette.primary }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasEdu && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2.5 flex items-center justify-between"
                  style={{ borderColor: palette.primaryBorder }}
                >
                  <span style={{ color: palette.primary }}>{isEn ? 'ACADEMIC RECORD' : 'REKAM AKADEMIS'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">SEC. 04</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {cvData.education.map((edu, i) => (
                    <div key={i}>
                      <div className="font-bold text-slate-900">{edu.school}</div>
                      <div className="text-[11px] text-slate-600">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasAwards && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
                  style={{ borderColor: palette.primaryBorder }}
                >
                  <span style={{ color: palette.primary }}>{isEn ? 'ACCREDITATIONS' : 'AKREDITASI & PRESTASI'}</span>
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {cvData.awards.map((a, i) => (
                    <div key={i}>
                      <div className="font-semibold text-slate-900">{a.name}</div>
                      <div className="text-[10px] text-slate-500">{a.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between font-serif">
        <span>Editorial Magazine Spread • Contemporary Publishing Standard</span>
        <span>Curriculum Vitae</span>
      </div>
    </div>
  );
}
