import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  Star,
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

export const CreativeBrutalistView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#fef08a] text-black font-sans antialiased selection:bg-black selection:text-[#fef08a] overflow-x-hidden">
      {/* Top Ticker Marquee */}
      <div className="bg-black text-white py-2 overflow-hidden border-b-2 border-black text-xs font-mono font-bold uppercase tracking-widest select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>★ {profile.fullName}</span>
          <span>⚡ {profile.headline}</span>
          <span>● {dict.hero.statusAvailable}</span>
          <span>★ {contact.location || 'WORLDWIDE'}</span>
          <span>★ {profile.fullName}</span>
          <span>⚡ {profile.headline}</span>
          <span>● {dict.hero.statusAvailable}</span>
          <span>★ {contact.location || 'WORLDWIDE'}</span>
        </div>
      </div>

      {/* Main Brutalist Header */}
      <header className="sticky top-0 z-40 bg-[#fde047] border-b-3 border-black px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#"
            className="text-base sm:text-xl font-black uppercase tracking-tight bg-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all truncate max-w-[200px] sm:max-w-none"
          >
            {profile.fullName} ⚡
          </a>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs font-bold uppercase">
              {design.visibleSections.about && (
                <a
                  href="#about"
                  className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#fed7aa] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {dict.nav.about}
                </a>
              )}
              {design.visibleSections.experience && (
                <a
                  href="#experience"
                  className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#fed7aa] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {dict.nav.experience}
                </a>
              )}
              {design.visibleSections.projects && (
                <a
                  href="#projects"
                  className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#fed7aa] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {dict.nav.projects}
                </a>
              )}
              {design.visibleSections.skills && (
                <a
                  href="#skills"
                  className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#fed7aa] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {dict.nav.skills}
                </a>
              )}
              {design.visibleSections.contact && (
                <a
                  href="#contact"
                  className="px-4 py-1.5 bg-black text-white border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-neutral-800 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {dict.nav.contact}
                </a>
              )}
            </nav>
          )}

          {/* Mobile Brutalist Menu Toggle */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="px-3 py-1.5 bg-black text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
              <span>{mobileMenuOpen ? 'CLOSE' : 'MENU ⚡'}</span>
            </button>
          )}
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t-2 border-black flex flex-col gap-2 font-mono text-xs font-black uppercase bg-[#fde047] pb-2">
            {design.visibleSections.about && (
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center"
              >
                ★ {dict.nav.about}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center"
              >
                💼 {dict.nav.experience}
              </a>
            )}
            {design.visibleSections.projects && (
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center"
              >
                ⚡ {dict.nav.projects}
              </a>
            )}
            {design.visibleSections.skills && (
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center"
              >
                🛠️ {dict.nav.skills}
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#000] text-center"
              >
                ✉️ {dict.nav.contact}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero Section: Neo-Brutalist Layout */}
      <section className="px-4 sm:px-6 py-10 md:py-20 border-b-3 border-black bg-[#fef08a]">
        <div className={`max-w-6xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-8 items-center`}>
          <div className={`${isMobile ? 'w-full' : 'lg:col-span-7'} space-y-5 sm:space-y-6`}>
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] font-mono text-xs font-black uppercase">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
              <span>{dict.hero.statusAvailable}</span>
            </div>

            {/* Typewriter Name & Headline */}
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase font-black tracking-wider text-black/70">
                <span>[CREATOR] // </span>
                <TypewriterText
                  text={profile.fullName}
                  speed={35}
                  delay={100}
                  cursorStyle="block"
                  cursorColor="#000"
                  className="text-black"
                />
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.98] text-black break-words">
                {profile.headline ? (
                  <TypewriterText
                    text={profile.headline}
                    speed={30}
                    delay={240}
                    cursorStyle="block"
                    cursorColor="#000"
                    className="text-black"
                  />
                ) : (
                  profile.fullName
                )}
              </h1>
            </div>

            {/* Summary Box */}
            <div className="bg-white p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[5px_5px_0px_#000]">
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Brutalist CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <a
                href={profile.primaryCtaLink || '#projects'}
                className="group px-5 sm:px-6 py-3.5 sm:py-4 bg-black text-white font-black uppercase tracking-wider text-xs sm:text-sm border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[5px_5px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all flex items-center gap-2"
              >
                <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href={profile.secondaryCtaLink || '#contact'}
                className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[5px_5px_0px_#000] hover:bg-neutral-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all"
              >
                <span>{profile.secondaryCtaText || dict.hero.getInTouch}</span>
              </a>
            </div>
          </div>

          {/* Brutalist Avatar Card with rotated stamp */}
          {profile.avatarUrl && (
            <div className={`${isMobile ? 'w-full' : 'lg:col-span-5'} flex justify-center`}>
              <div className="relative w-full max-w-xs sm:max-w-sm">
                {/* Decorative sticker stamp */}
                <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 z-20 bg-[#f43f5e] text-white font-mono text-[10px] sm:text-xs font-black px-3 py-1 border-2 border-black rotate-6 shadow-[3px_3px_0px_#000] select-none">
                  VERIFIED PRO
                </div>
                <div className="bg-white border-4 border-black p-3 shadow-[6px_6px_0px_#000] sm:shadow-[8px_8px_0px_#000]">
                  <div className="aspect-[4/5] bg-neutral-200 border-2 border-black overflow-hidden">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-125 transition-all duration-500"
                    />
                  </div>
                  <div className="mt-3 bg-[#e0e7ff] p-2 border-2 border-black text-center font-black uppercase text-xs truncate">
                    {profile.fullName} — {contact.location || 'REMOTE'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {design.visibleSections.about && (
        <ScrollReveal animation="fade-up">
          <section id="about" className="border-b-3 border-black px-4 sm:px-6 py-12 sm:py-16 bg-[#e0f2fe]">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-block bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000]">
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                  ★ {about.sectionTitle || dict.about.title}
                </h2>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-6 sm:gap-8`}>
                <div className={`${isMobile ? 'w-full' : 'lg:col-span-7'} bg-white p-5 sm:p-6 border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000] text-sm sm:text-base leading-relaxed font-medium`}>
                  <p>{about.bio}</p>
                  {about.additionalInfo && (
                    <p className="mt-4 pt-4 border-t-2 border-black/20 text-black/80 text-xs sm:text-sm">
                      {about.additionalInfo}
                    </p>
                  )}
                </div>

                {about.highlights && about.highlights.length > 0 && (
                  <div className={`${isMobile ? 'w-full' : 'lg:col-span-5'} space-y-3`}>
                    <span className="font-mono text-xs font-black uppercase tracking-wider block bg-black text-white px-3 py-1 w-max">
                      {dict.about.keyHighlights}
                    </span>
                    {about.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] font-mono text-xs font-bold flex items-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                      >
                        <Zap size={14} className="text-amber-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Projects Section */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="border-b-3 border-black px-4 sm:px-6 py-12 sm:py-16 bg-[#fed7aa]">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-4">
                <div className="inline-block bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000]">
                  <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                    ⚡ {dict.projects.title}
                  </h2>
                </div>
                <span className="font-mono text-xs font-bold uppercase bg-black text-white px-3 py-1 self-start sm:self-auto">
                  {dict.projects.subtitle}
                </span>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6 sm:gap-8`}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] sm:shadow-[8px_8px_0px_#000] p-5 flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {proj.thumbnail && (
                        <div className="aspect-video bg-neutral-100 border-2 border-black overflow-hidden">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-cover contrast-110 hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center font-mono text-xs font-black">
                        <span className="bg-[#fde047] px-2 py-0.5 border border-black truncate max-w-[180px]">{proj.role}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black uppercase">{proj.title}</h3>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/80">
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-100 border border-black font-mono text-[10px] font-black uppercase px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-black flex gap-3">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 text-center bg-black text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-neutral-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          {dict.projects.liveDemo} ↗
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-white text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          <Github size={14} />
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

      {/* Experience Section */}
      {design.visibleSections.experience && (
        <ScrollReveal animation="fade-up">
          <section id="experience" className="border-b-3 border-black px-4 sm:px-6 py-12 sm:py-16 bg-[#e9d5ff]">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-block bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000]">
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                  💼 {dict.experience.title}
                </h2>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000] space-y-3 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black uppercase">{exp.position}</h3>
                      <span className="font-mono text-xs font-black bg-[#fef08a] px-2 py-1 border-2 border-black">
                        {exp.startDate} - {exp.current ? dict.experience.present : exp.endDate}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-black/70 uppercase">
                      🏢 {exp.company}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-black/90 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.achievements && (
                      <ul className="space-y-1 font-mono text-xs text-black/80 list-disc list-inside pt-1">
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

      {/* Skills Section */}
      {design.visibleSections.skills && (
        <ScrollReveal animation="fade-up">
          <section id="skills" className="border-b-3 border-black px-4 sm:px-6 py-12 sm:py-16 bg-[#fbcfe8]">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-block bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000]">
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                  🛠️ {dict.skills.title}
                </h2>
              </div>

              <div className={`grid grid-cols-2 ${isMobile ? '' : 'sm:grid-cols-3 md:grid-cols-4'} gap-3 sm:gap-4`}>
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-3 border-black p-3.5 sm:p-4 shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] font-mono hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                  >
                    <span className="text-[10px] font-black uppercase text-black/50 block truncate">
                      {skill.category}
                    </span>
                    <span className="text-xs sm:text-sm font-black uppercase block truncate mt-1">
                      {skill.name}
                    </span>
                    <div className="mt-3 h-2.5 sm:h-3 bg-neutral-200 border border-black overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Contact Section */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="px-4 sm:px-6 py-14 md:py-24 bg-black text-white">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
              <div className="bg-[#fef08a] text-black inline-block px-4 sm:px-5 py-2.5 sm:py-3 border-4 border-white shadow-[4px_4px_0px_#fff] sm:shadow-[6px_6px_0px_#fff]">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                  ✉️ {dict.contact.title}
                </h2>
              </div>

              <p className="text-neutral-300 font-mono text-xs sm:text-sm max-w-xl">
                {dict.contact.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 font-mono text-xs">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-black font-black uppercase border-3 border-white hover:bg-[#fef08a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 shadow-[3px_3px_0px_#fff] sm:shadow-[4px_4px_0px_#fff] truncate"
                  >
                    <Mail size={16} className="shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-black font-black uppercase border-3 border-white hover:bg-[#fef08a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 shadow-[3px_3px_0px_#fff] sm:shadow-[4px_4px_0px_#fff]"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-black font-black uppercase border-3 border-white hover:bg-[#fef08a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 shadow-[3px_3px_0px_#fff] sm:shadow-[4px_4px_0px_#fff]"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono text-neutral-400">
                <span>© {new Date().getFullYear()} {profile.fullName}</span>
                <span>BRUTALIST EDITION</span>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
