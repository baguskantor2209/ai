import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  Camera,
  Layers,
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

export const ImmersiveCreativeView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#0a0a0c] text-white font-sans antialiased selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden">
      {/* Sticky Atmospheric Nav */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="font-extrabold tracking-tight text-base sm:text-lg flex items-center gap-2 truncate max-w-[200px] sm:max-w-none">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
            <span className="text-white hover:text-pink-400 transition-colors uppercase text-xs sm:text-sm tracking-widest font-mono truncate">
              {profile.fullName}
            </span>
          </a>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-neutral-400">
              {design.visibleSections.projects && (
                <a href="#projects" className="hover:text-white transition-colors">
                  {dict.nav.projects}
                </a>
              )}
              {design.visibleSections.about && (
                <a href="#about" className="hover:text-white transition-colors">
                  {dict.nav.about}
                </a>
              )}
              {design.visibleSections.experience && (
                <a href="#experience" className="hover:text-white transition-colors">
                  {dict.nav.experience}
                </a>
              )}
              {design.visibleSections.contact && (
                <a
                  href="#contact"
                  className="px-4 py-1.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 active:scale-95 transition-all"
                >
                  {dict.nav.contact}
                </a>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
              <span className="text-[11px] font-bold">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          )}
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 font-mono text-xs uppercase bg-[#0a0a0c] pb-2">
            {design.visibleSections.projects && (
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-neutral-200 hover:text-white"
              >
                ✦ {dict.nav.projects}
              </a>
            )}
            {design.visibleSections.about && (
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-neutral-200 hover:text-white"
              >
                ✦ {dict.nav.about}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-neutral-200 hover:text-white"
              >
                ✦ {dict.nav.experience}
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-pink-600 text-white text-center font-bold mt-1"
              >
                {dict.nav.contact}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Dominant Full-Bleed Immersive Hero */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex flex-col justify-end px-4 sm:px-6 pb-12 sm:pb-20 pt-20 sm:pt-32 overflow-hidden border-b border-white/10">
        {/* Full-bleed background imagery / gradient */}
        <div className="absolute inset-0 z-0">
          {profile.avatarUrl ? (
            <div className="w-full h-full relative">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/85 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-950/20 via-[#0a0a0c] to-purple-950/20" />
          )}
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-neutral-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>{dict.hero.statusAvailable}</span>
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-widest text-pink-400">
              <TypewriterText
                text={profile.fullName}
                speed={36}
                delay={100}
                cursorStyle="glow"
                cursorColor="#ec4899"
                className="font-bold text-pink-300"
              />
            </div>
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[0.98] break-words">
              {profile.headline ? (
                <TypewriterText
                  text={profile.headline}
                  speed={28}
                  delay={240}
                  cursorStyle="pipe"
                  cursorColor="#ffffff"
                  className="text-white"
                />
              ) : (
                profile.fullName
              )}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed">
              {profile.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              href={profile.primaryCtaLink || '#projects'}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
              <ArrowDown size={15} />
            </a>
            <a
              href={profile.secondaryCtaLink || '#contact'}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all"
            >
              <span>{profile.secondaryCtaText || dict.hero.getInTouch}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Visual Projects */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="py-14 sm:py-20 px-4 sm:px-6 border-b border-white/10">
            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-4">
                <div>
                  <span className="text-pink-400 font-mono text-xs uppercase tracking-widest block">
                    SELECTED WORKS
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mt-1">
                    {dict.projects.title}
                  </h2>
                </div>
                <p className="text-neutral-400 font-mono text-xs">
                  {dict.projects.subtitle}
                </p>
              </div>

              <div className="space-y-8 sm:space-y-12">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40 hover:border-pink-500/50 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-6 sm:gap-8 items-center p-5 sm:p-8 lg:p-10`}>
                      <div className={`${isMobile ? 'w-full' : 'lg:col-span-7'} aspect-[16/10] rounded-xl overflow-hidden bg-neutral-800 border border-white/10`}>
                        {proj.thumbnail ? (
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                            NO PREVIEW IMAGE
                          </div>
                        )}
                      </div>

                      <div className={`${isMobile ? 'w-full' : 'lg:col-span-5'} space-y-4 sm:space-y-5`}>
                        <div className="flex items-center gap-3 font-mono text-xs text-neutral-400">
                          <span className="text-pink-400 font-bold">0{idx + 1}</span>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{proj.role}</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-pink-300 transition-colors">
                          {proj.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                          {proj.description}
                        </p>

                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                            {proj.technologies.map((t, tidx) => (
                              <span
                                key={tidx}
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 flex items-center gap-3 sm:gap-4">
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="group/link px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                              <span>{dict.projects.liveDemo}</span>
                              <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 sm:p-2.5 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white active:scale-95 transition-all"
                            >
                              <Github size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* About & Philosophy */}
      {design.visibleSections.about && (
        <ScrollReveal animation="fade-up">
          <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 border-b border-white/10">
            <div className={`max-w-5xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-8 md:gap-12 items-center`}>
              <div className={`${isMobile ? 'w-full max-w-xs mx-auto' : 'md:col-span-5'} aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 shadow-2xl`}>
                {profile.avatarUrl && (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-5 sm:space-y-6`}>
                <span className="text-pink-400 font-mono text-xs uppercase tracking-widest block">
                  ABOUT THE CREATIVE
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
                  {about.sectionTitle || dict.about.title}
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                  {about.bio}
                </p>
                {about.highlights && (
                  <div className="space-y-2 pt-2">
                    {about.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-200 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
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

      {/* Contact Section */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0e0e12] border-t border-white/10">
            <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
              <span className="text-pink-400 font-mono text-xs uppercase tracking-widest block">
                LET&apos;S CREATE SOMETHING REMARKABLE
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
                {dict.contact.title}
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base max-w-xl mx-auto font-light">
                {dict.contact.subtitle}
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap justify-center gap-3 sm:gap-4 font-mono text-xs">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-bold transition-all shadow-lg shadow-pink-600/30 truncate max-w-full"
                  >
                    {contact.email}
                  </a>
                )}
              </div>

              <div className="pt-10 sm:pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-neutral-500 gap-3">
                <span>© {new Date().getFullYear()} {profile.fullName}</span>
                <span>IMMERSIVE CREATIVE EDITION</span>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
