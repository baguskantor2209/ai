import React from 'react';
import { PortfolioData } from '../portfolioTypes';
import {
  Sparkles,
  ArrowUpRight,
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
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const CreativeBoldView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const pColor = design.primaryColor || '#ec4899'; // Vibrant pink/magenta default
  const aColor = design.accentColor || '#eab308'; // Vibrant yellow/amber default

  const btnClass =
    design.buttonStyle === 'rounded-full'
      ? 'rounded-full'
      : design.buttonStyle === 'rounded-none'
      ? 'rounded-none'
      : 'rounded-2xl';

  return (
    <div
      className="min-h-full bg-[#110e1b] text-gray-100 font-sans selection:bg-pink-500 selection:text-white"
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
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-[#110e1b]/80 border-b border-pink-500/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="#" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-lg text-black font-black text-sm uppercase"
              style={{ backgroundColor: aColor }}
            >
              PORTFOLIO
            </span>
            <span>{profile.fullName}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-bold">
            {design.visibleSections.about && (
              <a href="#about" className="hover:text-pink-400 transition-colors">
                About
              </a>
            )}
            {design.visibleSections.experience && (
              <a href="#experience" className="hover:text-pink-400 transition-colors">
                Work
              </a>
            )}
            {design.visibleSections.projects && (
              <a href="#projects" className="hover:text-pink-400 transition-colors">
                Projects
              </a>
            )}
            {design.visibleSections.skills && (
              <a href="#skills" className="hover:text-pink-400 transition-colors">
                Skills
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                className={`px-4 py-2 font-bold text-black shadow-lg transition-transform hover:scale-105 ${btnClass}`}
                style={{ backgroundColor: pColor }}
              >
                Let's Talk
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 border-b border-white/5 overflow-hidden">
        <div
          className="absolute -top-24 right-10 w-80 h-80 rounded-full blur-[140px] opacity-30 pointer-events-none"
          style={{ backgroundColor: pColor }}
        />
        <div
          className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ backgroundColor: aColor }}
        />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
              <span>Creative • Bold • Distinctive</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
              Hello, I'm <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${pColor}, ${aColor})`,
                }}
              >
                {profile.fullName}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-gray-200">
              {profile.headline}
            </p>

            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              {profile.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              {profile.primaryCtaText && (
                <a
                  href={profile.primaryCtaLink || '#projects'}
                  className={`px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-pink-500/25 transition-all hover:scale-105 flex items-center gap-2 ${btnClass}`}
                  style={{ backgroundColor: aColor }}
                >
                  <span>{profile.primaryCtaText}</span>
                  <ArrowUpRight size={18} />
                </a>
              )}
              {profile.secondaryCtaText && (
                <a
                  href={profile.secondaryCtaLink || '#contact'}
                  className={`px-8 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all ${btnClass}`}
                >
                  {profile.secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {profile.avatarUrl && (
            <div className="relative shrink-0">
              <div
                className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl p-1.5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${pColor}, ${aColor})`,
                }}
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {design.visibleSections.about && (
        <section id="about" className="py-20 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] border-2 border-white/10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {about.sectionTitle || 'About Me'}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {about.bio}
            </p>

            {about.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {about.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-l-4 bg-white/5 text-xs sm:text-sm font-medium text-gray-200"
                    style={{ borderLeftColor: i % 2 === 0 ? pColor : aColor }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            )}
            {about.additionalInfo && (
              <p className="text-xs text-gray-400 italic pt-2">{about.additionalInfo}</p>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {design.visibleSections.projects && projects.length > 0 && (
        <section id="projects" className="py-20 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  Featured Works
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white flex items-center gap-3">
                  <FolderGit2 size={32} style={{ color: pColor }} /> Selected Projects
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="rounded-3xl bg-white/[0.04] border-2 border-white/10 hover:border-pink-500/50 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-2 group shadow-xl"
                >
                  {proj.thumbnail && (
                    <div className="h-52 w-full overflow-hidden relative">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-black/80 text-white border border-white/20">
                        #{idx + 1}
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: aColor }}>
                        {proj.role}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.technologies.map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs font-bold">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-white hover:text-pink-400 transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <Github size={14} />
                          <span>Code</span>
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

      {/* Experience Section */}
      {design.visibleSections.experience && experiences.length > 0 && (
        <section id="experience" className="py-20 px-6 max-w-5xl mx-auto border-b border-white/5">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
              <Briefcase size={28} style={{ color: aColor }} /> Work Experience
            </h2>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-pink-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{exp.position}</h3>
                      <p className="text-sm font-semibold" style={{ color: pColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-300 self-start sm:self-auto">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1.5 pt-2">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-pink-400 font-bold">✦</span>
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

      {/* Skills, Education, Certifications */}
      <section id="skills" className="py-20 px-6 max-w-5xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {design.visibleSections.skills && skills.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Skills & Arsenal</h2>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 text-xs font-bold flex items-center gap-2 text-white"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-pink-400 font-black">{s.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-8">
            {design.visibleSections.education && education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <GraduationCap size={20} style={{ color: aColor }} /> Education
                </h3>
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                    <p className="text-xs text-pink-300 font-semibold">{edu.degree}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{edu.startYear} - {edu.endYear}</p>
                  </div>
                ))}
              </div>
            )}

            {design.visibleSections.certifications && certifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Award size={20} style={{ color: pColor }} /> Certifications
                </h3>
                {certifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-gray-400">{c.issuer}</p>
                    </div>
                    <span className="text-xs font-bold text-yellow-400">{c.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {design.visibleSections.contact && (
        <section id="contact" className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-4xl sm:text-6xl font-black text-white">
            Ready to Build Something Bold?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto">
            Reach out via email, phone, or find me across social networks.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2"
              >
                <Mail size={16} style={{ color: pColor }} />
                <span>{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2"
              >
                <Phone size={16} style={{ color: aColor }} />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact.location && (
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold flex items-center gap-2">
                <MapPin size={16} className="text-pink-400" />
                <span>{contact.location}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-2xl text-white hover:text-pink-400 transition-colors">
                <Github size={18} />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-2xl text-white hover:text-pink-400 transition-colors">
                <Linkedin size={18} />
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-2xl text-white hover:text-pink-400 transition-colors">
                <Globe size={18} />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} {profile.fullName}. Built with Creative Bold Studio.</p>
      </footer>
    </div>
  );
};
