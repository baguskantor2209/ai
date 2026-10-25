export type PortfolioTemplateId =
  | 'swiss-editorial'
  | 'creative-brutalist'
  | 'futuristic-digital'
  | 'immersive-creative'
  | 'minimal-luxury'
  | 'bento-grid'
  | 'experimental-typography'
  | 'interactive-developer'
  // Legacy backward-compatibility
  | 'modern'
  | 'elegant'
  | 'creative';

export interface TemplateDefinition {
  id: PortfolioTemplateId;
  name: string;
  tagline: string;
  bestFor: string;
  styleDescription: string;
  badge: string;
  accent: string;
}

export const PORTFOLIO_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'swiss-editorial',
    name: 'Swiss Editorial',
    tagline: 'Grid Presisi & Tipografi Modern',
    bestFor: 'Designer, Konsultan, Penulis & Profesional',
    styleDescription: 'Layout editorial presisi ala Swiss typography, whitespace luas, garis pembagi tegas, dan nomor seksi monolitik.',
    badge: 'Editorial',
    accent: '#2563eb',
  },
  {
    id: 'creative-brutalist',
    name: 'Creative Brutalist',
    tagline: 'Kontras Ekstrem & Hard Shadows',
    bestFor: 'Creative Director, Graphic Designer, Seniman',
    styleDescription: 'Tipografi ekstra besar, border tebal, hard shadow pop-up, marquee ticker teks, dan aksen warna berani.',
    badge: 'Brutalist',
    accent: '#f59e0b',
  },
  {
    id: 'futuristic-digital',
    name: 'Futuristic Digital',
    tagline: 'Dark Cyberpunk & HUD Panels',
    bestFor: 'Full-Stack Developer, AI Engineer, Tech Innovators',
    styleDescription: 'Dark mode futuristik, aksen neon glow cyan/purple, grid siber halus, dan status monitor sistem realtime.',
    badge: 'Cyber HUD',
    accent: '#06b6d4',
  },
  {
    id: 'immersive-creative',
    name: 'Immersive Creative',
    tagline: 'Visual-First & Hero Dominan',
    bestFor: 'Fotografer, 3D Artist, UI/UX Visual Designer',
    styleDescription: 'Hero showcase visual yang dominan, dynamic project cards dengan overlay elegan, dan storytelling visual.',
    badge: 'Visual Hero',
    accent: '#ec4899',
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    tagline: 'Kemewahan Tenang & Tipografi Serif',
    bestFor: 'Arsitek, Interior Designer, Konsultan Brand Mewah',
    styleDescription: 'Estetika minimalis premium bernuansa hangat ivory/charcoal, serif Playfair Display, dan garis hairline elegan.',
    badge: 'Luxury',
    accent: '#d97706',
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    tagline: 'Modul Bento Interaktif & Card Multi-dimensi',
    bestFor: 'Product Manager, Indie Maker, Generalist Pro',
    styleDescription: 'Tata letak grid bento interaktif dengan kartu berukuran proporsional, hover 3D lembut, dan widget ringkas.',
    badge: 'Bento Box',
    accent: '#8b5cf6',
  },
  {
    id: 'experimental-typography',
    name: 'Experimental Typography',
    tagline: 'Tipografi Raksasa & Kinetic Energy',
    bestFor: 'Art Director, Copywriter, Creative Technologist',
    styleDescription: 'Eksplorasi tipografi berukuran masif, teks marquee kinetik berjalan, hierarki dinamis, dan komposisi artistik.',
    badge: 'Typography',
    accent: '#10b981',
  },
  {
    id: 'interactive-developer',
    name: 'Interactive Developer',
    tagline: 'Terminal CLI & Git Timeline',
    bestFor: 'Software Engineer, DevOps, Backend Architect',
    styleDescription: 'Antarmuka digital terminal CLI, command prompt interaktif, commit history dot timeline, dan tab code viewer.',
    badge: 'Terminal Dev',
    accent: '#3b82f6',
  },
];

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  role: string;
  technologies: string[];
  achievements: string;
  demoUrl: string;
  repoUrl: string;
}

export interface SkillItem {
  name: string;
  category: string;
  level: number; // 0 - 100
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  twitter: string;
}

export interface DesignSettings {
  template: PortfolioTemplateId;
  contentLanguage: 'id' | 'en';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'Poppins' | 'Playfair' | 'Space Grotesk' | 'Fira Code';
  buttonStyle: 'rounded-full' | 'rounded-xl' | 'rounded-none';
  visibleSections: {
    about: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
    certifications: boolean;
    contact: boolean;
  };
}

export interface PortfolioData {
  projectName: string;
  profile: {
    fullName: string;
    avatarUrl: string;
    headline: string;
    summary: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  about: {
    sectionTitle: string;
    bio: string;
    highlights: string[];
    additionalInfo: string;
  };
  experiences: WorkExperience[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  contact: ContactInfo;
  design: DesignSettings;
  isBlankCanvas?: boolean;
}

export const BLANK_PORTFOLIO_DATA: PortfolioData = {
  projectName: 'Custom Portfolio Website',
  isBlankCanvas: true,
  profile: {
    fullName: '',
    avatarUrl: '',
    headline: '',
    summary: '',
    primaryCtaText: '',
    primaryCtaLink: '#contact',
    secondaryCtaText: '',
    secondaryCtaLink: '',
  },
  about: {
    sectionTitle: 'Tentang Saya',
    bio: '',
    highlights: [],
    additionalInfo: '',
  },
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  contact: {
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    twitter: '',
  },
  design: {
    template: 'swiss-editorial',
    contentLanguage: 'id',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    buttonStyle: 'rounded-xl',
    visibleSections: {
      about: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true,
      contact: true,
    },
  },
};

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  projectName: 'My Portfolio Website',
  profile: {
    fullName: 'Alex Pratama',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'Senior Full-Stack Engineer & UI/UX Specialist',
    summary: 'Membangun aplikasi web berkinerja tinggi, berskala besar, dan ramah pengguna dengan fokus pada arsitektur modern serta pengalaman pengguna kelas dunia.',
    primaryCtaText: 'Lihat Portofolio',
    primaryCtaLink: '#projects',
    secondaryCtaText: 'Hubungi Saya',
    secondaryCtaLink: '#contact',
  },
  about: {
    sectionTitle: 'Tentang Saya',
    bio: 'Saya adalah seorang software engineer berpengalaman lebih dari 5 tahun dalam membangun solusi digital berbasis web. Berpengalaman memimpin tim engineering, merancang arsitektur sistem dari awal, dan mengoptimalkan kecepatan serta keamanan platform.',
    highlights: [
      '5+ Tahun Pengalaman Pengembangan Web Modern',
      'Spesialis React, TypeScript, Node.js & Cloud Architecture',
      'Berhasil merilis lebih dari 20+ produk digital ke pasar internasional',
      'Fokus kuat pada Clean Code, Accessibility (a11y), dan Web Performance'
    ],
    additionalInfo: 'Di luar pekerjaan coding, saya aktif menulis tutorial teknis, berkontribusi ke open source, dan menjadi mentor bagi developer pemula.'
  },
  experiences: [
    {
      id: 'exp_1',
      company: 'Nusantara Tech Solutions',
      position: 'Lead Frontend Engineer',
      startDate: '2023',
      endDate: 'Sekarang',
      current: true,
      description: 'Memimpin tim frontend yang terdiri dari 6 developer untuk merancang ulang sistem dashboard analitik dan SaaS enterprise.',
      achievements: [
        'Meningkatkan performa Core Web Vitals sebesar 45% dan menurunkan bundle size hingga 35%',
        'Mengimplementasikan design system terstandarisasi yang mempercepat waktu rilis fitur hingga 2x lipat',
        'Merancang migrasi codebase ke TypeScript dan micro-frontends secara bertahap'
      ]
    },
    {
      id: 'exp_2',
      company: 'Digital Karya Kreatif',
      position: 'Full-Stack Developer',
      startDate: '2021',
      endDate: '2023',
      current: false,
      description: 'Mengembangkan platform e-commerce dan sistem pembayaran multi-gateway untuk klien enterprise nasional.',
      achievements: [
        'Mengintegrasikan API pembayaran (Midtrans, Xendit) dengan tingkat keberhasilan transaksi 99.8%',
        'Membangun modul realtime inventory sync menggunakan WebSockets dan Redis'
      ]
    }
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'Universitas Indonesia',
      degree: 'Sarjana Komputer (S.Kom)',
      fieldOfStudy: 'Teknik Informatika / Ilmu Komputer',
      startYear: '2016',
      endYear: '2020',
      description: 'Lulus dengan predikat Cum Laude (IPK 3.85). Ketua Komunitas Riset Pengembangan Web Mahasiswa.'
    }
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'FinanceFlow — Realtime Wealth Dashboard',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      description: 'Platform manajemen kekayaan dan pelacak investasi berbasis AI yang memvisualisasikan portofolio saham, kripto, dan reksa dana dalam satu dasbor responsif.',
      role: 'Lead Architect & Full-Stack Developer',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Chart.js'],
      achievements: 'Digunakan oleh lebih dari 15.000 pengguna aktif bulanan dengan rating 4.8/5 di Product Hunt.',
      demoUrl: 'https://example.com/financeflow',
      repoUrl: 'https://github.com/example/financeflow'
    },
    {
      id: 'proj_2',
      title: 'EchoMeet — Collaborative Workspace',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      description: 'Aplikasi ruang kerja kolaboratif dengan kanvas interaktif, editor catatan markdown waktu nyata, dan panggilan video terenkripsi.',
      role: 'Frontend Specialist',
      technologies: ['Next.js', 'WebSockets', 'Canvas API', 'Tailwind CSS'],
      achievements: 'Meraih penghargaan Best Collaboration App pada Hackathon Nasional 2023.',
      demoUrl: 'https://example.com/echomeet',
      repoUrl: 'https://github.com/example/echomeet'
    },
    {
      id: 'proj_3',
      title: 'SmartSupply — Inventory Optimization Engine',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      description: 'Sistem manajemen rantai pasok pintar untuk UMKM ritel dengan prediksi kehabisan stok berbasis machine learning.',
      role: 'Full-Stack Developer',
      technologies: ['React', 'Express', 'PostgreSQL', 'Tailwind CSS'],
      achievements: 'Menurunkan kerugian stok kedaluwarsa klien sebesar 28% dalam 3 bulan penggunaan.',
      demoUrl: 'https://example.com/smartsupply',
      repoUrl: 'https://github.com/example/smartsupply'
    }
  ],
  skills: [
    { name: 'React.js / Next.js', category: 'Frontend', level: 95 },
    { name: 'TypeScript / JavaScript', category: 'Language', level: 92 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 96 },
    { name: 'Node.js / Express', category: 'Backend', level: 85 },
    { name: 'PostgreSQL & Supabase', category: 'Database', level: 82 },
    { name: 'REST & GraphQL APIs', category: 'Backend', level: 88 },
    { name: 'Git & CI/CD Pipelines', category: 'DevOps', level: 84 },
    { name: 'UI/UX Design (Figma)', category: 'Design', level: 80 }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023'
    },
    {
      id: 'cert_2',
      name: 'Professional Scrum Master I (PSM I)',
      issuer: 'Scrum.org',
      year: '2022'
    }
  ],
  contact: {
    email: 'alex.pratama@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    linkedin: 'https://linkedin.com/in/alexpratama',
    github: 'https://github.com/alexpratama',
    website: 'https://alexpratama.dev',
    twitter: 'https://x.com/alexpratama'
  },
  design: {
    template: 'swiss-editorial',
    contentLanguage: 'id',
    primaryColor: '#2563eb',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    buttonStyle: 'rounded-xl',
    visibleSections: {
      about: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true,
      contact: true
    }
  }
};
