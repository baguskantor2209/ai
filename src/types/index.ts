export interface ExperienceItem {
  position: string;
  company: string;
  year: string;
  desc: string;
  aiDesc?: boolean;
}

export interface SkillItem {
  name: string;
  percentage: number;
}

export interface EducationItem {
  level: string;
  school: string;
  year: string;
  major: string;
  isFixed?: boolean;
}

export interface ProjectItem {
  name: string;
  desc: string;
}

export interface AwardItem {
  name: string;
  issuer: string;
  year?: string;
}

export interface CvData {
  titleCV: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  profileImage: string;
  linkedin: string;
  website: string;
  notWorking: boolean;
  experience: ExperienceItem[];
  profile: string;
  aiProfile?: boolean;
  skills: SkillItem[];
  aiSkills?: boolean;
  education: EducationItem[];
  awards: AwardItem[];
  noProject: boolean;
  projects: ProjectItem[];
}

export interface LetterData {
  tanggalSurat: string;
  namaPerusahaan: string;
  alamatPerusahaan: string;
  posisiDilamar: string;
  nama: string;
  ttl: string;
  jenisKelamin: string;
  alamat: string;
  phone: string;
  email: string;
  pendidikanTerakhir: string;
  keahlianTools?: string;
  pencapaianSpesifik?: string;
  paragrafKualifikasi?: string;
  aiParagraf?: boolean;
  lampiran: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionForm?: number | null; // 1: Data Diri, 2: Pekerjaan & Skill, 3: Edukasi, 4: Surat Lamaran
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  mode: 'cv' | 'letter' | 'general';
  isDocumentMode?: boolean;
  language?: 'id' | 'en';
  colorTone?: string;
  templateId?: string;
  cvData: CvData;
  letterData: LetterData;
}
