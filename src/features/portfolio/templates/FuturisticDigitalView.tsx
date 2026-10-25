import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  Terminal,
  Cpu,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const FuturisticDigitalView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#07090e] text-[#e2e8f0] font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Cybernetic Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Futuristic HUD Top Header */}
      <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3 sm:py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm animate-pulse shadow-[0_0_10px_#06b6d4] shrink-0" />
            <span className="font-mono font-bold text-xs sm:text-sm tracking-widest text-cyan-400 uppercase truncate">
              {profile.fullName}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              STATUS: ONLINE
            </span>
          </div>

          {/* Desktop HUD Nav */}
          {!isMobile && (
            <nav className="flex items-center gap-5 sm:gap-6 font-mono text-xs uppercase tracking-wider text-slate-400">
              {design.visibleSections.about && (
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  // {dict.nav.about}
                </a>
              )}
              {design.visibleSections.experience && (
                <a href="#experience" className="hover:text-cyan-400 transition-colors">
                  // {dict.nav.experience}
                </a>
              )}
              {design.visibleSections.projects && (
                <a href="#projects" className="hover:text-cyan-400 transition-colors">
                  // {dict.nav.projects}
                </a>
              )}
              {design.visibleSections.skills && (
                <a href="#skills" className="hover:text-cyan-400 transition-colors">
                  // {dict.nav.skills}
                </a>
              )}
              {design.visibleSections.contact && (
                <a
                  href="#contact"
                  className="px-3.5 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                >
                  &lt;{dict.nav.contact}/&gt;
                </a>
              )}
            </nav>
          )}

          {/* Mobile HUD Toggle Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle HUD navigation"
              className="px-2.5 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5 hover:bg-cyan-900/50 active:scale-95 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
              <span className="text-[11px] font-bold">{mobileMenuOpen ? 'CLOSE' : 'HUD // NAV'}</span>
            </button>
          )}
        </div>

        {/* Mobile HUD Drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-cyan-500/20 flex flex-col gap-2 font-mono text-xs uppercase bg-[#07090e] pb-2">
            {design.visibleSections.about && (
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 transition-all"
              >
                // 01_{dict.nav.about}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 transition-all"
              >
                // 02_{dict.nav.experience}
              </a>
            )}
            {design.visibleSections.projects && (
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 transition-all"
              >
                // 03_{dict.nav.projects}
              </a>
            )}
            {design.visibleSections.skills && (
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 transition-all"
              >
                // 04_{dict.nav.skills}
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-cyan-500/20 border border-cyan-500 text-cyan-200 text-center font-bold mt-1"
              >
                &lt;{dict.nav.contact}/&gt;
              </a>
            )}
          </div>
        )}
      </header>

      {/* Cyber Hero Section */}
      <section className="relative px-4 sm:px-6 py-12 md:py-24 border-b border-cyan-500/15 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`max-w-6xl mx-auto relative z-10 grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-8 md:gap-10 items-center`}>
          <div className={`${isMobile ? 'w-full' : 'lg:col-span-8'} space-y-5 sm:space-y-6`}>
            {/* Stagger item 1: HUD Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              <Radio size={14} className="text-cyan-400 animate-pulse" />
              <span>{dict.hero.statusAvailable}</span>
            </div>

            {/* Stagger item 2 & 3: Typewriter Name & Cyber Headline */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400/90 flex items-center gap-1.5">
                <span className="text-cyan-500">&gt; HOST // </span>
                <TypewriterText
                  text={profile.fullName}
                  speed={38}
                  delay={100}
                  cursorStyle="glow"
                  cursorColor="#06b6d4"
                  className="font-bold text-cyan-300"
                />
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight break-words">
                {profile.headline ? (
                  <TypewriterText
                    text={profile.headline}
                    speed={30}
                    delay={240}
                    cursorStyle="underscore"
                    cursorColor="#22d3ee"
                    className="text-white"
                  />
                ) : (
                  profile.fullName
                )}
              </h1>
            </div>

            {/* Stagger item 4: Summary */}
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl font-light border-l-2 border-cyan-500/50 pl-4 bg-cyan-950/10 py-1.5">
              {profile.summary}
            </p>

            {/* Stagger item 5: CTAs with cyber glow */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <a
                href={profile.primaryCtaLink || '#projects'}
                className="group px-5 sm:px-6 py-3 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href={profile.secondaryCtaLink || '#contact'}
                className="px-5 sm:px-6 py-3 rounded border border-cyan-500/40 bg-slate-900/60 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all"
              >
                <span>{profile.secondaryCtaText || dict.hero.getInTouch}</span>
              </a>
            </div>
          </div>

          {/* Hologram Avatar HUD Card */}
          {profile.avatarUrl && (
            <div className={`${isMobile ? 'w-full' : 'lg:col-span-4'} flex justify-center`}>
              <div className="relative w-full max-w-xs p-1 rounded-xl bg-gradient-to-b from-cyan-500/30 via-slate-800/40 to-purple-500/30 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-shadow">
                <div className="rounded-lg overflow-hidden bg-slate-950/90 p-3 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>NODE: 01-PRO</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      18ms
                    </span>
                  </div>
                  <div className="aspect-[4/5] rounded overflow-hidden relative group">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color pointer-events-none" />
                  </div>
                  <div className="pt-2 border-t border-cyan-500/20 font-mono text-xs text-center text-slate-300 truncate">
                    {profile.fullName} • {contact.location || 'GLOBAL'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cyber Projects Section */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="px-4 sm:px-6 py-12 md:py-20 border-b border-cyan-500/15">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b border-cyan-500/20 pb-4">
                <div>
                  <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block">
                    // MODULE: DEPLOYED_PROJECTS
                  </span>
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                    {dict.projects.title}
                  </h2>
                </div>
                <p className="font-mono text-xs text-slate-400">
                  {dict.projects.subtitle}
                </p>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-lg bg-slate-900/40 border border-cyan-500/20 p-5 flex flex-col justify-between hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      {proj.thumbnail && (
                        <div className="aspect-video rounded overflow-hidden bg-slate-950 border border-cyan-500/15">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                        <span className="truncate max-w-[180px]">ROLE // {proj.role}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/btn text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span>{dict.projects.liveDemo}</span>
                          <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
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
          </section>
        </ScrollReveal>
      )}

      {/* Cyber Experience */}
      {design.visibleSections.experience && (
        <ScrollReveal animation="fade-up">
          <section id="experience" className="px-4 sm:px-6 py-12 md:py-20 border-b border-cyan-500/15">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
              <div className="border-b border-cyan-500/20 pb-4">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block">
                  // TIMELINE: CAREER_METRICS
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                  {dict.experience.title}
                </h2>
              </div>

              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-lg bg-slate-900/30 border border-cyan-500/20 p-5 sm:p-6 space-y-3 relative hover:border-cyan-400/50 hover:bg-slate-900/50 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Cpu size={16} className="text-cyan-400 shrink-0" />
                        <span>{exp.position}</span>
                      </h3>
                      <span className="font-mono text-xs text-cyan-300 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                        {exp.startDate} - {exp.current ? dict.experience.present : exp.endDate}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-400">
                      CORP: <span className="text-cyan-400 font-semibold">{exp.company}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                      {exp.description}
                    </p>
                    {exp.achievements && (
                      <ul className="space-y-1 font-mono text-xs text-slate-400 pt-1 list-disc list-inside">
                        {exp.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Cyber Skills Grid */}
      {design.visibleSections.skills && (
        <ScrollReveal animation="fade-up">
          <section id="skills" className="px-4 sm:px-6 py-12 md:py-20 border-b border-cyan-500/15">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              <div className="border-b border-cyan-500/20 pb-4">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block">
                  // SYSTEM_CAPABILITIES
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                  {dict.skills.title}
                </h2>
              </div>

              <div className={`grid grid-cols-2 ${isMobile ? '' : 'sm:grid-cols-3 md:grid-cols-4'} gap-3 sm:gap-4`}>
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-slate-900/40 border border-cyan-500/20 p-3.5 sm:p-4 font-mono text-xs space-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
                  >
                    <div className="text-[10px] text-slate-400 uppercase truncate">{skill.category}</div>
                    <div className="text-white font-bold truncate">{skill.name}</div>
                    <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#06b6d4] transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] text-cyan-400">{skill.level}%</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Cyber Contact & Terminal Footer */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="px-4 sm:px-6 py-14 md:py-24 bg-[#05060a] border-t border-cyan-500/20">
            <div className={`max-w-6xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-8 md:gap-10`}>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-6'} space-y-5 sm:space-y-6`}>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block">
                  // TRANSMISSION_CHANNEL
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {dict.contact.title}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  {dict.contact.subtitle}
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-cyan-400 shrink-0" />
                      <a href={`mailto:${contact.email}`} className="text-cyan-300 hover:underline truncate">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={15} className="text-cyan-400 shrink-0" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${isMobile ? 'w-full' : 'md:col-span-6'} flex flex-col justify-between space-y-6 sm:space-y-8`}>
                <div className="p-4 sm:p-5 rounded-lg bg-slate-900/50 border border-cyan-500/30 font-mono text-xs space-y-3">
                  <div className="text-cyan-400 flex items-center gap-2">
                    <Terminal size={14} />
                    <span>terminal@portfolio:~$ ping contact</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Ready to deploy high-impact software, scalable architectures, and next-generation web products.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {contact.linkedin && (
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                      >
                        LinkedIn
                      </a>
                    )}
                    {contact.github && (
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span>SYSTEM VERSION 2.4.0</span>
                  <span>© {new Date().getFullYear()} {profile.fullName}</span>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
