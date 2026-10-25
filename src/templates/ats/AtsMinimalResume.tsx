import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2, CheckCircle2 } from 'lucide-react';
import { CvData } from '../../types';

interface AtsMinimalResumeProps {
  cvData: CvData;
}

export default function AtsMinimalResume({ cvData }: AtsMinimalResumeProps) {
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

  // Deteksi kepadatan: jika input sedikit, buat spasi dan ukuran font lebih proporsional agar tidak kopong
  const expCount = cvData.experience?.filter((e) => e.position?.trim()).length || 0;
  const isCompact = expCount <= 2;

  // Gabungkan keahlian dengan core competencies pelengkap untuk mengisi layout secara profesional
  const skillsList = cvData.skills?.filter((s) => s.name?.trim()) || [];
  const defaultCoreSkills = ['Komunikasi Profesional', 'Problem Solving', 'Manajemen Waktu', 'Kerja Sama Tim', 'Adaptabilitas Kerja'];
  const displaySkills = skillsList.length >= 4 
    ? skillsList.map(s => s.name)
    : [...skillsList.map(s => s.name), ...defaultCoreSkills.slice(0, 6 - skillsList.length)];

  return (
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-900 font-sans p-10 px-12 flex flex-col justify-between mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
      
      {/* BAGIAN ATAS & KONTEN UTAMA */}
      <div>
        {/* HEADER ATS BERSIH & FORMAL */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
          <h1 className="text-3xl font-black tracking-tight uppercase text-slate-950">
            {cvData.name || 'NAMA LENGKAP ANDA'}
          </h1>
          <p className="text-sm font-bold text-slate-700 tracking-wider uppercase mt-1">
            {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi / Posisi Anda')}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2.5 font-medium">
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone size={11} className="text-slate-600" /> {contact.phone}
              </span>
            )}
            {contact.phone && contact.email && <span>•</span>}
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail size={11} className="text-slate-600" /> {contact.email}
              </span>
            )}
            {contact.location && <span>•</span>}
            {contact.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-slate-600" /> {contact.location}
              </span>
            )}
            {contact.linkedin && <span>•</span>}
            {contact.linkedin && (
              <span className="flex items-center gap-1">
                <Share2 size={11} className="text-slate-600" /> {contact.linkedin}
              </span>
            )}
            {contact.website && <span>•</span>}
            {contact.website && (
              <span className="flex items-center gap-1">
                <Globe size={11} className="text-slate-600" /> {contact.website}
              </span>
            )}
          </div>
        </div>

        {/* RINGKASAN PROFESIONAL */}
        {cvData.profile && (
          <div className={isCompact ? 'mb-5' : 'mb-4'}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
              <span>RINGKASAN PROFESIONAL</span>
            </h2>
            <p className={`text-slate-800 leading-relaxed text-justify whitespace-pre-line ${isCompact ? 'text-[12.5px]' : 'text-xs'}`}>
              {cvData.profile}
            </p>
          </div>
        )}

        {/* KEAHLIAN & KOMPETENSI INTI (GRID 2-3 KOLOM) */}
        <div className={isCompact ? 'mb-5' : 'mb-4'}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
            KEAHLIAN & KOMPETENSI
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-slate-800">
            {displaySkills.map((skillName, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></span>
                <span className="font-medium text-slate-900">{skillName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PENGALAMAN KERJA */}
        {hasExp && (
          <div className={isCompact ? 'mb-5' : 'mb-4'}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
              PENGALAMAN KERJA
            </h2>
            <div className={isCompact ? 'space-y-4' : 'space-y-3'}>
              {cvData.experience.map((exp, i) => {
                if (!exp.position || !exp.position.trim()) return null;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                        {exp.position}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic font-medium">{exp.company}</p>
                    <p className={`text-slate-800 leading-relaxed whitespace-pre-line pl-1 ${isCompact ? 'text-[12px]' : 'text-xs'}`}>
                      {exp.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RIWAYAT PENDIDIKAN */}
        {hasEdu && (
          <div className={isCompact ? 'mb-5' : 'mb-4'}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
              RIWAYAT PENDIDIKAN
            </h2>
            <div className="space-y-2 text-xs text-slate-800">
              {cvData.education.map((edu, i) => {
                if (!edu.school || !edu.school.trim()) return null;
                return (
                  <div key={i} className="flex justify-between items-baseline">
                    <span>
                      <strong className="text-slate-950">{edu.school}</strong>{' '}
                      {edu.major ? `— ${edu.major}` : ''} ({edu.level})
                    </span>
                    <span className="text-slate-600 font-medium text-xs">{edu.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROYEK & PORTOFOLIO */}
        {hasProjects && (
          <div className={isCompact ? 'mb-5' : 'mb-4'}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
              PROYEK & PENCAPAIAN
            </h2>
            <div className="space-y-2 text-xs text-slate-800">
              {cvData.projects.map((proj, i) => {
                if (!proj.name || !proj.name.trim()) return null;
                return (
                  <div key={i}>
                    <span className="font-bold text-slate-950">{proj.name}</span>
                    <p className="text-[11.5px] text-slate-700 leading-relaxed">{proj.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PENGHARGAAN & SERTIFIKASI */}
        {hasAwards && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
              PENGHARGAAN & SERTIFIKASI
            </h2>
            <div className="space-y-1.5 text-xs text-slate-800">
              {cvData.awards.map((a, i) => {
                if (!a.name || !a.name.trim()) return null;
                return (
                  <div key={i} className="flex justify-between">
                    <span>
                      <strong className="text-slate-950">{a.name}</strong> — {a.issuer}
                    </span>
                    {a.year && <span className="text-slate-600 text-xs">{a.year}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ATS BERSIH: Memadatkan dan mengunci batas bawah kertas */}
      <div className="border-t border-slate-300 pt-3 mt-auto">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="italic">
            Format Dokumen ATS-Friendly • Curriculum Vitae Resmi
          </span>
          <span>Bahasa: Indonesia (Aktif), Inggris</span>
        </div>
      </div>
    </div>
  );
}
