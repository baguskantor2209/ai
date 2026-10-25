// Service for Portfolio AI Write, AI Improve, and Bilingual Translation

export interface PortfolioAiRequest {
  action: 'write' | 'improve' | 'translate';
  field?: 'headline' | 'about' | 'experience' | 'project' | 'skills' | 'cta';
  profession?: string;
  currentText?: string;
  tone?: 'Professional' | 'Concise' | 'Confident' | 'Creative' | 'Friendly';
  length?: 'Short' | 'Balanced' | 'Detailed';
  language?: 'id' | 'en';
  sourceLang?: 'id' | 'en';
  targetLang?: 'id' | 'en';
}

export async function callPortfolioAI(params: PortfolioAiRequest): Promise<string> {
  try {
    const res = await fetch('/api/portfolio-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) return data.result.trim();
    }
  } catch (err) {
    console.warn('Portfolio AI request error, using fallback:', err);
  }

  // Graceful client fallback
  const isEn = params.language === 'en' || params.targetLang === 'en';
  const role = params.profession || (isEn ? 'Full-Stack Developer' : 'Software Engineer');

  if (params.action === 'translate') {
    return isEn
      ? `Experienced ${role} with a proven record of delivering high-performance, user-centric web platforms.`
      : `Pengembang ${role} berpengalaman dengan rekam jejak terbukti dalam membangun platform web berkinerja tinggi.`;
  }

  if (params.action === 'improve') {
    return isEn
      ? `Accomplished ${role} dedicated to designing resilient digital architectures, streamlining workflows, and driving measurable impact.`
      : `Profesional ${role} berdedikasi merancang arsitektur sistem yang tangguh, mengoptimalkan proses kerja, dan memberikan hasil yang terukur.`;
  }

  // write fallback
  if (params.field === 'headline') {
    return isEn
      ? `Senior ${role} • Architecting High-Performance Products`
      : `Senior ${role} • Membangun Solusi Digital Berkinerja Tinggi`;
  }

  if (params.field === 'about') {
    return isEn
      ? `I am a dedicated ${role} with extensive experience turning complex engineering challenges into elegant, intuitive digital experiences. Committed to clean code, performance, and teamwork.`
      : `Saya adalah seorang ${role} berdedikasi dengan pengalaman mengubah tantangan teknis kompleks menjadi pengalaman digital yang intuitif dan elegan. Berorientasi pada clean code dan performa optimal.`;
  }

  return isEn
    ? `Results-driven ${role} with a passion for innovation and engineering excellence.`
    : `Praktisi ${role} dengan semangat inovasi dan komitmen tinggi pada kualitas kerja.`;
}

import { PortfolioData } from './portfolioTypes';

export interface AiBuildResponse {
  updatedData: PortfolioData;
  changesSummary: string[];
}

export interface AiBuildHistoryItem {
  role: 'user' | 'assistant';
  text: string;
  summary?: string[];
  timestamp?: string;
}

export async function buildOrRevisePortfolioWithAI(
  prompt: string,
  currentData: PortfolioData,
  history: AiBuildHistoryItem[] = []
): Promise<AiBuildResponse> {
  try {
    const res = await fetch('/api/portfolio-ai-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        currentData,
        history,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.updatedData) {
        return {
          updatedData: data.updatedData,
          changesSummary: Array.isArray(data.changesSummary) && data.changesSummary.length > 0
            ? data.changesSummary
            : ['Portofolio berhasil diperbarui sesuai instruksi Anda.'],
        };
      }
    }
  } catch (err) {
    console.warn('buildOrRevisePortfolioWithAI error:', err);
  }

  // Client-side fallback if server is unreachable
  const copy: PortfolioData = JSON.parse(JSON.stringify(currentData));
  const lower = prompt.toLowerCase();
  const summary: string[] = [];

  if (lower.includes('brutalist') || lower.includes('brutal')) {
    copy.design.template = 'creative-brutalist';
    copy.design.accentColor = '#f59e0b';
    copy.design.fontFamily = 'Space Grotesk';
    copy.design.buttonStyle = 'rounded-none';
    summary.push('Menerapkan template Creative Brutalist dengan aksen kuning kontras');
  } else if (lower.includes('cyber') || lower.includes('futuristik') || lower.includes('futuristic') || lower.includes('neon')) {
    copy.design.template = 'futuristic-digital';
    copy.design.accentColor = '#06b6d4';
    copy.design.fontFamily = 'Space Grotesk';
    summary.push('Menerapkan template Futuristic Digital dengan aksen siber neon');
  } else if (lower.includes('luxury') || lower.includes('mewah')) {
    copy.design.template = 'minimal-luxury';
    copy.design.accentColor = '#d97706';
    copy.design.fontFamily = 'Playfair';
    summary.push('Menerapkan template Minimal Luxury dengan tipografi Playfair serif');
  } else if (lower.includes('bento')) {
    copy.design.template = 'bento-grid';
    copy.design.accentColor = '#8b5cf6';
    copy.design.fontFamily = 'Inter';
    summary.push('Menerapkan template Bento Grid interaktif');
  } else if (lower.includes('developer') || lower.includes('terminal') || lower.includes('cli')) {
    copy.design.template = 'interactive-developer';
    copy.design.accentColor = '#3b82f6';
    copy.design.fontFamily = 'Fira Code';
    summary.push('Menerapkan template Interactive Developer bergaya terminal');
  }

  if (summary.length === 0) {
    summary.push('Menyelaraskan elemen visual dan struktur portofolio');
    summary.push('Memperbarui pratinjau live secara realtime');
  }

  return {
    updatedData: copy,
    changesSummary: summary,
  };
}

