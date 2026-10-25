import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const MinimalLuxuryView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#fcfaf7] text-[#292524] font-serif antialiased selection:bg-[#d6d3d1] selection:text-black overflow-x-hidden">
      {/* Luxury Minimal Header */}
      <header className="border-b border-[#e7e5e4] px-4 sm:px-8 py-4 sm:py-6 sticky top-0 z-40 bg-[#fcfaf7]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="#" className="text-lg sm:text-xl tracking-tight font-serif italic font-medium truncate max-w-[220px] sm:max-w-none">
            {profile.fullName}
          </a>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex items-center gap-6 lg:gap-8 font-sans text-xs tracking-widest uppercase text-[#78716c]">
              {design.visibleSections.about && (
                <a href="#about" className="hover:text-black transition-colors">
                  {dict.nav.about}
                </a>
              )}
              {design.visibleSections.experience && (
                <a href="#experience" className="hover:text-black transition-colors">
                  {dict.nav.experience}
                </a>
              )}
              {design.visibleSections.projects && (
                <a href="#projects" className="hover:text-black transition-colors">
                  {dict.nav.projects}
                </a>
              )}
              {design.visibleSections.contact && (
                <a
                  href="#contact"
                  className="hover:text-black border-b border-black pb-0.5 transition-all"
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
              className="font-sans text-xs uppercase tracking-widest text-[#78716c] hover:text-black flex items-center gap-1.5 border-b border-[#a8a29e] pb-0.5"
            >
              {mobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
              <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          )}
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-[#e7e5e4] flex flex-col gap-2.5 font-sans text-xs uppercase tracking-widest text-[#78716c] pb-2">
            {design.visibleSections.about && (
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 hover:text-black"
              >
                — {dict.nav.about}
              </a>
            )}
            {design.visibleSections.experience && (
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 hover:text-black"
              >
                — {dict.nav.experience}
              </a>
            )}
            {design.visibleSections.projects && (
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 hover:text-black"
              >
                — {dict.nav.projects}
              </a>
            )}
            {design.visibleSections.contact && (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 text-black font-medium border-l border-black pl-3"
              >
                {dict.nav.contact}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero Section: Editorial Luxury */}
      <section className="px-4 sm:px-8 py-14 sm:py-24 md:py-32 border-b border-[#e7e5e4]">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 text-center">
          <div className="inline-block font-sans text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#a8a29e] border-b border-[#e7e5e4] pb-2">
            {dict.hero.statusAvailable}
          </div>

          <div className="space-y-3">
            <div className="font-sans text-xs tracking-widest uppercase text-[#78716c]">
              <TypewriterText
                text={profile.fullName}
                speed={42}
                delay={120}
                cursorStyle="pipe"
                cursorColor="#78716c"
                className="text-[#78716c]"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-normal tracking-tight leading-[1.1] text-[#1c1917] break-words">
              {profile.headline ? (
                <TypewriterText
                  text={profile.headline}
                  speed={34}
                  delay={260}
                  cursorStyle="pipe"
                  cursorColor="#1c1917"
                  className="text-[#1c1917]"
                />
              ) : (
                profile.fullName
              )}
            </h1>
          </div>

          <p className="font-sans text-xs sm:text-base text-[#57534e] max-w-2xl mx-auto leading-relaxed font-light">
            {profile.summary}
          </p>

          <div className="pt-4 sm:pt-6 flex flex-wrap justify-center gap-4 sm:gap-6 font-sans text-xs tracking-wider uppercase">
            <a
              href={profile.primaryCtaLink || '#projects'}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#1c1917] text-[#fcfaf7] font-medium hover:bg-[#44403c] active:scale-95 transition-all shadow-sm"
            >
              {profile.primaryCtaText || dict.hero.viewWork}
            </a>
            <a
              href={profile.secondaryCtaLink || '#contact'}
              className="px-6 sm:px-8 py-3 sm:py-3.5 border border-[#1c1917] text-[#1c1917] font-medium hover:bg-[#1c1917] hover:text-[#fcfaf7] active:scale-95 transition-all"
            >
              {profile.secondaryCtaText || dict.hero.getInTouch}
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      {design.visibleSections.about && (
        <ScrollReveal animation="fade-up">
          <section id="about" className="px-4 sm:px-8 py-14 sm:py-24 md:py-28 border-b border-[#e7e5e4]">
            <div className={`max-w-5xl mx-auto grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-8 md:gap-12 items-start`}>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-4'} space-y-2`}>
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] block">
                  {dict.about.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1c1917]">
                  {about.sectionTitle || 'Biography'}
                </h2>
              </div>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-8'} space-y-6 text-[#57534e] text-xs sm:text-base leading-relaxed font-sans font-light`}>
                <p>{about.bio}</p>
                {about.highlights && about.highlights.length > 0 && (
                  <div className="pt-6 border-t border-[#e7e5e4] space-y-3">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-[#1c1917] font-medium block">
                      {dict.about.keyHighlights}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {about.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#57534e]">
                          <span className="text-[#a8a29e] select-none">—</span>
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

      {/* Featured Works */}
      {design.visibleSections.projects && (
        <ScrollReveal animation="fade-up">
          <section id="projects" className="px-4 sm:px-8 py-14 sm:py-24 md:py-28 border-b border-[#e7e5e4]">
            <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
              <div className="text-center space-y-2">
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] block">
                  {dict.projects.title}
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-[#1c1917]">
                  Selected Portfolio
                </h2>
              </div>

              <div className="space-y-12 sm:space-y-20">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-6 sm:gap-10 items-center border-b border-[#e7e5e4] pb-12 sm:pb-16 last:border-b-0`}
                  >
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} aspect-[16/10] bg-[#f5f5f4] overflow-hidden border border-[#e7e5e4]`}>
                      {proj.thumbnail && (
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-5'} space-y-3 sm:space-y-4`}>
                      <span className="font-sans text-[10px] tracking-widest uppercase text-[#a8a29e] block">
                        Project 0{idx + 1} • {proj.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917]">
                        {proj.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#78716c] leading-relaxed font-light">
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-2 pt-1 font-sans text-[11px] text-[#a8a29e]">
                          {proj.technologies.join(' / ')}
                        </div>
                      )}
                      <div className="pt-2 sm:pt-4 flex items-center gap-4 font-sans text-xs">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link text-[#1c1917] hover:underline flex items-center gap-1 font-medium tracking-wide uppercase text-[11px]"
                          >
                            <span>{dict.projects.liveDemo}</span>
                            <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
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
          <section id="experience" className="px-4 sm:px-8 py-14 sm:py-20 border-b border-[#e7e5e4]">
            <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
              <div className="text-center space-y-2">
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#a8a29e] block">
                  {dict.experience.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917]">
                  Career Trajectory
                </h2>
              </div>

              <div className="divide-y divide-[#e7e5e4]">
                {experiences.map((exp) => (
                  <div key={exp.id} className={`py-6 sm:py-8 grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-12'} gap-4 md:gap-6 items-baseline font-sans`}>
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-4'} text-xs text-[#a8a29e] tracking-wider uppercase`}>
                      {exp.startDate} — {exp.current ? dict.experience.present : exp.endDate}
                    </div>
                    <div className={`${isMobile ? 'w-full' : 'md:col-span-8'} space-y-2`}>
                      <h3 className="font-serif text-lg sm:text-xl text-[#1c1917]">{exp.position}</h3>
                      <div className="text-xs text-[#78716c] uppercase tracking-wider">{exp.company}</div>
                      <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed font-light">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Minimal Contact & Footer */}
      {design.visibleSections.contact && (
        <ScrollReveal animation="fade-up">
          <section id="contact" className="px-4 sm:px-8 py-16 sm:py-24 bg-[#1c1917] text-[#fcfaf7]">
            <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 font-serif">
              <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#a8a29e] block">
                {dict.contact.title}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-light italic tracking-tight">
                Inquiries & Commissions
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#a8a29e] max-w-md mx-auto font-light leading-relaxed">
                {dict.contact.subtitle}
              </p>

              <div className="pt-2 sm:pt-4 font-sans text-xs tracking-wider uppercase">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-block border-b border-[#fcfaf7] pb-1 text-[#fcfaf7] hover:text-[#d6d3d1] transition-colors truncate max-w-full"
                  >
                    {contact.email}
                  </a>
                )}
              </div>

              <div className="pt-10 sm:pt-16 border-t border-[#44403c] flex flex-col sm:flex-row justify-between items-center gap-3 font-sans text-[11px] text-[#78716c]">
                <span>© {new Date().getFullYear()} {profile.fullName}</span>
                <span>MINIMAL LUXURY</span>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
};
