import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2, CheckCircle2 } from 'lucide-react';
import { CvData } from '../../types';
import { getColorPalette } from '../colorThemes';

export interface AtsThemeInfo {
  id: string;
  name: string;
  subtitle: string;
  layoutType: string;
  defaultHex: string;
}

export const ATS_TEMPLATES: AtsThemeInfo[] = [
  {
    id: 'tpl-a1',
    name: 'ATS Harvard Classic Single-Column',
    subtitle: 'Format Harvard/Wall Street standar dengan header tengah klasik',
    layoutType: 'Classic Centered Single-Column',
    defaultHex: '#1e293b',
  },
  {
    id: 'tpl-a2',
    name: 'ATS Left-Rail Dedicated Timeline',
    subtitle: 'Kolom kiri khusus tanggal & lokasi (28%), kolom kanan konten jabatan (72%)',
    layoutType: 'Two-Column Left Rail Dates',
    defaultHex: '#0f766e',
  },
  {
    id: 'tpl-a3',
    name: 'ATS Boxed Section Headers',
    subtitle: 'Judul seksi berbingkai pita kotak rapi bernomor untuk navigasi cepat HRD',
    layoutType: 'Boxed Header Ribbon',
    defaultHex: '#1d4ed8',
  },
  {
    id: 'tpl-a4',
    name: 'ATS Tech & Developer Matrix',
    subtitle: 'Matriks tabel keahlian 3-kolom terstruktur dengan format monospaced tech',
    layoutType: 'Technical Matrix Grid',
    defaultHex: '#0891b2',
  },
  {
    id: 'tpl-a5',
    name: 'ATS Double-Rule Executive Serif',
    subtitle: 'Gaya serif klasik dengan garis ganda formal & angka Romawi (I, II, III)',
    layoutType: 'Double-Rule Serif Layout',
    defaultHex: '#b45309',
  },
  {
    id: 'tpl-a6',
    name: 'ATS Split Header 2-Column Body',
    subtitle: 'Header split 50/50 dengan body 2-kolom seimbang (Pengalaman vs Edukasi)',
    layoutType: 'Split Header 2-Column',
    defaultHex: '#4338ca',
  },
  {
    id: 'tpl-a7',
    name: 'ATS Compact Tag Chips',
    subtitle: 'Keahlian berwujud tag chips horizontal terpadat untuk efisiensi ruang',
    layoutType: 'Compact Horizontal Chips',
    defaultHex: '#be123c',
  },
  {
    id: 'tpl-a8',
    name: 'ATS Left Margin Architectural Rail',
    subtitle: 'Garis margin aksen vertikal di tepi kiri bergaya blueprint korporat',
    layoutType: 'Left Margin Guide Rail',
    defaultHex: '#047857',
  },
  {
    id: 'tpl-a9',
    name: 'ATS Academic & Education-First',
    subtitle: 'Format akademis formal yang mengedepankan pendidikan di atas pengalaman',
    layoutType: 'Education-First Chronological',
    defaultHex: '#6d28d9',
  },
  {
    id: 'tpl-a10',
    name: 'ATS Symmetrical Diamond Modernist',
    subtitle: 'Penataan simetris dengan aksen diamond (◆) pada setiap judul seksi',
    layoutType: 'Symmetrical Diamond Layout',
    defaultHex: '#334155',
  },
];

export default function AtsRenderer({
  cvData,
  themeId = 'tpl-a1',
  language = 'id',
  colorTone,
}: {
  cvData: CvData;
  themeId?: string;
  language?: 'id' | 'en';
  colorTone?: string;
}) {
  const isEn = language === 'en';
  const currentTemplate = ATS_TEMPLATES.find((t) => t.id === themeId) || ATS_TEMPLATES[0];
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

  const skillsList = cvData.skills?.filter((s) => s.name?.trim()) || [];
  const defaultCoreSkills = isEn
    ? ['Professional Communication', 'Problem Solving', 'Time Management', 'Team Collaboration', 'Adaptability']
    : ['Komunikasi Profesional', 'Problem Solving', 'Manajemen Waktu', 'Kerja Sama Tim', 'Adaptabilitas'];
  const displaySkills = skillsList.length >= 4
    ? skillsList.map((s) => s.name)
    : [...skillsList.map((s) => s.name), ...defaultCoreSkills.slice(0, 6 - skillsList.length)];

  // =========================================================================
  // ATS 1: Classic Single-Column Harvard / Wall Street
  // =========================================================================
  if (themeId === 'tpl-a1') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: palette.primary }}>
            <h1 className="text-3xl font-black tracking-tight uppercase text-slate-950">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-sm font-bold tracking-wider uppercase mt-1" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi / Posisi Anda')}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2 font-medium">
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>• ✉️ {contact.email}</span>}
              {contact.location && <span>• 📍 {contact.location}</span>}
              {contact.linkedin && <span>• 🌐 {contact.linkedin}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'PROFESSIONAL SUMMARY' : 'RINGKASAN PROFESIONAL'}
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line">{cvData.profile}</p>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
              {isEn ? 'CORE SKILLS & COMPETENCIES' : 'KEAHLIAN & KOMPETENSI'}
            </h2>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-slate-800">
              {displaySkills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
                  <span className="font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {hasExp && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2.5" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
              </h2>
              <div className="space-y-3.5">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                      <span>{exp.position}</span>
                      <span className="text-[11px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic font-medium mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}
              </h2>
              <div className="space-y-2 text-xs">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> {edu.major ? `— ${edu.major}` : ''} ({edu.level})</span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasProjects && (
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'PROJECTS & ACHIEVEMENTS' : 'PROYEK & PENCAPAIAN'}
              </h2>
              <div className="space-y-2 text-xs">
                {cvData.projects.map((p, i) => (
                  <div key={i}>
                    <strong className="text-slate-900">{p.name}</strong>
                    <p className="text-[11.5px] text-slate-700 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Format Harvard Standard • 100% Lolos ATS</span>
          <span>CV Resmi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 2: Left-Rail Dedicated Timeline (Left 28% Date Rail, Right 72% Body)
  // =========================================================================
  if (themeId === 'tpl-a2') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          <div className="border-b-2 pb-4 mb-6 flex justify-between items-end" style={{ borderColor: palette.primary }}>
            <div>
              <h1 className="text-3xl font-black uppercase text-slate-950">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <p className="text-sm font-bold uppercase mt-1" style={{ color: palette.primary }}>
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-0.5">
              {contact.phone && <div>{contact.phone}</div>}
              {contact.email && <div>{contact.email}</div>}
              {contact.location && <div>{contact.location}</div>}
            </div>
          </div>

          {/* DEDICATED LEFT-RAIL LAYOUT */}
          {cvData.profile && (
            <div className="mb-5 flex gap-6">
              <div className="w-28 shrink-0 text-xs font-bold uppercase pt-0.5" style={{ color: palette.primary }}>
                {isEn ? 'PROFILE' : 'PROFIL'}
              </div>
              <div className="flex-1 text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line border-l border-slate-200 pl-4">
                {cvData.profile}
              </div>
            </div>
          )}

          {hasExp && (
            <div className="mb-5 flex gap-6">
              <div className="w-28 shrink-0 text-xs font-bold uppercase pt-0.5" style={{ color: palette.primary }}>
                {isEn ? 'EXPERIENCE' : 'PENGALAMAN'}
              </div>
              <div className="flex-1 border-l border-slate-200 pl-4 space-y-4">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-950 uppercase">{exp.position}</span>
                      <span className="text-[11px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic font-medium mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-5 flex gap-6">
              <div className="w-28 shrink-0 text-xs font-bold uppercase pt-0.5" style={{ color: palette.primary }}>
                {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
              </div>
              <div className="flex-1 border-l border-slate-200 pl-4 space-y-2">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <div>
                      <strong className="text-slate-950">{edu.school}</strong>
                      <p className="text-slate-600 text-[11px]">{edu.level} {edu.major ? `— ${edu.major}` : ''}</p>
                    </div>
                    <span className="text-slate-500 font-medium">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex gap-6">
            <div className="w-28 shrink-0 text-xs font-bold uppercase pt-0.5" style={{ color: palette.primary }}>
              {isEn ? 'COMPETENCIES' : 'KOMPETENSI'}
            </div>
            <div className="flex-1 border-l border-slate-200 pl-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {displaySkills.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span style={{ color: palette.primary }}>▪</span> <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Format Left-Rail Gutter • Struktur Metrik Modern</span>
          <span>CV Resmi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 3: Boxed Section Headers (Ribbon Boxes)
  // =========================================================================
  if (themeId === 'tpl-a3') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          <div className="text-center pb-4 mb-5 border-b border-slate-200">
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-sm font-bold uppercase mt-0.5" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-600 mt-2 font-medium">
              {contact.phone && <span>Telp: {contact.phone}</span>}
              {contact.email && <span>Email: {contact.email}</span>}
              {contact.location && <span>Domisili: {contact.location}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <div
                className="px-3 py-1 text-xs font-bold uppercase mb-2 border rounded"
                style={{ backgroundColor: palette.primaryLight, borderColor: palette.primaryBorder, color: palette.primary }}
              >
                1. {isEn ? 'CAREER OBJECTIVE & PROFILE' : 'PROFIL & MOTIVASI KERJA'}
              </div>
              <p className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line px-1">{cvData.profile}</p>
            </div>
          )}

          {hasExp && (
            <div className="mb-4">
              <div
                className="px-3 py-1 text-xs font-bold uppercase mb-2.5 border rounded"
                style={{ backgroundColor: palette.primaryLight, borderColor: palette.primaryBorder, color: palette.primary }}
              >
                2. {isEn ? 'WORK EXPERIENCE' : 'RIWAYAT PENGALAMAN KERJA'}
              </div>
              <div className="space-y-3.5 px-1">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-xs text-slate-950">
                      <span>{exp.position} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                      <span className="text-[11px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mt-0.5">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-4">
              <div
                className="px-3 py-1 text-xs font-bold uppercase mb-2 border rounded"
                style={{ backgroundColor: palette.primaryLight, borderColor: palette.primaryBorder, color: palette.primary }}
              >
                3. {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}
              </div>
              <div className="space-y-2 text-xs px-1">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> {edu.major ? `(${edu.major})` : ''} — {edu.level}</span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <div
              className="px-3 py-1 text-xs font-bold uppercase mb-2 border rounded"
              style={{ backgroundColor: palette.primaryLight, borderColor: palette.primaryBorder, color: palette.primary }}
            >
              4. {isEn ? 'KEY SKILLS & TOOLS' : 'DAFTAR KEAHLIAN'}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs px-1">
              {displaySkills.map((s, i) => (
                <div key={i} className="border p-1.5 rounded text-center font-medium bg-slate-50 border-slate-200">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Format Boxed Headers • Terstruktur & Mudah Dibaca HRD</span>
          <span>ATS Standard</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 4: Tech & Developer Matrix Grid (3-Column Skills Matrix)
  // =========================================================================
  if (themeId === 'tpl-a4') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          <div className="border-b-2 pb-4 mb-5 flex justify-between items-start" style={{ borderColor: palette.primary }}>
            <div>
              <h1 className="text-3xl font-black uppercase text-slate-950 font-mono">{cvData.name || 'NAMA LENGKAP ANDA'}</h1>
              <p className="text-xs font-mono font-bold uppercase mt-0.5" style={{ color: palette.primary }}>
                {`// ${cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Software Engineer / IT')}`}
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.linkedin && <div>{contact.linkedin}</div>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                [01] {isEn ? 'TECHNICAL SUMMARY' : 'RINGKASAN TEKNIS'}
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{cvData.profile}</p>
            </div>
          )}

          {/* MATRIKS TABEL KEAHLIAN 3-KOLOM */}
          <div className="mb-4">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
              [02] {isEn ? 'TECHNICAL SKILLS MATRIX' : 'MATRIKS KEAHLIAN & TEKNOLOGI'}
            </h2>
            <div className="border rounded overflow-hidden text-xs" style={{ borderColor: palette.primaryBorder }}>
              <div className="grid grid-cols-3 font-bold p-2 border-b" style={{ backgroundColor: palette.primaryLight, borderColor: palette.primaryBorder, color: palette.primary }}>
                <div>{isEn ? 'Technical Tools' : 'Keahlian Teknis'}</div>
                <div>{isEn ? 'Methodology' : 'Metode Kerja'}</div>
                <div>{isEn ? 'Core Competency' : 'Kompetensi Inti'}</div>
              </div>
              <div className="grid grid-cols-3 p-2.5 gap-2 text-slate-800 font-mono text-[11px]">
                <div className="space-y-1">
                  {skillsList.slice(0, 4).map((s, i) => (
                    <div key={i}>• {s.name} ({s.percentage}%)</div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div>• Agile / Scrum</div>
                  <div>• Problem Solving</div>
                  <div>• Quality Assurance</div>
                </div>
                <div className="space-y-1">
                  <div>• Time Management</div>
                  <div>• Communication</div>
                  <div>• System Analysis</div>
                </div>
              </div>
            </div>
          </div>

          {hasExp && (
            <div className="mb-4">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-950 border-b pb-1 mb-2.5" style={{ borderColor: palette.primaryBorder }}>
                [03] {isEn ? 'EXPERIENCE LOG' : 'RIWAYAT PEKERJAAN'}
              </h2>
              <div className="space-y-3.5">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline font-bold text-xs">
                      <span>{exp.position} | <span className="font-semibold text-slate-700">{exp.company}</span></span>
                      <span className="font-mono text-[11px]" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-3">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                [04] {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
              </h2>
              <div className="space-y-1 text-xs">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> ({edu.level} {edu.major ? `• ${edu.major}` : ''})</span>
                    <span className="font-mono text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>// ATS_COMPLIANT: TRUE</span>
          <span>TECH RESUME MATRIX</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 5: Double-Rule Formal Executive Serif
  // =========================================================================
  if (themeId === 'tpl-a5') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-serif p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          <div className="text-center border-b-4 border-double pb-4 mb-5" style={{ borderColor: palette.primary }}>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>
            <div className="flex justify-center gap-4 text-xs font-sans text-slate-700 mt-2 font-medium">
              {contact.phone && <span>Telp: {contact.phone}</span>}
              {contact.email && <span>• Email: {contact.email}</span>}
              {contact.location && <span>• Lokasi: {contact.location}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2 flex items-center justify-between" style={{ borderColor: palette.primaryBorder }}>
                <span>I. {isEn ? 'EXECUTIVE SUMMARY' : 'PROFIL PROFESIONAL'}</span>
                <span className="font-sans text-[10px] text-slate-400">SEC. I</span>
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line">{cvData.profile}</p>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2 flex items-center justify-between" style={{ borderColor: palette.primaryBorder }}>
              <span>II. {isEn ? 'CORE COMPETENCIES' : 'KEAHLIAN & KOMPETENSI'}</span>
              <span className="font-sans text-[10px] text-slate-400">SEC. II</span>
            </h2>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans">
              {displaySkills.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span style={{ color: palette.primary }}>▪</span> <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {hasExp && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2.5 flex items-center justify-between" style={{ borderColor: palette.primaryBorder }}>
                <span>III. {isEn ? 'PROFESSIONAL EXPERIENCE' : 'PENGALAMAN KERJA'}</span>
                <span className="font-sans text-[10px] text-slate-400">SEC. III</span>
              </h2>
              <div className="space-y-3.5">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-950 font-sans">
                      <span>{exp.position}</span>
                      <span className="font-medium" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2 flex items-center justify-between" style={{ borderColor: palette.primaryBorder }}>
                <span>IV. {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}</span>
                <span className="font-sans text-[10px] text-slate-400">SEC. IV</span>
              </h2>
              <div className="space-y-2 text-xs font-sans">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> {edu.major ? `(${edu.major})` : ''}</span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] font-sans text-slate-500 flex justify-between">
          <span>Format Resmi Eksekutif • ATS-Friendly</span>
          <span>Dokumen Terverifikasi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 6: Balanced Split Header with 2-Column Body (58% Left / 42% Right)
  // =========================================================================
  if (themeId === 'tpl-a6') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER SPLIT 50/50 */}
          <div className="grid grid-cols-2 gap-6 pb-4 mb-5 border-b-2" style={{ borderColor: palette.primary }}>
            <div>
              <h1 className="text-3xl font-black uppercase text-slate-950 leading-tight">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: palette.primary }}>
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs text-slate-700 space-y-1 self-center">
              {contact.phone && <div>📞 {contact.phone}</div>}
              {contact.email && <div>✉️ {contact.email}</div>}
              {contact.location && <div>📍 {contact.location}</div>}
              {contact.linkedin && <div>🌐 {contact.linkedin}</div>}
            </div>
          </div>

          {/* BODY 2-KOLOM (Left: Pengalaman 58%, Right: Edu & Skill 42%) */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 space-y-4">
              {cvData.profile && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'CAREER SUMMARY' : 'RINGKASAN KARIR'}
                  </h2>
                  <p className="text-xs text-slate-800 leading-relaxed text-justify">{cvData.profile}</p>
                </div>
              )}

              {hasExp && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
                  </h2>
                  <div className="space-y-3.5">
                    {cvData.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                          <span>{exp.position}</span>
                          <span className="text-[11px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mb-1">{exp.company}</p>
                        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-5 space-y-4 border-l pl-6 border-slate-200">
              {hasEdu && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2.5" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'EDUCATION' : 'PENDIDIKAN'}
                  </h2>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu, i) => (
                      <div key={i}>
                        <div className="font-bold text-slate-900">{edu.school}</div>
                        <div className="text-slate-600 text-[11px]">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                  {isEn ? 'COMPETENCY' : 'KEAHLIAN'}
                </h2>
                <div className="space-y-1 text-xs text-slate-800">
                  {displaySkills.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span style={{ color: palette.primary }}>•</span> <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hasAwards && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                    {isEn ? 'AWARDS' : 'PENGHARGAAN'}
                  </h2>
                  <div className="space-y-1 text-xs text-slate-700">
                    {cvData.awards.map((a, i) => (
                      <div key={i}>
                        <span className="font-bold">{a.name}</span> <span className="text-slate-500 text-[10px]">({a.issuer})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Split Header 2-Column • Kerapian ATS Maksimal</span>
          <span>Curriculum Vitae</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 7: Compact Horizontal Tag Chips
  // =========================================================================
  if (themeId === 'tpl-a7') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER RATA KIRI DENGAN BARIS KONTAK COMPACT */}
          <div className="pb-4 mb-5 border-b-2" style={{ borderColor: palette.primary }}>
            <div className="flex justify-between items-baseline">
              <h1 className="text-3xl font-black uppercase text-slate-950">
                {cvData.name || 'NAMA LENGKAP ANDA'}
              </h1>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: palette.primary }}>
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
              {contact.phone && <span>Tel: {contact.phone}</span>}
              {contact.email && <span>Email: {contact.email}</span>}
              {contact.location && <span>Loc: {contact.location}</span>}
              {contact.linkedin && <span>LinkedIn: {contact.linkedin}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: palette.primary }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
                {isEn ? 'EXECUTIVE STATEMENT' : 'PROFIL RINGKAS'}
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed text-justify whitespace-pre-line pl-3.5">{cvData.profile}</p>
            </div>
          )}

          {/* DENSE HORIZONTAL TAG CHIPS */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: palette.primary }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
              {isEn ? 'CORE SKILLS & TECHNOLOGIES' : 'KEAHLIAN & TEKNOLOGI'}
            </h2>
            <div className="flex flex-wrap gap-1.5 pl-3.5">
              {displaySkills.map((s, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2.5 py-1 rounded border bg-slate-50 border-slate-300 text-slate-900"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {hasExp && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: palette.primary }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
                {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'}
              </h2>
              <div className="space-y-3.5 pl-3.5 border-l-2 ml-1" style={{ borderColor: palette.primaryBorder }}>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                      <span>{exp.position} — <span className="text-slate-600 font-semibold">{exp.company}</span></span>
                      <span className="text-[11px] font-mono font-medium" style={{ color: palette.primary }}>{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mt-0.5">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEdu && (
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: palette.primary }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
                {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'}
              </h2>
              <div className="space-y-1.5 pl-3.5 text-xs">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.school}</strong> {edu.major ? `(${edu.major})` : ''} — {edu.level}</span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Compact Horizontal Chips • Kepadatan Informasi Tinggi</span>
          <span>ATS Standard</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 8: Left Margin Architectural Guide Rail
  // =========================================================================
  if (themeId === 'tpl-a8') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER DENGAN GUIDE RAIL AKSEN */}
          <div className="pl-5 border-l-4 pb-4 mb-5" style={{ borderColor: palette.primary }}>
            <h1 className="text-3xl font-black uppercase text-slate-950 tracking-tight">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: palette.primary }}>
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
              {contact.phone && <span>Tel: {contact.phone}</span>}
              {contact.email && <span>Email: {contact.email}</span>}
              {contact.location && <span>Location: {contact.location}</span>}
            </div>
          </div>

          <div className="pl-5 border-l-4 space-y-4" style={{ borderColor: palette.primaryBorder }}>
            {cvData.profile && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: palette.primary }}>
                  // {isEn ? 'EXECUTIVE PROFILE' : 'PROFIL EKSEKUTIF'}
                </h2>
                <p className="text-xs text-slate-800 leading-relaxed text-justify">{cvData.profile}</p>
              </div>
            )}

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.primary }}>
                // {isEn ? 'CORE COMPETENCIES' : 'KOMPETENSI KERJA'}
              </h2>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {displaySkills.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <span style={{ color: palette.primary }}>▸</span> <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {hasExp && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: palette.primary }}>
                  // {isEn ? 'EMPLOYMENT RECORD' : 'RIWAYAT PEKERJAAN'}
                </h2>
                <div className="space-y-3.5">
                  {cvData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                        <span>{exp.position}</span>
                        <span className="font-semibold text-[11px]" style={{ color: palette.primary }}>{exp.year}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mb-0.5">{exp.company}</p>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasEdu && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.primary }}>
                  // {isEn ? 'ACADEMIC BACKGROUND' : 'PENDIDIKAN'}
                </h2>
                <div className="space-y-1.5 text-xs">
                  {cvData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between">
                      <span><strong>{edu.school}</strong> {edu.major ? `(${edu.major})` : ''}</span>
                      <span className="text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
          <span>Architectural Guide Rail • Standar Presisi Korporat</span>
          <span>CV Resmi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 9: Academic & Education-First Chronological
  // =========================================================================
  if (themeId === 'tpl-a9') {
    return (
      <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-serif p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        <div>
          {/* HEADER AKADEMIS KLASIK */}
          <div className="text-center pb-4 mb-5 border-b-2" style={{ borderColor: palette.primary }}>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <p className="text-xs font-sans font-bold uppercase tracking-widest mt-1 text-slate-700">
              {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
            </p>
            <div className="flex justify-center gap-4 text-xs font-sans text-slate-600 mt-2">
              {contact.phone && <span>Tel: {contact.phone}</span>}
              {contact.email && <span>• Email: {contact.email}</span>}
              {contact.location && <span>• Location: {contact.location}</span>}
            </div>
          </div>

          {cvData.profile && (
            <div className="mb-4">
              <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'ACADEMIC & PROFESSIONAL SUMMARY' : 'RINGKASAN AKADEMIS & PROFESIONAL'}
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed text-justify">{cvData.profile}</p>
            </div>
          )}

          {/* PENDIDIKAN DITEMPATKAN DI ATAS PENGALAMAN (EDUCATION-FIRST) */}
          {hasEdu && (
            <div className="mb-4">
              <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1 mb-2.5" style={{ color: palette.primary, borderColor: palette.primaryBorder }}>
                {isEn ? 'EDUCATION & DEGREES' : 'RIWAYAT PENDIDIKAN & GELAR'}
              </h2>
              <div className="space-y-2.5 text-xs">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <strong className="text-slate-950 text-xs">{edu.school}</strong>
                      <p className="text-slate-700 italic font-sans text-[11px]">{edu.level} {edu.major ? `• Jurusan ${edu.major}` : ''}</p>
                    </div>
                    <span className="font-sans font-semibold text-xs" style={{ color: palette.primary }}>{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasAwards && (
            <div className="mb-4">
              <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'HONORS & ACCREDITATIONS' : 'SERTIFIKASI & PENGHARGAAN'}
              </h2>
              <div className="space-y-1.5 text-xs font-sans">
                {cvData.awards.map((a, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-semibold text-slate-900">{a.name}</span>
                    <span className="text-slate-500 text-[11px]">{a.issuer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasExp && (
            <div className="mb-4">
              <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2.5" style={{ borderColor: palette.primaryBorder }}>
                {isEn ? 'PROFESSIONAL EXPERIENCE' : 'PENGALAMAN KERJA TERKAIT'}
              </h2>
              <div className="space-y-3.5">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline font-bold text-xs text-slate-950 font-sans">
                      <span>{exp.position} — <span className="font-normal italic text-slate-700">{exp.company}</span></span>
                      <span className="text-[11px] font-normal text-slate-500">{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-1 mt-0.5">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-950 border-b pb-1 mb-2" style={{ borderColor: palette.primaryBorder }}>
              {isEn ? 'RESEARCH & TECHNICAL COMPETENCY' : 'KOMPETENSI & KEAHLIAN KHUSUS'}
            </h2>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans">
              {displaySkills.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span style={{ color: palette.primary }}>▪</span> <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 text-[10px] font-sans text-slate-500 flex justify-between">
          <span>Format Akademis Kronologis • Standar Perguruan Tinggi & Riset</span>
          <span>CV Terverifikasi</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ATS 10: Symmetrical Diamond Modernist
  // =========================================================================
  return (
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
      <div>
        {/* HEADER DENGAN AKSEN DIAMOND */}
        <div className="text-center pb-4 mb-5 border-b-2" style={{ borderColor: palette.primary }}>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: palette.primary }}>
            ◆ CURRICULUM VITAE ◆
          </div>
          <h1 className="text-3xl font-black uppercase text-slate-950 tracking-tight">
            {cvData.name || 'NAMA LENGKAP ANDA'}
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-700">
            {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi Anda')}
          </p>

          <div className="flex justify-center gap-4 text-xs text-slate-600 mt-2 font-medium">
            {contact.phone && <span>📞 {contact.phone}</span>}
            {contact.email && <span>◆ {contact.email}</span>}
            {contact.location && <span>◆ {contact.location}</span>}
          </div>
        </div>

        {cvData.profile && (
          <div className="mb-4 text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-1.5 inline-block px-3 py-0.5 rounded border" style={{ borderColor: palette.primaryBorder, color: palette.primary, backgroundColor: palette.primaryLight }}>
              ◆ {isEn ? 'EXECUTIVE PROFILE' : 'PROFIL UTAMA'} ◆
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed text-center max-w-2xl mx-auto">{cvData.profile}</p>
          </div>
        )}

        <div className="mb-4 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 inline-block px-3 py-0.5 rounded border" style={{ borderColor: palette.primaryBorder, color: palette.primary, backgroundColor: palette.primaryLight }}>
            ◆ {isEn ? 'CORE COMPETENCIES' : 'KOMPETENSI UTAMA'} ◆
          </h2>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {displaySkills.map((s, i) => (
              <div key={i} className="border p-1.5 rounded font-medium bg-slate-50 border-slate-200 text-center">
                {s}
              </div>
            ))}
          </div>
        </div>

        {hasExp && (
          <div className="mb-4">
            <div className="text-center mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-widest inline-block px-3 py-0.5 rounded border" style={{ borderColor: palette.primaryBorder, color: palette.primary, backgroundColor: palette.primaryLight }}>
                ◆ {isEn ? 'WORK EXPERIENCE' : 'PENGALAMAN KERJA'} ◆
              </h2>
            </div>
            <div className="space-y-3.5">
              {cvData.experience.map((exp, i) => (
                <div key={i} className="border-b border-slate-100 pb-2">
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-950">
                    <span>{exp.position}</span>
                    <span className="text-[11px] font-semibold" style={{ color: palette.primary }}>{exp.year}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mb-0.5">{exp.company}</p>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasEdu && (
          <div className="mb-3">
            <div className="text-center mb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest inline-block px-3 py-0.5 rounded border" style={{ borderColor: palette.primaryBorder, color: palette.primary, backgroundColor: palette.primaryLight }}>
                ◆ {isEn ? 'EDUCATION' : 'RIWAYAT PENDIDIKAN'} ◆
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {cvData.education.map((edu, i) => (
                <div key={i} className="border p-2 rounded border-slate-200 bg-white">
                  <div className="font-bold text-slate-900">{edu.school}</div>
                  <div className="text-slate-600 text-[11px]">{edu.level} {edu.major ? `• ${edu.major}` : ''} ({edu.year})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
        <span>Symmetrical Diamond Modernist • 100% ATS Screening Compliant</span>
        <span>CV Terverifikasi</span>
      </div>
    </div>
  );
}
