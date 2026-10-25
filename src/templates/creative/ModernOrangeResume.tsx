import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2, Award, BookOpen, Briefcase, User, CheckCircle2, Languages } from 'lucide-react';
import { CvData } from '../../types';

interface ModernOrangeResumeProps {
  cvData: CvData;
}

export default function ModernOrangeResume({ cvData }: ModernOrangeResumeProps) {
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

  // Hitung kepadatan konten agar spasi vertikal menyesuaikan secara proporsional dan tidak ada void kosong
  const expCount = cvData.experience?.filter((e) => e.position?.trim()).length || 0;
  const isCompact = expCount <= 2;

  return (
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white text-slate-800 font-sans flex overflow-hidden mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
      
      {/* ================= KOLOM KIRI (UTAMA - 63%) ================= */}
      <div className="w-[63%] p-8 pb-6 flex flex-col bg-white h-full justify-between border-r border-slate-100">
        <div>
          {/* HEADER NAMA & PROFESI */}
          <div className="bg-amber-500 -mx-8 -mt-8 p-8 mb-6 text-white relative shrink-0 shadow-md">
            <h1 className="text-3xl font-black uppercase tracking-wider leading-tight break-words text-white drop-shadow-sm">
              {cvData.name || 'NAMA LENGKAP ANDA'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded">
                {cvData.title || (cvData.notWorking ? 'OPEN TO WORK' : 'Profesi / Posisi Anda')}
              </span>
            </div>
          </div>

          {/* PROFIL SINGKAT */}
          {cvData.profile && (
            <div className={isCompact ? 'mb-6' : 'mb-5'}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h2 className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs">
                  TENTANG SAYA
                </h2>
              </div>
              <p className={`text-slate-700 leading-relaxed text-justify whitespace-pre-line ${isCompact ? 'text-[12.5px]' : 'text-xs'}`}>
                {cvData.profile}
              </p>
            </div>
          )}

          {/* PENGALAMAN KERJA DENGAN TIMELINE ELEGAN */}
          {hasExp && (
            <div className={isCompact ? 'mb-6' : 'mb-5'}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h2 className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs">
                  PENGALAMAN KERJA
                </h2>
              </div>

              <div className={`relative pl-4 border-l-2 border-amber-500/30 ml-2 ${isCompact ? 'space-y-4' : 'space-y-3.5'}`}>
                {cvData.experience.map((exp, i) => {
                  if (!exp.position || !exp.position.trim()) return null;
                  return (
                    <div key={i} className="relative">
                      {/* Node Titik Timeline */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                      
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-slate-900">{exp.position}</span>
                        <span className="text-[11px] text-amber-600 font-bold whitespace-nowrap ml-2 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
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

          {/* RIWAYAT PENDIDIKAN DENGAN TIMELINE */}
          {hasEdu && (
            <div className={isCompact ? 'mb-6' : 'mb-5'}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h2 className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs">
                  RIWAYAT PENDIDIKAN
                </h2>
              </div>

              <div className={`relative pl-4 border-l-2 border-amber-500/30 ml-2 ${isCompact ? 'space-y-3.5' : 'space-y-3'}`}>
                {cvData.education.map((edu, i) => {
                  if (!edu.school || !edu.school.trim()) return null;
                  return (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                      
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-slate-900">{edu.school}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-amber-700">
                        {edu.level} {edu.major ? `• Jurusan ${edu.major}` : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROYEK & PORTOFOLIO */}
          {hasProjects && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h2 className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-xs px-2.5 py-0.5 rounded-xs">
                  PROYEK / PORTOFOLIO
                </h2>
              </div>
              <div className="space-y-2.5">
                {cvData.projects.map((proj, i) => {
                  if (!proj.name || !proj.name.trim()) return null;
                  return (
                    <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                        {proj.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ANCHOR: Mengisi dan memadatkan bagian bawah agar tidak kopong */}
        <div className="border-t border-slate-200 pt-3 mt-auto">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 italic">
              <CheckCircle2 size={12} className="text-amber-500 shrink-0" /> Dokumen resmi dibuat dengan akurat & dapat dipertanggungjawabkan
            </span>
            <span className="font-semibold text-slate-400">Curriculum Vitae</span>
          </div>
        </div>
      </div>

      {/* ================= KOLOM KANAN (SIDEBAR GELAP - 37%) ================= */}
      <div className="w-[37%] bg-[#22252a] text-white p-6 pb-6 flex flex-col items-center text-center h-full justify-between">
        <div className="w-full flex flex-col items-center">
          {/* FOTO PROFIL */}
          <div className="w-32 h-32 rounded-full border-4 border-amber-500 p-1 bg-[#22252a] mb-5 overflow-hidden flex justify-center items-center shrink-0 shadow-lg">
            {cvData.profileImage ? (
              <img src={cvData.profileImage} alt="Foto Profil" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-slate-700 rounded-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <User size={32} className="text-slate-500 mb-1" />
                <span>Pas Foto</span>
              </div>
            )}
          </div>

          {/* KONTAK SAYA */}
          <div className="w-full mb-5">
            <div className="border-y border-amber-500/60 py-1 px-3 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 bg-amber-500/10">
              KONTAK SAYA
            </div>
            <div className="text-left text-[11px] space-y-2.5 text-slate-200">
              {contact.location && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <span className="break-words leading-tight">{contact.location}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-amber-400 shrink-0" />
                  <span className="break-all">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-amber-400 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center gap-2.5">
                  <Share2 size={14} className="text-amber-400 shrink-0" />
                  <span className="break-all">{contact.linkedin}</span>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center gap-2.5">
                  <Globe size={14} className="text-amber-400 shrink-0" />
                  <span className="break-all">{contact.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* KEAHLIAN / SKILL */}
          {hasSkills && (
            <div className="w-full mb-5">
              <div className="border-y border-amber-500/60 py-1 px-3 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 bg-amber-500/10">
                KEAHLIAN UTAMA
              </div>
              <div className="space-y-2.5 text-left">
                {cvData.skills.map((s, i) => {
                  if (!s.name || !s.name.trim()) return null;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-[10.5px] font-medium tracking-wide mb-1 text-slate-200">
                        <span>{s.name}</span>
                        <span className="text-amber-400 font-bold">{s.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 overflow-hidden rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(15, s.percentage))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PENGHARGAAN / SERTIFIKAT */}
          {hasAwards && (
            <div className="w-full mb-4">
              <div className="border-y border-amber-500/60 py-1 px-3 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2.5 bg-amber-500/10">
                SERTIFIKASI & PRESTASI
              </div>
              <div className="space-y-2 text-left text-[10.5px] text-slate-300">
                {cvData.awards.map((award, i) => {
                  if (!award.name || !award.name.trim()) return null;
                  return (
                    <div key={i} className="border-l-2 border-amber-500 pl-2">
                      <div className="font-bold text-amber-400 leading-tight">{award.name}</div>
                      <div className="text-slate-400 text-[9.5px]">
                        {award.issuer} {award.year ? `(${award.year})` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* KOMPETENSI SOFT SKILL / PRO WORK ETHIC UNTUK MENGISI KEPADATAN */}
          <div className="w-full mb-3 text-left">
            <div className="border-y border-amber-500/60 py-1 px-3 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2.5 bg-amber-500/10 text-center">
              ETOS & KOMPETENSI
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {['Komunikasi Efektif', 'Problem Solving', 'Kerja Sama Tim', 'Manajemen Waktu', 'Adaptabilitas Cepat'].map((tag, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] px-2 py-0.5 rounded-full">
                  • {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BADGE SIDEBAR */}
        <div className="w-full pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 text-center">
          <p className="tracking-wide">Bahasa: Indonesia (Aktif) • Inggris</p>
        </div>
      </div>
    </div>
  );
}
