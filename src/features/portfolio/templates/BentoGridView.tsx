import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Globe,
  Terminal,
  Zap,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const BentoGridView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#0d0f17] text-slate-100 font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Bento Outer Container */}
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Floating Header */}
        <header className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0">
              {profile.fullName.charAt(0)}
            </span>
            <div className="truncate">
              <span className="font-bold text-xs sm:text-sm block truncate">{profile.fullName}</span>
              <span className="text-[11px] text-slate-400 font-mono truncate">{contact.location || 'Remote'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">{dict.hero.statusAvailable}</span>
            <a
              href="#contact-bento"
              className="ml-1 sm:ml-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/20"
            >
              {dict.nav.contact}
            </a>
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            )}
          </div>
        </header>

        {/* Mobile Dropdown Drawer for Bento */}
        {isMobile && mobileMenuOpen && (
          <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-3 flex flex-col gap-2 font-mono text-xs">
            {design.visibleSections.about && (
              <a
                href="#about-bento"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200"
              >
                ✦ {dict.nav.about}
              </a>
            )}
            {design.visibleSections.projects && (
              <a
                href="#projects-bento"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200"
              >
                ✦ {dict.nav.projects}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience-bento"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200"
              >
                ✦ {dict.nav.experience}
              </a>
            )}
          </div>
        )}

        {/* ================= BENTO GRID CORE ================= */}
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-4 sm:gap-5`}>
          {/* Card 1: Main Hero & Bio (Span 8) */}
          <div className={`${isMobile ? 'col-span-1' : 'md:col-span-8'} rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/30 border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Sparkles size={13} className="text-purple-400 shrink-0" />
                <span className="truncate">{profile.headline || 'Creative Engineer'}</span>
              </span>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight break-words">
                  Hi, I&apos;m{' '}
                  <TypewriterText
                    text={profile.fullName}
                    speed={38}
                    delay={100}
                    cursorStyle="accent"
                    cursorColor="#a855f7"
                    className="text-purple-400"
                  />
                  .
                </h1>
                {profile.headline && (
                  <p className="text-sm font-mono text-purple-300/80 pt-1">
                    <TypewriterText
                      text={profile.headline}
                      speed={30}
                      delay={240}
                      cursorStyle="underscore"
                      cursorColor="#c084fc"
                    />
                  </p>
                )}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed font-light max-w-xl">
                {profile.summary}
              </p>
            </div>

            <div className="pt-6 sm:pt-8 flex flex-wrap gap-3 relative z-10">
              <a
                href={profile.primaryCtaLink || '#projects-bento'}
                className="group px-4 sm:px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href={profile.secondaryCtaLink || '#contact-bento'}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                {profile.secondaryCtaText || dict.hero.getInTouch}
              </a>
            </div>
          </div>

          {/* Card 2: Avatar Photo Bento Card (Span 4) */}
          <div className={`${isMobile ? 'col-span-1' : 'md:col-span-4'} rounded-3xl bg-slate-900/70 border border-white/10 p-3 hover:border-purple-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between`}>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                  AVATAR
                </div>
              )}
            </div>
            <div className="p-3 text-center">
              <span className="font-mono text-xs text-slate-400">{contact.location || 'Remote'}</span>
            </div>
          </div>

          {/* Card 3: Skills Tech Stack Pills (Span 6) */}
          {design.visibleSections.skills && (
            <ScrollReveal animation="fade-up" className={`${isMobile ? 'col-span-1' : 'md:col-span-6'}`}>
              <div className="h-full rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-6 hover:border-purple-500/40 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Zap size={14} />
                    <span>{dict.skills.title}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{skills.length} competencies</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 font-medium hover:bg-purple-500/10 hover:border-purple-500/30 transition-colors flex items-center gap-1.5 sm:gap-2"
                    >
                      <span className="truncate max-w-[120px]">{skill.name}</span>
                      <span className="text-[10px] font-mono text-purple-400">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Card 4: Quick About Highlights (Span 6) */}
          {design.visibleSections.about && (
            <ScrollReveal animation="fade-up" className={`${isMobile ? 'col-span-1' : 'md:col-span-6'}`}>
              <div id="about-bento" className="h-full rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-6 hover:border-purple-500/40 transition-all space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>{about.sectionTitle || dict.about.title}</span>
                </span>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {about.bio}
                </p>

                {about.highlights && about.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {about.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Card 5: Featured Projects (Full Span 12) */}
          {design.visibleSections.projects && (
            <ScrollReveal animation="fade-up" className={`${isMobile ? 'col-span-1' : 'md:col-span-12'}`}>
              <div id="projects-bento" className="rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-8 hover:border-purple-500/40 transition-all space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 block">
                    {dict.projects.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Featured Creations
                  </h2>
                </div>

                <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-5`}>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3 flex flex-col justify-between hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="space-y-3">
                        {proj.thumbnail && (
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-800">
                            <img
                              src={proj.thumbnail}
                              alt={proj.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-purple-400 uppercase truncate">{proj.role}</div>
                        <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 font-light">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                          >
                            <span>Demo</span>
                            <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <Github size={13} />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Card 6: Work Experiences (Span 8) */}
          {design.visibleSections.experience && (
            <ScrollReveal animation="fade-up" className={`${isMobile ? 'col-span-1' : 'md:col-span-8'}`}>
              <div id="experience-bento" className="h-full rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-8 hover:border-purple-500/40 transition-all space-y-5">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Briefcase size={14} />
                  <span>{dict.experience.title}</span>
                </span>

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-white">{exp.position}</h3>
                        <span className="text-[11px] font-mono text-purple-400">
                          {exp.startDate} - {exp.current ? dict.experience.present : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">{exp.company}</div>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Card 7: Direct Contact Card (Span 4) */}
          {design.visibleSections.contact && (
            <ScrollReveal animation="fade-up" className={`${isMobile ? 'col-span-1' : 'md:col-span-4'}`}>
              <div id="contact-bento" className="h-full rounded-3xl bg-gradient-to-br from-purple-900/60 to-slate-900 border border-purple-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-300 block">
                    {dict.contact.title}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Let&apos;s build something together.
                  </h3>
                  <p className="text-xs text-purple-200/80 font-light leading-relaxed">
                    {dict.contact.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="w-full py-3 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider text-center block hover:bg-slate-200 active:scale-95 transition-all shadow-lg truncate"
                    >
                      {contact.email}
                    </a>
                  )}
                  <div className="flex justify-center gap-3 pt-1 text-slate-300 text-xs">
                    {contact.linkedin && (
                      <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                        LinkedIn
                      </a>
                    )}
                    {contact.github && (
                      <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-white">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Bento Footer */}
        <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-slate-500 gap-2">
          <span>© {new Date().getFullYear()} {profile.fullName}</span>
          <span>BENTO GRID ARCHITECTURE</span>
        </footer>
      </div>
    </div>
  );
};
