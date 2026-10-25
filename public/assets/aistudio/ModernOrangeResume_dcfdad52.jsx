import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export default function ModernOrangeResume({ cvData }) {
  const contact = {
    phone: cvData.phone || cvData.contact?.phone,
    email: cvData.email || cvData.contact?.email,
    location: cvData.location || cvData.contact?.location,
    linkedin: cvData.linkedin || cvData.contact?.linkedin,
    website: cvData.website || cvData.contact?.website,
  };

  return (
    <div className="w-[210mm] min-h-[297mm] max-h-[297mm] bg-white text-slate-800 font-sans flex overflow-hidden mx-auto print:shadow-none print:m-0 shadow-lg relative box-border border border-gray-100">
      
      {/* ================= KOLOM KIRI (UTAMA) ================= */}
      <div className="w-[62%] p-8 flex flex-col bg-white h-[297mm] overflow-hidden">
        
        {/* HEADER NAMA & PROFESI */}
        <div className="bg-amber-500 -mx-8 -mt-8 p-8 mb-6 text-white relative flex-shrink-0">
          <h1 className="text-4xl font-extrabold uppercase tracking-wider leading-tight break-words">
            {cvData.name || 'NAMA LENGKAP'}
          </h1>
          <p className="text-sm font-bold tracking-widest uppercase mt-2 text-slate-900 break-words">
            {cvData.title || 'Profesi Anda'}
          </p>
        </div>

        {/* WRAPPER KONTEN KIRI */}
        <div className="flex-1 flex flex-col justify-between pb-4">
          
          {/* PROFIL SINGKAT */}
          {cvData.profile && (
            <div>
              <div className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-sm px-4 py-1.5 mb-3 inline-block">
                PROFILE
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                {cvData.profile}
              </p>
            </div>
          )}

          {/* RIWAYAT PENDIDIKAN */}
          {cvData.education && cvData.education.length > 0 && cvData.education[0].school && (
            <div>
              <div className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-sm px-4 py-1.5 mb-4 block w-full">
                EDUCATION
              </div>
              <div className="space-y-5">
                {cvData.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-3.5 h-3.5 bg-amber-500 mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-bold text-slate-800">{edu.school}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{edu.year}</span>
                      </div>
                      <p className="text-xs font-bold text-amber-600 capitalize">
                        {edu.level || edu.degree} {edu.major ? `- ${edu.major}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PENGALAMAN KERJA */}
          {cvData.experience && cvData.experience.length > 0 && cvData.experience[0].position && (
            <div>
              <div className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-sm px-4 py-1.5 mb-4 block w-full">
                EXPERIENCE
              </div>
              <div className="space-y-5">
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-3.5 h-3.5 bg-amber-500 mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-bold text-slate-800">{exp.position}</span>
                        <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap ml-2">{exp.year}</span>
                      </div>
                      <p className="text-xs font-bold text-amber-600 mb-1.5">{exp.company}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROYEK */}
          {!cvData.noProject && cvData.projects && cvData.projects.length > 0 && cvData.projects[0].name && (
            <div>
              <div className="bg-amber-500 text-slate-900 font-bold uppercase tracking-widest text-sm px-4 py-1.5 mb-4 block w-full">
                PROJECTS
              </div>
              <div className="space-y-4">
                {cvData.projects.map((proj, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-amber-500 mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-800">{proj.name}</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line mt-1">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= KOLOM KANAN (SIDEBAR GELAP) ================= */}
      <div className="w-[38%] bg-[#22252a] text-white p-8 flex flex-col items-center text-center h-[297mm]">
        
        {/* FOTO PROFIL */}
        <div className="w-40 h-40 rounded-full border-4 border-amber-500 p-1 bg-[#22252a] -mt-2 mb-4 overflow-hidden flex justify-center items-center flex-shrink-0">
          {cvData.profileImage ? (
            <img src={cvData.profileImage} alt="Foto" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-sm">
              No Photo
            </div>
          )}
        </div>

        {/* WRAPPER KONTEN KANAN */}
        <div className="flex-1 flex flex-col justify-between w-full pb-4">
          
          {/* KONTAK */}
          <div className="w-full">
            <div className="border-2 border-amber-500 py-2 px-3 text-sm font-bold uppercase tracking-widest text-white mb-5">
              CONTACT ME
            </div>
            <div className="text-left text-xs space-y-4 text-slate-300">
              {contact.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="break-words leading-relaxed">{contact.location}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-amber-500 flex-shrink-0" />
                  <span className="break-all">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-500 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {/* LINKEDIN SEKARANG MUNCUL DI SINI */}
              {contact.linkedin && (
                <div className="flex items-center gap-3">
                  <Share2 size={16} className="text-amber-500 flex-shrink-0" />
                  <span className="break-all">{contact.linkedin}</span>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-amber-500 flex-shrink-0" />
                  <span className="break-all">{contact.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* KEAHLIAN / SKILL */}
          {cvData.skills && cvData.skills.length > 0 && cvData.skills[0].name && (
            <div className="w-full">
              <div className="border-2 border-amber-500 py-2 px-3 text-sm font-bold uppercase tracking-widest text-white mb-5">
                PRO SKILLS
              </div>
              <div className="space-y-4 text-left">
                {cvData.skills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase mb-1.5 text-slate-200">
                      <span>{s.name}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 overflow-hidden rounded-sm">
                      <div className="h-full bg-amber-500" style={{ width: `${s.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PENGHARGAAN */}
          {cvData.awards && cvData.awards.length > 0 && cvData.awards[0].name && (
            <div className="w-full">
              <div className="border-2 border-amber-500 py-2 px-3 text-sm font-bold uppercase tracking-widest text-white mb-5">
                AWARDS
              </div>
              <div className="space-y-4 text-left text-[11px] text-slate-300">
                {cvData.awards.map((award, i) => (
                  <div key={i}>
                    <div className="font-bold text-amber-500 mb-0.5">{award.name}</div>
                    <div className="leading-tight">{award.issuer} ({award.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}