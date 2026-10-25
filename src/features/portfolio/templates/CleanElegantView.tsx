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
  ArrowRight,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const CleanElegantView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const pColor = design.primaryColor || '#0f172a';
  const aColor = design.accentColor || '#475569';

  const btnClass =
    design.buttonStyle === 'rounded-full'
      ? 'rounded-full'
      : design.buttonStyle === 'rounded-none'
      ? 'rounded-none'
      : 'rounded-xl';

  return (
    <div
      className="min-h-full bg-[#fafaf9] text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900"
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
      <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-50/90 border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#" className="font-semibold text-lg tracking-tight text-stone-900">
            {profile.fullName}
          </a>
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest text-stone-500 font-medium">
            {design.visibleSections.about && <a href="#about" className="hover:text-stone-900 transition-colors">Tentang</a>}
            {design.visibleSections.experience && <a href="#experience" className="hover:text-stone-900 transition-colors">Pengalaman</a>}
            {design.visibleSections.projects && <a href="#projects" className="hover:text-stone-900 transition-colors">Proyek</a>}
            {design.visibleSections.skills && <a href="#skills" className="hover:text-stone-900 transition-colors">Keahlian</a>}
            {design.visibleSections.contact && <a href="#contact" className="hover:text-stone-900 transition-colors">Kontak</a>}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 border-b border-stone-200">
        <div className="max-w-4xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Portfolio & Profile
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-stone-950 tracking-tight leading-tight">
              {profile.fullName}
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 font-normal">
              {profile.headline}
            </p>
            <p className="text-sm sm:text-base text-stone-500 max-w-xl leading-relaxed">
              {profile.summary}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {profile.primaryCtaText && (
                <a
                  href={profile.primaryCtaLink || '#projects'}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:opacity-90 flex items-center gap-2 ${btnClass}`}
                  style={{ backgroundColor: pColor }}
                >
                  <span>{profile.primaryCtaText}</span>
                  <ArrowRight size={14} />
                </a>
              )}
              {profile.secondaryCtaText && (
                <a
                  href={profile.secondaryCtaLink || '#contact'}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-all ${btnClass}`}
                >
                  {profile.secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {profile.avatarUrl && (
            <div className="shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl shadow-xl border border-stone-200"
              />
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {design.visibleSections.about && (
        <section id="about" className="py-16 px-6 max-w-4xl mx-auto border-b border-stone-200">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">01 / Mengenal Saya</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
              {about.sectionTitle || 'Tentang Saya'}
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              {about.bio}
            </p>
            {about.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                {about.highlights.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm text-xs text-stone-700 leading-relaxed">
                    <p className="font-semibold text-stone-900 mb-1">Highlight #{i + 1}</p>
                    <p>{h}</p>
                  </div>
                ))}
              </div>
            )}
            {about.additionalInfo && (
              <p className="text-xs text-stone-500 italic pt-2">{about.additionalInfo}</p>
            )}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {design.visibleSections.experience && experiences.length > 0 && (
        <section id="experience" className="py-16 px-6 max-w-4xl mx-auto border-b border-stone-200">
          <div className="space-y-8">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">02 / Riwayat Karir</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 flex items-center gap-3">
              <Briefcase size={22} className="text-stone-700" /> Pengalaman Kerja
            </h2>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900">{exp.position}</h3>
                      <p className="text-xs font-medium text-stone-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-stone-600 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="text-xs text-stone-600 flex items-start gap-2">
                          <span className="text-stone-400 font-bold">—</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {design.visibleSections.projects && projects.length > 0 && (
        <section id="projects" className="py-16 px-6 max-w-4xl mx-auto border-b border-stone-200">
          <div className="space-y-8">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">03 / Portofolio Terpilih</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 flex items-center gap-3">
              <FolderGit2 size={22} className="text-stone-700" /> Proyek Unggulan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {proj.thumbnail && (
                    <div className="h-48 w-full overflow-hidden bg-stone-100">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                        {proj.role}
                      </span>
                      <h3 className="text-base font-bold text-stone-900">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-stone-100 text-xs font-semibold">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-stone-900 hover:underline"
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
                          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900"
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

      {/* Skills, Education, Certifications */}
      <section id="skills" className="py-16 px-6 max-w-4xl mx-auto border-b border-stone-200">
        <div className="space-y-12">
          {design.visibleSections.skills && skills.length > 0 && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">04 / Kompetensi</span>
              <h2 className="text-2xl font-serif text-stone-900">Keahlian Profesional</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 text-center space-y-1">
                    <p className="text-xs font-semibold text-stone-900">{s.name}</p>
                    <p className="text-[11px] text-stone-400">{s.category || 'Skill'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {design.visibleSections.education && education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                  <GraduationCap size={18} /> Pendidikan
                </h3>
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                    <h4 className="text-xs font-bold text-stone-900">{edu.institution}</h4>
                    <p className="text-xs text-stone-600">{edu.degree} {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ''}</p>
                    <p className="text-[11px] text-stone-400">{edu.startYear} – {edu.endYear}</p>
                  </div>
                ))}
              </div>
            )}

            {design.visibleSections.certifications && certifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                  <Award size={18} /> Sertifikasi
                </h3>
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl bg-white border border-stone-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{cert.name}</h4>
                      <p className="text-[11px] text-stone-500">{cert.issuer}</p>
                    </div>
                    <span className="text-xs text-stone-500 font-semibold">{cert.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {design.visibleSections.contact && (
        <section id="contact" className="py-20 px-6 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">Hubungi</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
            Mari Memulai Sesuatu yang Hebat
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Silakan hubungi saya untuk konsultasi, kerja sama proyek, atau tawaran pekerjaan.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:border-stone-400 shadow-sm flex items-center gap-2"
              >
                <Mail size={14} />
                <span>{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:border-stone-400 shadow-sm flex items-center gap-2"
              >
                <Phone size={14} />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.location && (
              <div className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-600 text-xs flex items-center gap-2">
                <MapPin size={14} />
                <span>{contact.location}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-600 hover:text-stone-950">
                <Github size={16} />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-600 hover:text-stone-950">
                <Linkedin size={16} />
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-600 hover:text-stone-950">
                <Globe size={16} />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        <p>© {new Date().getFullYear()} {profile.fullName}. Clean & Elegant Portfolio.</p>
      </footer>
    </div>
  );
};
