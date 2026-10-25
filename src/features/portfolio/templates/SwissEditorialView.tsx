import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  Award,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const SwissEditorialView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#fbfbfb] text-[#121316] font-sans antialiased selection:bg-black selection:text-white">
      {/* Editorial Header Bar */}
      <header className="border-b border-black/10 sticky top-0 z-40 bg-[#fbfbfb]/95 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-3 h-3 bg-black inline-block shrink-0" />
            <span className="font-extrabold tracking-tighter text-sm sm:text-base uppercase truncate">
              {profile.fullName}
            </span>
            <span className="hidden md:inline text-xs font-mono text-black/50 pl-2 border-l border-black/20 truncate">
              {profile.headline}
            </span>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-black/70">
              {design.visibleSections.about && (
                <a href="#about" className="hover:text-black hover:underline transition-all">
                  01 / {dict.nav.about}
                </a>
              )}
              {design.visibleSections.experience && (
                <a href="#experience" className="hover:text-black hover:underline transition-all">
                  02 / {dict.nav.experience}
                </a>
              )}
              {design.visibleSections.projects && (
                <a href="#projects" className="hover:text-black hover:underline transition-all">
                  03 / {dict.nav.projects}
                </a>
              )}
              {design.visibleSections.skills && (
                <a href="#skills" className="hover:text-black hover:underline transition-all">
                  04 / {dict.nav.skills}
                </a>
              )}
              {design.visibleSections.contact && (
                <a
                  href="#contact"
                  className="px-3.5 py-1.5 bg-black text-white font-bold hover:bg-neutral-800 active:scale-95 transition-all uppercase"
                >
                  {dict.nav.contact}
                </a>
              )}
            </nav>
          )}

          {/* Mobile Navigation Toggle Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 font-mono text-xs font-bold"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="text-[11px]">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          )}
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-black/10 flex flex-col gap-2 font-mono text-xs uppercase bg-[#fbfbfb] pb-2 animate-fadeIn">
            {design.visibleSections.about && (
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 hover:bg-black/5 border-l-2 border-transparent hover:border-black font-semibold transition-all"
              >
                01 / {dict.nav.about}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 hover:bg-black/5 border-l-2 border-transparent hover:border-black font-semibold transition-all"
              >
                02 / {dict.nav.experience}
              </a>
            )}
            {design.visibleSections.projects && (
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 hover:bg-black/5 border-l-2 border-transparent hover:border-black font-semibold transition-all"
              >
                03 / {dict.nav.projects}
              </a>
            )}
            {design.visibleSections.skills && (
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 hover:bg-black/5 border-l-2 border-transparent hover:border-black font-semibold transition-all"
              >
                04 / {dict.nav.skills}
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 bg-black text-white font-bold text-center mt-1"
              >
                {dict.nav.contact}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero Section: Precision Swiss Typography */}
      <section className="border-b border-black/10 px-4 sm:px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'} gap-8 md:gap-12 items-start justify-between`}>
            <div className="flex-1 space-y-5">
              {/* Stagger item 1: status */}
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-black/60 bg-black/5 px-2.5 py-1 border border-black/10">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
                {dict.hero.statusAvailable}
              </div>

              {/* Stagger item 2 & 3: Typewriter Name & Headline */}
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-widest text-black/50">
                  <TypewriterText
                    text={profile.fullName}
                    speed={38}
                    delay={100}
                    cursorStyle="pipe"
                    cursorColor="#000000"
                    className="font-bold text-black"
                  />
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] uppercase break-words">
                  {profile.headline ? (
                    <TypewriterText
                      text={profile.headline}
                      speed={32}
                      delay={260}
                      cursorStyle="pipe"
                      cursorColor="#2563eb"
                      className="text-[#121316]"
                    />
                  ) : (
                    profile.fullName
                  )}
                </h1>
              </div>

              {/* Stagger item 4: Summary */}
              <p className="text-sm sm:text-base lg:text-lg text-black/75 max-w-2xl font-normal leading-relaxed border-l-2 border-black pl-4">
                {profile.summary}
              </p>

              {/* Stagger item 5: CTA Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={profile.primaryCtaLink || '#projects'}
                  className="group px-5 sm:px-6 py-3 sm:py-3.5 bg-black text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href={profile.secondaryCtaLink || '#contact'}
                  className="px-5 sm:px-6 py-3 sm:py-3.5 border border-black text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-black hover:text-white active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>{profile.secondaryCtaText || dict.hero.getInTouch}</span>
                </a>
              </div>
            </div>

            {/* Profile Avatar Frame with Swiss geometry */}
            {profile.avatarUrl && (
              <div className={`w-full ${isMobile ? 'max-w-xs mx-auto' : 'sm:w-72 lg:w-80'} shrink-0`}>
                <div className="relative border-2 border-black p-2 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="mt-2 pt-2 border-t border-black/10 flex justify-between items-center text-[11px] font-mono uppercase text-black/70">
                    <span className="truncate">{profile.fullName}</span>
                    <span className="shrink-0">{contact.location || 'GLOBAL'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 01: About */}
      {design.visibleSections.about && (
        <ScrollReveal animation="fade-up">
          <section id="about" className="border-b border-black/10 px-4 sm:px-6 py-14 md:py-20">
            <div className={`max-w-6xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-8 md:gap-10`}>
              <div className={isMobile ? 'w-full' : 'md:col-span-4'}>
                <span className="font-mono text-xs font-bold text-black/50 tracking-widest block uppercase">
                  01 / {dict.about.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase mt-1 tracking-tight">
                  {about.sectionTitle || dict.about.title}
                </h2>
              </div>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-8'} space-y-6 text-black/80 text-sm sm:text-base leading-relaxed`}>
                <p className="font-medium text-black">{about.bio}</p>
                {about.highlights && about.highlights.length > 0 && (
                  <div className="border-t border-black/10 pt-6 mt-6">
                    <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-4 text-black">
                      {dict.about.keyHighlights}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {about.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 font-mono text-xs bg-white p-3 border border-black/10 hover:border-black transition-colors"
                        >
                          <span className="font-bold text-black select-none">[{i + 1}]</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Section 02: Experience */}
      {design.visibleSections.experience && (
        <ScrollReveal animation="fade-up">
          <section id="experience" className="border-b border-black/10 px-4 sm:px-6 py-14 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-black/50 tracking-widest block uppercase">
                    02 / {dict.experience.title}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    {dict.experience.title}
                  </h2>
                </div>
                <p className="font-mono text-xs text-black/60 uppercase">
                  {dict.experience.subtitle}
                </p>
              </div>

              <div className="divide-y divide-black/10">
                {experiences.map((exp) => (
                  <div key={exp.id} className={`py-6 sm:py-8 grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-4 md:gap-6 items-start`}>
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-3'} font-mono text-xs uppercase text-black/60`}>
                      <span className="font-bold text-black">
                        {exp.startDate} — {exp.current ? dict.experience.present : exp.endDate}
                      </span>
                    </div>
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-9'} space-y-3`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-black">
                          {exp.position}
                        </h3>
                        <span className="font-mono text-xs uppercase px-2 py-0.5 border border-black text-black font-semibold">
                          {exp.company}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-black/80 leading-relaxed">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-1.5 pt-2 font-mono text-xs text-black/70 list-disc list-inside">
                          {exp.achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Section 03: Projects */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="border-b border-black/10 px-4 sm:px-6 py-14 md:py-20 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-black/50 tracking-widest block uppercase">
                    03 / {dict.projects.title}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    {dict.projects.title}
                  </h2>
                </div>
                <p className="font-mono text-xs text-black/60 uppercase">
                  {dict.projects.subtitle}
                </p>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6 md:gap-8`}>
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="border border-black p-5 bg-[#fbfbfb] flex flex-col justify-between group hover:border-black/70 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {proj.thumbnail && (
                        <div className="aspect-video bg-neutral-200 overflow-hidden border border-black/10">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between font-mono text-xs text-black/60">
                        <span>PROJECT [0{idx + 1}]</span>
                        <span className="truncate max-w-[150px]">{proj.role}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-black">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-black/75 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.technologies.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="font-mono text-[10px] uppercase px-2 py-0.5 bg-black/5 text-black border border-black/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between gap-4">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1 hover:underline"
                        >
                          <span>{dict.projects.liveDemo}</span>
                          <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs uppercase text-black/70 hover:text-black flex items-center gap-1"
                        >
                          <Github size={13} />
                          <span>{dict.projects.sourceCode}</span>
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

      {/* Section 04: Skills */}
      {design.visibleSections.skills && (
        <ScrollReveal animation="fade-up">
          <section id="skills" className="border-b border-black/10 px-4 sm:px-6 py-14 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 md:mb-10">
                <span className="font-mono text-xs font-bold text-black/50 tracking-widest block uppercase">
                  04 / {dict.skills.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  {dict.skills.title}
                </h2>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-3 md:grid-cols-4'} gap-3 sm:gap-4`}>
                {skills.map((skill, idx) => (
                  <div key={idx} className="border border-black/10 bg-white p-3.5 sm:p-4 font-mono hover:border-black/50 transition-colors">
                    <div className="text-[10px] uppercase text-black/50 mb-1 truncate">{skill.category}</div>
                    <div className="font-bold text-xs sm:text-sm text-black uppercase truncate">{skill.name}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-black/10">
                        <div className="h-full bg-black transition-all duration-700" style={{ width: `${skill.level}%` }} />
                      </div>
                      <span className="text-[10px] font-bold">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Section 05: Contact */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="px-4 sm:px-6 py-14 md:py-24 bg-black text-white">
            <div className={`max-w-6xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-8 md:gap-12`}>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-6'} space-y-5`}>
                <span className="font-mono text-xs font-bold text-neutral-400 tracking-widest block uppercase">
                  05 / {dict.contact.title}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                  {dict.contact.title}
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light leading-relaxed">
                  {dict.contact.subtitle}
                </p>

                <div className="space-y-3 font-mono text-xs pt-2">
                  {contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-neutral-400 shrink-0" />
                      <a href={`mailto:${contact.email}`} className="hover:underline text-white font-bold truncate">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-neutral-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-neutral-400 shrink-0" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${isMobile ? 'w-full' : 'md:col-span-6'} flex flex-col justify-between border-t ${isMobile ? 'border-neutral-800 pt-6' : 'md:border-t-0 md:border-l border-neutral-800 md:pl-12'}`}>
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block">
                    {dict.contact.socials}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {contact.linkedin && (
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 border border-neutral-700 hover:border-white font-mono text-xs uppercase transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {contact.github && (
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 border border-neutral-700 hover:border-white font-mono text-xs uppercase transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {contact.website && (
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 border border-neutral-700 hover:border-white font-mono text-xs uppercase transition-colors"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-8 sm:pt-12 text-[11px] font-mono text-neutral-500 uppercase flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span>© {new Date().getFullYear()} {profile.fullName}</span>
                  <span>{dict.footer.rightsReserved}</span>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
