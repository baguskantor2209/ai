import React from 'react';
import { PortfolioData } from '../portfolioTypes';
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const ModernProfessionalView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const pColor = design.primaryColor || '#3b82f6';
  const aColor = design.accentColor || '#10b981';

  const btnClass =
    design.buttonStyle === 'rounded-full'
      ? 'rounded-full'
      : design.buttonStyle === 'rounded-none'
      ? 'rounded-none'
      : 'rounded-xl';

  return (
    <div
      className="min-h-full bg-[#0b0f19] text-gray-100 font-sans selection:bg-blue-500/30 selection:text-white"
      style={{
        fontFamily:
          design.fontFamily === 'Poppins'
            ? "'Poppins', sans-serif"
            : design.fontFamily === 'Playfair'
            ? "'Playfair Display', serif"
            : design.fontFamily === 'Space Grotesk'
            ? "'Space Grotesk', sans-serif"
            : design.fontFamily === 'Fira Code'
            ? "'Fira Code', monospace"
            : "'Inter', sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0b0f19]/80 border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="#" className="font-bold text-lg tracking-tight flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${pColor}, ${aColor})` }}
            >
              {profile.fullName.charAt(0) || 'P'}
            </span>
            <span className="text-white hover:text-blue-400 transition-colors">
              {profile.fullName}
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            {design.visibleSections.about && <a href="#about" className="hover:text-white transition-colors">Tentang</a>}
            {design.visibleSections.experience && <a href="#experience" className="hover:text-white transition-colors">Pengalaman</a>}
            {design.visibleSections.projects && <a href="#projects" className="hover:text-white transition-colors">Proyek</a>}
            {design.visibleSections.skills && <a href="#skills" className="hover:text-white transition-colors">Keahlian</a>}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                className={`px-4 py-1.5 text-xs font-semibold text-white transition-all shadow-md ${btnClass}`}
                style={{ backgroundColor: pColor }}
              >
                Hubungi
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6 border-b border-white/5">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: pColor }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: aColor }}
        />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14">
          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-gray-300">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aColor }} />
              <span>Available for projects & roles</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {profile.fullName}
            </h1>
            <p className="text-lg sm:text-xl font-medium" style={{ color: pColor }}>
              {profile.headline}
            </p>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              {profile.summary}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {profile.primaryCtaText && (
                <a
                  href={profile.primaryCtaLink || '#projects'}
                  className={`px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:opacity-90 cursor-pointer flex items-center gap-2 ${btnClass}`}
                  style={{ backgroundColor: pColor }}
                >
                  <span>{profile.primaryCtaText}</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              {profile.secondaryCtaText && (
                <a
                  href={profile.secondaryCtaLink || '#contact'}
                  className={`px-6 py-3 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer ${btnClass}`}
                >
                  {profile.secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {profile.avatarUrl && (
            <div className="relative group shrink-0">
              <div
                className="absolute -inset-1 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${pColor}, ${aColor})` }}
              />
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="relative w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-3xl border-2 border-white/10 shadow-2xl"
              />
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {design.visibleSections.about && (
        <section id="about" className="py-16 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: pColor }} />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {about.sectionTitle || 'Tentang Saya'}
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {about.bio}
            </p>
            {about.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {about.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300"
                  >
                    <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: aColor }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}
            {about.additionalInfo && (
              <p className="text-xs text-gray-400 italic pt-1">{about.additionalInfo}</p>
            )}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {design.visibleSections.experience && experiences.length > 0 && (
        <section id="experience" className="py-16 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: pColor }} />
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase size={20} style={{ color: pColor }} /> Pengalaman Kerja
              </h2>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-10 group">
                  <div
                    className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b0f19] transition-transform group-hover:scale-125"
                    style={{ backgroundColor: pColor }}
                  />
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-base font-bold text-white">{exp.position}</h3>
                        <p className="text-xs font-medium" style={{ color: aColor }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 self-start sm:self-auto">
                        {exp.startDate} - {exp.current ? 'Sekarang' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-300 leading-relaxed">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1 pt-1">
                        {exp.achievements.map((ach, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {design.visibleSections.projects && projects.length > 0 && (
        <section id="projects" className="py-16 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: pColor }} />
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <FolderGit2 size={20} style={{ color: pColor }} /> Proyek Unggulan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 overflow-hidden flex flex-col group transition-all hover:-translate-y-1 shadow-lg"
                >
                  {proj.thumbnail && (
                    <div className="h-44 w-full overflow-hidden relative bg-black/40">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-gray-400">
                          {proj.role || 'Project'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/5 text-xs font-semibold">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 hover:underline"
                          style={{ color: pColor }}
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-gray-400 hover:text-white"
                        >
                          <Github size={13} />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills & Certifications Section */}
      {(design.visibleSections.skills || design.visibleSections.certifications) && (
        <section id="skills" className="py-16 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Skills */}
            {design.visibleSections.skills && skills.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: pColor }} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Keahlian & Tools</h2>
                </div>
                <div className="space-y-3.5">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-200">{s.name}</span>
                        <span className="text-gray-400">{s.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.level}%`,
                            background: `linear-gradient(90deg, ${pColor}, ${aColor})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Education */}
            <div className="space-y-8">
              {design.visibleSections.education && education.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: aColor }} />
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <GraduationCap size={18} style={{ color: aColor }} /> Pendidikan
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                        <h3 className="text-sm font-bold text-white">{edu.institution}</h3>
                        <p className="text-xs text-blue-400 font-medium">
                          {edu.degree} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ''}
                        </p>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          {edu.startYear} - {edu.endYear}
                        </span>
                        {edu.description && (
                          <p className="text-xs text-gray-300 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {design.visibleSections.certifications && certifications.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: pColor }} />
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <Award size={18} style={{ color: pColor }} /> Sertifikasi
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{cert.name}</p>
                          <p className="text-[11px] text-gray-400">{cert.issuer}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {design.visibleSections.contact && (
        <section id="contact" className="py-16 px-6 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Mari Bekerja Sama
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Tertarik mendiskusikan peluang proyek, kolaborasi, atau posisi baru? Hubungi saya secara langsung.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  <Mail size={15} style={{ color: pColor }} />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  <Phone size={15} style={{ color: aColor }} />
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                  <MapPin size={15} className="text-amber-400" />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-3 pt-2">
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <Github size={18} />
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <Globe size={18} />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} {profile.fullName}. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-gray-400">Dibuat dengan Portfolio Studio</p>
      </footer>
    </div>
  );
};
