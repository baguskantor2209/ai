import JSZip from 'jszip';
import { PortfolioData } from './portfolioTypes';

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: 'javascript' | 'json' | 'html' | 'css' | 'markdown';
}

export function generateProjectFiles(data: PortfolioData): Record<string, ProjectFile> {
  const pColor = data.design?.primaryColor || '#3b82f6';
  const aColor = data.design?.accentColor || '#10b981';
  const fullName = data.profile?.fullName?.trim() || data.projectName || 'Portfolio';
  const title = `${fullName} | Portfolio`;
  const template = data.design?.template || 'swiss-editorial';

  // 1. package.json
  const packageJson = JSON.stringify(
    {
      name: (data.projectName || 'my-portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'lucide-react': '^0.446.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.3.2',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.47',
        tailwindcss: '^3.4.13',
        vite: '^5.4.8',
      },
    },
    null,
    2
  );

  // 2. vite.config.js
  const viteConfigJs = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
`;

  // 3. tailwind.config.js
  const tailwindConfigJs = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${pColor}',
        accent: '${aColor}',
      },
      fontFamily: {
        sans: ['${data.design.fontFamily || 'Inter'}', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
`;

  // 4. postcss.config.js
  const postcssConfigJs = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  // 5. index.html
  const indexHtml = `<!doctype html>
<html lang="${data.design.contentLanguage || 'id'}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${((data.profile?.summary) || 'Website Portofolio Profesional').replace(/"/g, '&quot;')}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  // 6. src/index.css
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: '${data.design.fontFamily || 'Inter'}', sans-serif;
  overflow-x: hidden;
}

@keyframes portfolioMarquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: portfolioMarquee 24s linear infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none !important;
    transform: none !important;
  }
}
`;

  // 7. src/translations.js
  const translationsJs = `// Bilingual Translation Dictionaries
export const PORTFOLIO_TRANSLATIONS = {
  id: {
    nav: { home: 'Beranda', about: 'Tentang', experience: 'Pengalaman', education: 'Pendidikan', projects: 'Proyek', skills: 'Keahlian', certifications: 'Sertifikasi', contact: 'Kontak' },
    hero: { statusAvailable: 'Tersedia untuk proyek baru', statusBusy: 'Fokus pada proyek berjalan', viewWork: 'Lihat Portofolio', getInTouch: 'Hubungi Saya' },
    about: { title: 'Tentang Saya', keyHighlights: 'Sorotan Utama' },
    experience: { title: 'Pengalaman Kerja', present: 'Sekarang' },
    projects: { title: 'Proyek Pilihan', liveDemo: 'Live Demo', sourceCode: 'Kode Sumber' },
    skills: { title: 'Keahlian Utama' },
    contact: { title: 'Mari Terhubung', subtitle: 'Terbuka untuk diskusi proyek dan kolaborasi baru.', socials: 'Saluran Sosial' },
    footer: { rightsReserved: 'Hak Cipta Dilindungi.' }
  },
  en: {
    nav: { home: 'Home', about: 'About', experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills', certifications: 'Certifications', contact: 'Contact' },
    hero: { statusAvailable: 'Available for opportunities', statusBusy: 'Engaged in ongoing work', viewWork: 'View Work', getInTouch: "Let's Connect" },
    about: { title: 'About Me', keyHighlights: 'Key Highlights' },
    experience: { title: 'Work Experience', present: 'Present' },
    projects: { title: 'Featured Projects', liveDemo: 'Live Demo', sourceCode: 'Source Code' },
    skills: { title: 'Core Competencies' },
    contact: { title: "Let's Connect", subtitle: 'Open for project collaborations and new opportunities.', socials: 'Social Profiles' },
    footer: { rightsReserved: 'All rights reserved.' }
  }
};

export function getDictionary(lang = 'id') {
  return PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.id;
}
`;

  // 8. src/data/portfolio.js
  const portfolioJs = `// Data Portofolio — Dihasilkan secara otomatis oleh Portfolio Studio
export const portfolioData = ${JSON.stringify(data, null, 2)};
`;

  // 9. src/main.jsx
  const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  // 10. src/App.jsx (Self-contained standalone React code)
  const appJsx = generateStandaloneAppJsx(data);

  // 11. README.md
  const readmeMd = `# ${fullName} — Website Portofolio

Proyek website portofolio profesional siap pakai yang dibangun dengan **React**, **Vite**, dan **Tailwind CSS**.

## 🚀 Panduan Memulai Cepat

Pastikan Node.js (versi 18+) sudah terinstal di komputer Anda.

1. Buka terminal di folder project ini:
   \`\`\`bash
   npm install
   \`\`\`

2. Jalankan server pengembangan lokal:
   \`\`\`bash
   npm run dev
   \`\`\`
   Buka URL yang ditampilkan di terminal (biasanya \`http://localhost:5173\`) di browser Anda.

3. Untuk mempublikasikan / build ke file static siap deploy:
   \`\`\`bash
   npm run build
   \`\`\`
   Folder \`dist/\` yang dihasilkan dapat dideploy langsung ke **Vercel**, **Netlify**, **GitHub Pages**, atau hosting web pilihan Anda!

## 📂 Struktur Folder
\`\`\`
portfolio-website/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── translations.js
    └── data/
        └── portfolio.js
\`\`\`

---
*Dibuat dengan Portfolio Studio*
`;

  return {
    'package.json': {
      path: 'package.json',
      name: 'package.json',
      content: packageJson,
      language: 'json',
    },
    'vite.config.js': {
      path: 'vite.config.js',
      name: 'vite.config.js',
      content: viteConfigJs,
      language: 'javascript',
    },
    'tailwind.config.js': {
      path: 'tailwind.config.js',
      name: 'tailwind.config.js',
      content: tailwindConfigJs,
      language: 'javascript',
    },
    'postcss.config.js': {
      path: 'postcss.config.js',
      name: 'postcss.config.js',
      content: postcssConfigJs,
      language: 'javascript',
    },
    'README.md': {
      path: 'README.md',
      name: 'README.md',
      content: readmeMd,
      language: 'markdown',
    },
    'index.html': {
      path: 'index.html',
      name: 'index.html',
      content: indexHtml,
      language: 'html',
    },
    'src/main.jsx': {
      path: 'src/main.jsx',
      name: 'main.jsx',
      content: mainJsx,
      language: 'javascript',
    },
    'src/index.css': {
      path: 'src/index.css',
      name: 'index.css',
      content: indexCss,
      language: 'css',
    },
    'src/data/portfolio.js': {
      path: 'src/data/portfolio.js',
      name: 'portfolio.js',
      content: portfolioJs,
      language: 'javascript',
    },
    'src/translations.js': {
      path: 'src/translations.js',
      name: 'translations.js',
      content: translationsJs,
      language: 'javascript',
    },
    'src/App.jsx': {
      path: 'src/App.jsx',
      name: 'App.jsx',
      content: appJsx,
      language: 'javascript',
    },
  };
}

function generateStandaloneAppJsx(data: PortfolioData): string {
  const tpl = data.design.template || 'swiss-editorial';
  const lang = data.design.contentLanguage || 'id';

  return `import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from './data/portfolio.js';
import { getDictionary } from './translations.js';
import {
  Briefcase,
  Folder,
  FileCode,
  GitBranch,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  ArrowUpRight,
  Terminal,
  Zap,
  Sparkles,
  Cpu,
  Radio,
  Menu,
  X,
  Copy,
  Check,
} from 'lucide-react';

// ==========================================
// ANIMATION PRIMITIVES (TYPEWRITER & SCROLL)
// ==========================================
function TypewriterText({ text = '', speed = 38, delay = 100, cursorStyle = 'pipe', cursorColor, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    let idx = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        idx++;
        setDisplayedText(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, delay]);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const renderCursor = () => {
    const op = cursorVisible ? 'opacity-100' : 'opacity-0';
    if (cursorStyle === 'block') {
      return <span className={\`inline-block w-[0.55em] h-[0.9em] ml-1 bg-current align-baseline \${op} transition-opacity duration-100\`} style={cursorColor ? { backgroundColor: cursorColor } : {}} />;
    }
    if (cursorStyle === 'underscore') {
      return <span className={\`inline-block font-mono font-bold ml-0.5 \${op} transition-opacity duration-100\`} style={cursorColor ? { color: cursorColor } : {}}>_</span>;
    }
    if (cursorStyle === 'glow') {
      return <span className={\`inline-block w-[2.5px] h-[0.85em] ml-1 rounded-full \${op} transition-opacity duration-100\`} style={{ backgroundColor: cursorColor || '#06b6d4', boxShadow: \`0 0 10px \${cursorColor || '#06b6d4'}\` }} />;
    }
    if (cursorStyle === 'accent') {
      return <span className={\`inline-block w-[3px] h-[0.9em] ml-1 rounded-sm \${op} transition-opacity duration-100\`} style={{ backgroundColor: cursorColor || '#ec4899' }} />;
    }
    return <span className={\`inline-block w-[2px] h-[0.85em] ml-1 bg-current align-middle \${op} transition-opacity duration-100\`} style={cursorColor ? { backgroundColor: cursorColor } : {}} />;
  };

  return (
    <span className={\`break-words \${className}\`}>
      {displayedText}
      {renderCursor()}
    </span>
  );
}

function ScrollReveal({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }
    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={\`transition-all duration-700 ease-out \${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} \${className}\`}
      style={{ transitionDelay: \`\${delay}ms\` }}
    >
      {children}
    </div>
  );
}

// ==========================================
// MAIN STANDALONE PORTFOLIO APP
// ==========================================
export default function App() {
  const { profile, about, experiences, education, projects, skills, certifications, contact, design } = portfolioData;
  const lang = design.contentLanguage || '${lang}';
  const dict = getDictionary(lang);
  const template = '${tpl}';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!contact.email) return;
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. SWISS EDITORIAL
  if (template === 'swiss-editorial') {
    return (
      <div className="min-h-screen bg-[#fbfbfb] text-[#121316] font-sans antialiased selection:bg-black selection:text-white overflow-x-hidden">
        <header className="border-b border-black/10 sticky top-0 z-40 bg-[#fbfbfb]/95 backdrop-blur-md px-4 sm:px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-3 h-3 bg-black inline-block shrink-0" />
              <span className="font-extrabold tracking-tighter text-sm sm:text-base uppercase truncate">{profile.fullName}</span>
              <span className="hidden md:inline text-xs font-mono text-black/50 pl-2 border-l border-black/20 truncate">{profile.headline}</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-black/70">
              {design.visibleSections.about && <a href="#about" className="hover:text-black hover:underline">01 / {dict.nav.about}</a>}
              {design.visibleSections.experience && <a href="#experience" className="hover:text-black hover:underline">02 / {dict.nav.experience}</a>}
              {design.visibleSections.projects && <a href="#projects" className="hover:text-black hover:underline">03 / {dict.nav.projects}</a>}
              {design.visibleSections.contact && <a href="#contact" className="px-3.5 py-1.5 bg-black text-white font-bold uppercase">{dict.nav.contact}</a>}
            </nav>
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 border border-black bg-white text-black font-mono text-xs font-bold">
              {mobileMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-black/10 flex flex-col gap-2 font-mono text-xs uppercase bg-[#fbfbfb] pb-2">
              {design.visibleSections.about && <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-black/5">01 / {dict.nav.about}</a>}
              {design.visibleSections.experience && <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-black/5">02 / {dict.nav.experience}</a>}
              {design.visibleSections.projects && <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 hover:bg-black/5">03 / {dict.nav.projects}</a>}
              {design.visibleSections.contact && <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 bg-black text-white font-bold text-center">{dict.nav.contact}</a>}
            </div>
          )}
        </header>

        <section className="border-b border-black/10 px-4 sm:px-6 py-12 md:py-24 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start justify-between">
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-black/60 bg-black/5 px-2.5 py-1 border border-black/10">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
                {dict.hero.statusAvailable}
              </div>
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-widest text-black/50">
                  <TypewriterText text={profile.fullName} speed={38} delay={100} cursorStyle="pipe" cursorColor="#000" className="font-bold text-black" />
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] uppercase break-words">
                  {profile.headline ? <TypewriterText text={profile.headline} speed={30} delay={260} cursorStyle="pipe" cursorColor="#2563eb" /> : profile.fullName}
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-black/75 max-w-2xl font-normal leading-relaxed border-l-2 border-black pl-4">
                {profile.summary}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a href={profile.primaryCtaLink || '#projects'} className="group px-5 sm:px-6 py-3.5 bg-black text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-800 transition-all flex items-center gap-2">
                  <span>{profile.primaryCtaText || dict.hero.viewWork}</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a href={profile.secondaryCtaLink || '#contact'} className="px-5 sm:px-6 py-3.5 border border-black text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-black hover:text-white transition-all">
                  <span>{profile.secondaryCtaText || dict.hero.getInTouch}</span>
                </a>
              </div>
            </div>
            {profile.avatarUrl && (
              <div className="w-full sm:w-72 lg:w-80 shrink-0 border-2 border-black p-2 bg-white shadow-sm">
                <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            )}
          </div>
        </section>

        {design.visibleSections.projects && (
          <ScrollReveal>
            <section id="projects" className="border-b border-black/10 px-4 sm:px-6 py-14 md:py-20 max-w-6xl mx-auto space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">03 / {dict.projects.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {projects.map((proj, idx) => (
                  <div key={proj.id} className="border border-black p-5 bg-[#fbfbfb] flex flex-col justify-between group hover:border-black/70 hover:-translate-y-1 transition-all">
                    <div className="space-y-4">
                      {proj.thumbnail && <div className="aspect-video bg-neutral-200 overflow-hidden border border-black/10"><img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                      <h3 className="text-lg sm:text-xl font-bold uppercase">{proj.title}</h3>
                      <p className="text-xs sm:text-sm text-black/75">{proj.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black/10 flex justify-between text-xs font-mono font-bold">
                      {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="underline">{dict.projects.liveDemo} ↗</a>}
                      {proj.repoUrl && <a href={proj.repoUrl} target="_blank" rel="noreferrer">GitHub</a>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        <footer className="border-t border-black/10 px-4 sm:px-6 py-10 text-center text-xs font-mono uppercase text-black/60">
          © {new Date().getFullYear()} {profile.fullName}. {dict.footer.rightsReserved}
        </footer>
      </div>
    );
  }

  // 2. CREATIVE BRUTALIST
  if (template === 'creative-brutalist') {
    return (
      <div className="min-h-screen bg-[#fef08a] text-black font-sans antialiased selection:bg-black selection:text-[#fef08a] overflow-x-hidden">
        <div className="bg-black text-white py-2 overflow-hidden border-b-2 border-black text-xs font-mono font-bold uppercase tracking-widest select-none">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span>★ {profile.fullName}</span>
            <span>⚡ {profile.headline}</span>
            <span>● {dict.hero.statusAvailable}</span>
            <span>★ {contact.location || 'WORLDWIDE'}</span>
          </div>
        </div>
        <header className="sticky top-0 z-40 bg-[#fde047] border-b-3 border-black px-4 sm:px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
          <span className="font-black text-lg sm:text-xl bg-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] truncate max-w-[200px] sm:max-w-none">{profile.fullName} ⚡</span>
          <nav className="hidden md:flex items-center gap-3 font-mono text-xs font-bold uppercase">
            {design.visibleSections.about && <a href="#about" className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">{dict.nav.about}</a>}
            {design.visibleSections.projects && <a href="#projects" className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">{dict.nav.projects}</a>}
            {design.visibleSections.contact && <a href="#contact" className="px-4 py-1.5 bg-black text-white border-2 border-black shadow-[3px_3px_0px_#000]">{dict.nav.contact}</a>}
          </nav>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden px-3 py-1 bg-black text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#fff]">
            {mobileMenuOpen ? 'CLOSE' : 'MENU ⚡'}
          </button>
        </header>
        {mobileMenuOpen && (
          <div className="md:hidden p-3 bg-[#fde047] border-b-3 border-black flex flex-col gap-2 font-mono text-xs font-black uppercase">
            {design.visibleSections.about && <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center">{dict.nav.about}</a>}
            {design.visibleSections.projects && <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-center">{dict.nav.projects}</a>}
            {design.visibleSections.contact && <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 bg-black text-white border-2 border-black shadow-[2px_2px_0px_#000] text-center">{dict.nav.contact}</a>}
          </div>
        )}
        <section className="px-4 sm:px-6 py-12 md:py-20 max-w-6xl mx-auto space-y-6">
          <div className="font-mono text-xs uppercase font-black tracking-wider text-black/70">
            [CREATOR] // <TypewriterText text={profile.fullName} speed={35} delay={100} cursorStyle="block" cursorColor="#000" />
          </div>
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight break-words">
            {profile.headline ? <TypewriterText text={profile.headline} speed={30} delay={240} cursorStyle="block" cursorColor="#000" /> : profile.fullName}
          </h1>
          <div className="bg-white p-5 border-3 border-black shadow-[5px_5px_0px_#000] text-sm sm:text-base font-medium max-w-2xl">{profile.summary}</div>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#projects" className="px-6 py-4 bg-black text-white font-black uppercase text-xs border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all">{dict.hero.viewWork} ↗</a>
          </div>
        </section>
        {design.visibleSections.projects && (
          <ScrollReveal>
            <section id="projects" className="px-4 sm:px-6 py-12 sm:py-16 bg-[#fed7aa] border-t-3 border-black">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="inline-block bg-white px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000]"><h2 className="text-2xl sm:text-3xl font-black uppercase">⚡ {dict.projects.title}</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-5 space-y-3">
                      {proj.thumbnail && <div className="aspect-video bg-neutral-100 border-2 border-black overflow-hidden"><img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" /></div>}
                      <h3 className="text-lg font-black uppercase">{proj.title}</h3>
                      <p className="text-xs text-black/80">{proj.description}</p>
                      {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="inline-block py-2 px-4 bg-black text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000]">{dict.projects.liveDemo} ↗</a>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    );
  }

  // 3. FUTURISTIC DIGITAL & OTHER MODERN THEMES
  return (
    <div className="min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-mono font-bold text-xs sm:text-sm text-cyan-400 uppercase truncate max-w-[200px] sm:max-w-none">{profile.fullName}</span>
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase text-slate-400">
            {design.visibleSections.projects && <a href="#projects" className="hover:text-cyan-400">// {dict.nav.projects}</a>}
            {design.visibleSections.about && <a href="#about" className="hover:text-cyan-400">// {dict.nav.about}</a>}
            {design.visibleSections.contact && <a href="#contact" className="px-3.5 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">&lt;{dict.nav.contact}/&gt;</a>}
          </nav>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
            {mobileMenuOpen ? 'CLOSE' : 'HUD // NAV'}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-cyan-500/20 flex flex-col gap-2 font-mono text-xs uppercase bg-[#07090e] pb-2">
            {design.visibleSections.projects && <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-cyan-950/30 text-cyan-300">// {dict.nav.projects}</a>}
            {design.visibleSections.about && <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-cyan-950/30 text-cyan-300">// {dict.nav.about}</a>}
            {design.visibleSections.contact && <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded bg-cyan-500/20 text-cyan-200 text-center font-bold">&lt;{dict.nav.contact}/&gt;</a>}
          </div>
        )}
      </header>

      <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-6xl mx-auto space-y-6">
        <div className="text-xs font-mono uppercase text-cyan-400/80 flex items-center gap-1.5">
          <span>&gt; HOST // </span>
          <TypewriterText text={profile.fullName} speed={36} delay={100} cursorStyle="glow" cursorColor="#06b6d4" className="text-cyan-300" />
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight break-words">
          {profile.headline ? <TypewriterText text={profile.headline} speed={28} delay={240} cursorStyle="underscore" cursorColor="#22d3ee" /> : profile.fullName}
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl border-l-2 border-cyan-500/50 pl-4">{profile.summary}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a href="#projects" className="px-6 py-3 rounded bg-cyan-500 text-slate-950 font-mono text-xs font-bold uppercase shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
            {profile.primaryCtaText || dict.hero.viewWork}
          </a>
        </div>
      </section>

      {design.visibleSections.projects && (
        <ScrollReveal>
          <section id="projects" className="px-4 sm:px-6 py-14 max-w-6xl mx-auto space-y-8 border-t border-cyan-500/15">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">// {dict.projects.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-lg bg-slate-900/40 border border-cyan-500/20 p-5 space-y-3 hover:border-cyan-400/50 hover:-translate-y-1 transition-all">
                  {proj.thumbnail && <img src={proj.thumbnail} alt={proj.title} className="w-full h-40 object-cover rounded border border-cyan-500/15" />}
                  <h3 className="text-base sm:text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{proj.description}</p>
                  {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">{dict.projects.liveDemo} ↗</a>}
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <footer className="px-4 sm:px-6 py-10 text-center text-xs font-mono text-slate-500 border-t border-cyan-500/15">
        © {new Date().getFullYear()} {profile.fullName}. {dict.footer.rightsReserved}
      </footer>
    </div>
  );
}
`;
}

/**
 * Generates and triggers instant ZIP file download in the browser
 */
export async function downloadProjectZip(data: PortfolioData): Promise<void> {
  const zip = new JSZip();
  const files = generateProjectFiles(data);
  const rootFolder = (data.projectName || 'portfolio-website')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');

  // Add files to zip
  const folder = zip.folder(rootFolder) || zip;
  for (const [filePath, fileObj] of Object.entries(files)) {
    folder.file(filePath, fileObj.content);
  }

  // Generate ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${rootFolder}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
