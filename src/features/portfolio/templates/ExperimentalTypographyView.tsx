import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowUpRight,
  Sparkles,
  MoveDown,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const ExperimentalTypographyView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#111] text-[#eee] font-sans antialiased selection:bg-[#fff] selection:text-[#000] overflow-x-hidden">
      {/* Mega Kinetic Marquee Bar */}
      <div className="bg-[#fff] text-[#000] py-2 overflow-hidden border-b border-black font-mono font-black text-xs uppercase tracking-widest select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-8 sm:gap-12">
          <span>{profile.fullName.toUpperCase()}</span>
          <span>✦ {profile.headline.toUpperCase()}</span>
          <span>✦ {contact.location?.toUpperCase() || 'WORLDWIDE'}</span>
          <span>✦ {dict.hero.statusAvailable.toUpperCase()}</span>
          <span>{profile.fullName.toUpperCase()}</span>
          <span>✦ {profile.headline.toUpperCase()}</span>
          <span>✦ {contact.location?.toUpperCase() || 'WORLDWIDE'}</span>
          <span>✦ {dict.hero.statusAvailable.toUpperCase()}</span>
        </div>
      </div>

      {/* Floating Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 flex items-center justify-between sticky top-0 z-40 bg-[#111]/90 backdrop-blur-md">
        <span className="font-mono text-xs sm:text-sm tracking-widest font-black uppercase truncate max-w-[200px] sm:max-w-none">
          {profile.fullName}
        </span>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-neutral-400">
            {design.visibleSections.about && (
              <a href="#about" className="hover:text-white transition-colors">
                [ {dict.nav.about} ]
              </a>
            )}
            {design.visibleSections.projects && (
              <a href="#projects" className="hover:text-white transition-colors">
                [ {dict.nav.projects} ]
              </a>
            )}
            {design.visibleSections.contact && (
              <a href="#contact" className="hover:text-white underline transition-colors">
                [ {dict.nav.contact} ]
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
            className="p-1.5 border border-white text-white font-mono text-xs uppercase flex items-center gap-1 hover:bg-white hover:text-black transition-colors"
          >
            {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        )}
      </header>

      {/* Mobile Drawer */}
      {isMobile && mobileMenuOpen && (
        <div className="border-b border-white/10 p-4 bg-neutral-950 flex flex-col gap-2 font-mono text-xs uppercase tracking-widest">
          {design.visibleSections.about && (
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 border border-white/20 hover:border-white text-neutral-300"
            >
              [ {dict.nav.about} ]
            </a>
          )}
          {design.visibleSections.projects && (
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 border border-white/20 hover:border-white text-neutral-300"
            >
              [ {dict.nav.projects} ]
            </a>
          )}
          {design.visibleSections.contact && (
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 bg-white text-black font-bold text-center"
            >
              [ {dict.nav.contact} ]
            </a>
          )}
        </div>
      )}

      {/* Mega Kinetic Statement Hero */}
      <section className="px-4 sm:px-8 lg:px-12 py-14 sm:py-24 md:py-36 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>{dict.hero.statusAvailable}</span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="text-3xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.92] text-white break-words">
              <TypewriterText
                text={profile.fullName}
                speed={40}
                delay={100}
                cursorStyle="block"
                cursorColor="#ffffff"
                className="text-white"
              />
            </div>
            {profile.headline && (
              <div className="text-xl sm:text-4xl lg:text-5xl font-light italic tracking-tight text-neutral-400 font-serif pt-2 sm:pt-4 break-words">
                &quot;
                <TypewriterText
                  text={profile.headline}
                  speed={32}
                  delay={260}
                  cursorStyle="pipe"
                  cursorColor="#10b981"
                  className="text-neutral-300"
                />
                &quot;
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10 items-end`}>
            <div className={`${isMobile ? 'w-full' : 'md:col-span-8'}`}>
              <p className="text-sm sm:text-lg lg:text-xl text-neutral-300 font-light leading-relaxed max-w-2xl">
                {profile.summary}
              </p>
            </div>
            <div className={`${isMobile ? 'w-full' : 'md:col-span-4'} flex justify-start ${isMobile ? '' : 'md:justify-end'} gap-3 sm:gap-4 font-mono text-xs uppercase`}>
              <a
                href={profile.primaryCtaLink || '#projects'}
                className="group px-5 sm:px-6 py-3 sm:py-3.5 bg-white text-black font-bold tracking-wider hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experimental Projects Section: Oversized Numbering */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="px-4 sm:px-8 lg:px-12 py-14 sm:py-24 border-b border-white/10">
            <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
                  {dict.projects.title}
                </h2>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                  [ 01 — 0{projects.length} ]
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className={`py-10 sm:py-16 grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-6 sm:gap-8 items-center group`}
                  >
                    <div className={`${isMobile ? 'w-full' : 'lg:col-span-2'} font-mono text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-700 group-hover:text-emerald-400 transition-colors`}>
                      0{idx + 1}
                    </div>

                    <div className={`${isMobile ? 'w-full' : 'lg:col-span-6'} space-y-3 sm:space-y-4`}>
                      <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block truncate">
                        {proj.role}
                      </span>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white group-hover:underline">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl">
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-neutral-400">
                          {proj.technologies.map((t, tidx) => (
                            <span key={tidx} className="border-b border-neutral-700 pb-0.5">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`${isMobile ? 'w-full' : 'lg:col-span-4'} flex flex-col items-start ${isMobile ? '' : 'lg:items-end'} gap-4`}>
                      {proj.thumbnail && (
                        <div className="aspect-video w-full max-w-xs rounded overflow-hidden bg-neutral-800 border border-white/10">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link font-mono text-xs uppercase font-bold text-white flex items-center gap-1 hover:text-emerald-400 active:scale-95 transition-all"
                        >
                          <span>{dict.projects.liveDemo}</span>
                          <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
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

      {/* About Section */}
      {design.visibleSections.about && (
        <ScrollReveal animation="fade-up">
          <section id="about" className="px-4 sm:px-8 lg:px-12 py-14 sm:py-24 border-b border-white/10 bg-neutral-950">
            <div className={`max-w-7xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} gap-8 lg:gap-12`}>
              <div className={`${isMobile ? 'w-full' : 'lg:col-span-4'} space-y-3 sm:space-y-4`}>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block">
                  BACKGROUND & METHOD
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                  {about.sectionTitle || dict.about.title}
                </h2>
              </div>
              <div className={`${isMobile ? 'w-full' : 'lg:col-span-8'} space-y-5 text-sm sm:text-lg text-neutral-300 font-light leading-relaxed`}>
                <p>{about.bio}</p>
                {about.additionalInfo && (
                  <p className="font-serif italic text-neutral-400 text-xs sm:text-base pt-4 border-t border-white/10">
                    {about.additionalInfo}
                  </p>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Big Typographic Contact Footer */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-28 md:py-36 bg-black text-white">
            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block">
                INITIATE CONTACT
              </span>
              <div className="text-2xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none hover:text-emerald-400 transition-colors">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="block break-all">
                    {contact.email}
                  </a>
                ) : (
                  dict.contact.title
                )}
              </div>

              <div className="pt-8 sm:pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono text-neutral-500 gap-3">
                <span>© {new Date().getFullYear()} {profile.fullName}</span>
                <span>EXPERIMENTAL TYPOGRAPHY SUITE</span>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
