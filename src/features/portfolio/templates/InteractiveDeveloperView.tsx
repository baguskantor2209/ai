import React, { useState } from 'react';
import { PortfolioData } from '../portfolioTypes';
import { getDictionary } from '../translations';
import { usePortfolioViewport } from '../context/PortfolioViewportContext';
import { TypewriterText } from '../components/animations/TypewriterText';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import {
  Terminal,
  Folder,
  FileCode,
  GitBranch,
  GitCommit,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export const InteractiveDeveloperView: React.FC<Props> = ({ data }) => {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = data;
  const lang = design.contentLanguage || 'id';
  const dict = getDictionary(lang);
  const { isMobile } = usePortfolioViewport();

  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!contact.email) return;
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedProj = projects[activeProjectIdx] || projects[0];

  return (
    <div className="min-h-full bg-[#0d1117] text-[#c9d1d9] font-mono antialiased selection:bg-[#58a6ff]/30 selection:text-white p-2.5 sm:p-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Terminal Window Frame */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl overflow-hidden">
          {/* Terminal Window Titlebar */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] shrink-0" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] shrink-0" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] shrink-0" />
              <span className="text-[11px] sm:text-xs text-[#8b949e] ml-1 sm:ml-2 font-mono truncate">
                bash - {profile.fullName.toLowerCase().replace(/\s+/g, '-')}.dev
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#8b949e] shrink-0">
              <span className="hidden sm:inline">branch: main*</span>
              <span className="text-emerald-400">● node v20</span>
            </div>
          </div>

          {/* Interactive Shell Prompt Header */}
          <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 border-b border-[#30363d]">
            <div className="text-[11px] sm:text-xs text-[#8b949e] space-y-1">
              <p>&gt; const developer = new Developer(&quot;{profile.fullName}&quot;);</p>
              <p>&gt; developer.init();</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-ping" />
                <span>{dict.hero.statusAvailable}</span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="text-xs text-[#58a6ff] flex items-center gap-1">
                  <span>$&nbsp;whoami:&nbsp;</span>
                  <TypewriterText
                    text={profile.fullName}
                    speed={36}
                    delay={100}
                    cursorStyle="underscore"
                    cursorColor="#58a6ff"
                    className="font-bold text-white"
                  />
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight break-words">
                  {profile.headline ? (
                    <TypewriterText
                      text={profile.headline}
                      speed={28}
                      delay={240}
                      cursorStyle="block"
                      cursorColor="#3fb950"
                      className="text-white"
                    />
                  ) : (
                    profile.fullName
                  )}
                </h1>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-[#8b949e] max-w-2xl font-light leading-relaxed">
                {profile.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
              {contact.email && (
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? dict.contact.copied : `curl contact --email`}</span>
                </button>
              )}
              <a
                href="#projects"
                className="px-3.5 sm:px-4 py-2 rounded-lg border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] active:scale-95 text-white text-xs transition-colors flex items-center gap-2"
              >
                <span>./view-projects.sh</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Tabbed Interactive Project Explorer */}
          {design.visibleSections.projects && projects.length > 0 && (
            <ScrollReveal animation="fade-up">
              <div id="projects" className="border-b border-[#30363d]">
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
                  <div className="flex items-center gap-2">
                    <Folder size={14} className="text-[#58a6ff]" />
                    <span>workspace / projects /</span>
                  </div>
                  <span>{projects.length} repository</span>
                </div>

                <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-12'} divide-y ${isMobile ? '' : 'lg:divide-y-0 lg:divide-x'} divide-[#30363d]`}>
                  {/* File list on left */}
                  <div className={`${isMobile ? 'w-full' : 'lg:col-span-4'} p-3 sm:p-4 space-y-1 bg-[#161b22]`}>
                    {projects.map((proj, idx) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => setActiveProjectIdx(idx)}
                        className={`w-full text-left px-3 py-2 sm:py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          activeProjectIdx === idx
                            ? 'bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 font-bold'
                            : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode size={14} className="shrink-0" />
                          <span className="truncate">{proj.title.toLowerCase().replace(/\s+/g, '-')}.ts</span>
                        </div>
                        <span className="text-[10px] opacity-70 shrink-0 ml-1">0{idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* File details viewer on right */}
                  {selectedProj && (
                    <div className={`${isMobile ? 'w-full' : 'lg:col-span-8'} p-4 sm:p-6 space-y-4 bg-[#0d1117]`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30363d] pb-3">
                        <div>
                          <span className="text-xs text-[#58a6ff] font-bold block">{selectedProj.title}</span>
                          <span className="text-[11px] text-[#8b949e]">Role: {selectedProj.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProj.demoUrl && (
                            <a
                              href={selectedProj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded bg-[#238636] text-white text-xs font-bold hover:bg-[#2ea043] flex items-center gap-1 active:scale-95 transition-all"
                            >
                              <span>Live</span>
                              <ArrowUpRight size={12} />
                            </a>
                          )}
                          {selectedProj.repoUrl && (
                            <a
                              href={selectedProj.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded border border-[#30363d] text-[#8b949e] hover:text-white active:scale-95 transition-all"
                            >
                              <Github size={14} />
                            </a>
                          )}
                        </div>
                      </div>

                      {selectedProj.thumbnail && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-[#161b22] border border-[#30363d]">
                          <img
                            src={selectedProj.thumbnail}
                            alt={selectedProj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-xs text-[#c9d1d9] leading-relaxed">
                        {selectedProj.description}
                      </p>

                      {selectedProj.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedProj.technologies.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px] text-[#58a6ff]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Git Commit Style Experience Timeline */}
          {design.visibleSections.experience && (
            <ScrollReveal animation="fade-up">
              <div className="p-4 sm:p-8 border-b border-[#30363d] space-y-5 sm:space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#58a6ff]">
                  <GitBranch size={16} />
                  <span className="font-bold uppercase tracking-wider">{dict.experience.title}</span>
                </div>

                <div className="space-y-5 sm:space-y-6 relative pl-5 sm:pl-6 border-l border-[#30363d] ml-2 sm:ml-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative space-y-2">
                      <span className="absolute -left-[27px] sm:-left-[31px] top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1f6feb] border-2 border-[#0d1117]" />
                      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-white">{exp.position}</h3>
                        <span className="text-[10px] sm:text-[11px] text-[#8b949e]">
                          commit: {exp.startDate} - {exp.current ? dict.experience.present : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs text-[#58a6ff]">@{exp.company}</div>
                      <p className="text-xs text-[#8b949e] leading-relaxed">{exp.description}</p>
                      {exp.achievements && (
                        <ul className="text-xs text-[#8b949e] list-disc list-inside space-y-1 pt-1">
                          {exp.achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Skills Matrix */}
          {design.visibleSections.skills && (
            <ScrollReveal animation="fade-up">
              <div className="p-4 sm:p-8 border-b border-[#30363d] space-y-4">
                <div className="text-xs text-[#58a6ff] font-bold uppercase tracking-wider">
                  &gt; developer.skills.json
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                  {skills.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] space-y-1 hover:border-[#58a6ff]/50 transition-colors">
                      <span className="text-[10px] text-[#8b949e] block truncate">{s.category}</span>
                      <span className="text-white font-bold block truncate">{s.name}</span>
                      <span className="text-[10px] text-[#3fb950] font-mono">{s.level}% proficiency</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Terminal Footer */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0d1117] flex flex-col sm:flex-row justify-between items-center text-xs text-[#8b949e] gap-2">
            <span>© {new Date().getFullYear()} {profile.fullName}</span>
            <div className="flex items-center gap-4">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-[#58a6ff] hover:underline truncate">
                  {contact.email}
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
      </div>
    </div>
  );
};
