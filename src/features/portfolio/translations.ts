// Bilingual Translation Dictionary for Portfolio Templates
export type Language = 'id' | 'en';

export interface PortfolioDictionary {
  nav: {
    home: string;
    about: string;
    experience: string;
    education: string;
    projects: string;
    skills: string;
    certifications: string;
    contact: string;
  };
  hero: {
    statusAvailable: string;
    statusBusy: string;
    viewWork: string;
    getInTouch: string;
    downloadCv: string;
    scrollDown: string;
  };
  about: {
    title: string;
    subtitle: string;
    keyHighlights: string;
    moreAboutMe: string;
  };
  experience: {
    title: string;
    subtitle: string;
    present: string;
    keyAchievements: string;
  };
  education: {
    title: string;
    subtitle: string;
  };
  projects: {
    title: string;
    subtitle: string;
    liveDemo: string;
    sourceCode: string;
    keyResults: string;
    techStack: string;
    allProjects: string;
  };
  skills: {
    title: string;
    subtitle: string;
    proficiency: string;
  };
  certifications: {
    title: string;
    subtitle: string;
    issuedBy: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emailMe: string;
    callMe: string;
    location: string;
    sendEmail: string;
    copied: string;
    socials: string;
  };
  footer: {
    rightsReserved: string;
    builtWith: string;
    backToTop: string;
  };
  badges: {
    featured: string;
    currentRole: string;
    certified: string;
  };
}

export const PORTFOLIO_TRANSLATIONS: Record<Language, PortfolioDictionary> = {
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      experience: 'Pengalaman',
      education: 'Pendidikan',
      projects: 'Proyek',
      skills: 'Keahlian',
      certifications: 'Sertifikasi',
      contact: 'Kontak',
    },
    hero: {
      statusAvailable: 'Tersedia untuk proyek baru & peluang kerja',
      statusBusy: 'Fokus pada proyek berjalan',
      viewWork: 'Lihat Portofolio',
      getInTouch: 'Hubungi Saya',
      downloadCv: 'Unduh CV / Resume',
      scrollDown: 'Gulir ke bawah',
    },
    about: {
      title: 'Tentang Saya',
      subtitle: 'Dedikasi profesional, latar belakang, dan visi kerja.',
      keyHighlights: 'Sorotan Utama',
      moreAboutMe: 'Informasi Tambahan',
    },
    experience: {
      title: 'Pengalaman Kerja',
      subtitle: 'Rekam jejak karir dan kontribusi profesional.',
      present: 'Sekarang',
      keyAchievements: 'Pencapaian Utama:',
    },
    education: {
      title: 'Riwayat Pendidikan',
      subtitle: 'Landasan akademik dan kualifikasi formal.',
    },
    projects: {
      title: 'Proyek & Karya Pilihan',
      subtitle: 'Solusi nyata yang dirancang dan diimplementasikan.',
      liveDemo: 'Live Demo',
      sourceCode: 'Lihat Kode',
      keyResults: 'Hasil & Dampak:',
      techStack: 'Teknologi yang Digunakan',
      allProjects: 'Semua Proyek',
    },
    skills: {
      title: 'Keahlian & Kompetensi',
      subtitle: 'Penguasaan teknis dan keahlian spesialisasi.',
      proficiency: 'Tingkat Kemampuan',
    },
    certifications: {
      title: 'Sertifikasi & Lisensi',
      subtitle: 'Pengakuan kompetensi resmi dari institusi terpercaya.',
      issuedBy: 'Diterbitkan oleh',
    },
    contact: {
      title: 'Mari Terhubung',
      subtitle: 'Terbuka untuk kolaborasi, proyek freelance, dan peluang karir penuh waktu.',
      emailMe: 'Kirim Email',
      callMe: 'Telepon / WhatsApp',
      location: 'Lokasi',
      sendEmail: 'Kirim Pesan Sekarang',
      copied: 'Tersalin ke clipboard!',
      socials: 'Profil Sosial & Jaringan',
    },
    footer: {
      rightsReserved: 'Hak Cipta Dilindungi.',
      builtWith: 'Dibuat dengan Portfolio Studio',
      backToTop: 'Kembali ke Atas',
    },
    badges: {
      featured: 'Unggulan',
      currentRole: 'Posisi Aktif',
      certified: 'Terverifikasi',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      certifications: 'Certifications',
      contact: 'Contact',
    },
    hero: {
      statusAvailable: 'Available for new projects & opportunities',
      statusBusy: 'Currently engaged in ongoing projects',
      viewWork: 'Explore Projects',
      getInTouch: "Let's Connect",
      downloadCv: 'Download Resume',
      scrollDown: 'Scroll to explore',
    },
    about: {
      title: 'About Me',
      subtitle: 'Professional background, philosophy, and creative direction.',
      keyHighlights: 'Key Highlights',
      moreAboutMe: 'Beyond the Work',
    },
    experience: {
      title: 'Work Experience',
      subtitle: 'Career track record and high-impact contributions.',
      present: 'Present',
      keyAchievements: 'Key Milestones:',
    },
    education: {
      title: 'Education',
      subtitle: 'Academic background and formal foundations.',
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Practical solutions designed and shipped to production.',
      liveDemo: 'Live Demo',
      sourceCode: 'Source Code',
      keyResults: 'Impact & Results:',
      techStack: 'Technologies Used',
      allProjects: 'All Projects',
    },
    skills: {
      title: 'Skills & Capabilities',
      subtitle: 'Technical competencies and domain expertise.',
      proficiency: 'Proficiency Level',
    },
    certifications: {
      title: 'Certifications & Honors',
      subtitle: 'Verified credentials and industry qualifications.',
      issuedBy: 'Issued by',
    },
    contact: {
      title: "Let's Work Together",
      subtitle: 'Open for collaborations, freelance contracts, and full-time opportunities.',
      emailMe: 'Direct Email',
      callMe: 'Phone / Direct Line',
      location: 'Based in',
      sendEmail: 'Send a Message',
      copied: 'Copied to clipboard!',
      socials: 'Socials & Networks',
    },
    footer: {
      rightsReserved: 'All rights reserved.',
      builtWith: 'Created with Portfolio Studio',
      backToTop: 'Back to Top',
    },
    badges: {
      featured: 'Featured',
      currentRole: 'Current Role',
      certified: 'Verified',
    },
  },
};

export function getDictionary(lang: Language = 'id'): PortfolioDictionary {
  return PORTFOLIO_TRANSLATIONS[lang] || PORTFOLIO_TRANSLATIONS.id;
}
