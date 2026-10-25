import React from 'react';
import {
  Sparkles,
  Layout,
  Palette,
  FileCode,
  Layers,
  ArrowRight,
  Lightbulb,
  MousePointerClick,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onQuickPrompt?: (promptText: string) => void;
}

const CANVAS_IDEAS = [
  {
    title: 'Futuristic Cyberpunk Developer',
    desc: 'Dark mode dengan aksen cyan & ungu neon, terminal HUD, dan proyek cloud.',
    prompt: 'Buatkan website portofolio Full-Stack Developer dengan gaya Futuristic Digital, aksen neon cyan #06b6d4, font Space Grotesk, dan 3 proyek web skala besar.',
  },
  {
    title: 'Minimal Luxury Architect',
    desc: 'Estetika hangat ivory/charcoal, tipografi serif Playfair, dan galeri minimalis.',
    prompt: 'Buatkan website portofolio Arsitek & Interior Designer bergaya Minimal Luxury, tipografi Playfair serif, palet warm amber mewah, dan biografi elegan.',
  },
  {
    title: 'Creative Director Brutalist',
    desc: 'Tipografi ekstra besar, border tebal hitam, aksen kuning tajam, dan micro-interactions.',
    prompt: 'Rancang website portofolio Creative Director bergaya Creative Brutalist dengan border tebal, hard shadow pop-up, font Space Grotesk, dan aksen kuning kontras.',
  },
  {
    title: 'Product Manager Bento Grid',
    desc: 'Kartu bento interaktif, visual metrik dampak produk, dan tata letak multi-dimensi.',
    prompt: 'Buat portofolio Product Manager dengan modul Bento Grid interaktif, aksen ungu modern, sorotan kepemimpinan tim, dan studi kasus produk.',
  },
];

export const BlankCanvasView: React.FC<Props> = ({ onQuickPrompt }) => {
  return (
    <div className="min-h-full w-full bg-[#0d0f14] text-gray-200 p-6 sm:p-10 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Background blueprint grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f243015_1px,transparent_1px),linear-gradient(to_bottom,#1f243015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Bar Wireframe Header */}
      <div className="relative z-10 flex items-center justify-between pb-6 border-b border-dashed border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Layout size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span>Halaman Kosong Kustom</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </span>
            <p className="text-[11px] text-gray-400">Mode Desain Sendiri (Option B) • Tanpa Template Bawaan</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
            Status: Menunggu Prompt
          </span>
        </div>
      </div>

      {/* Central Hero Wireframe Card */}
      <div className="relative z-10 max-w-3xl mx-auto my-8 sm:my-12 w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-blue-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner">
          <Sparkles size={14} className="text-purple-400 animate-pulse" />
          <span>Kanvas Kosong Siap Dirancang Dari Nol</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Jabarkan Ide Website Portofolio Impian Anda
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Anda memilih untuk mendesain website sendiri. Kami menyediakan kanvas kosong ini agar Anda bebas menentukan profesi, gaya estetika, kombinasi warna, struktur section, serta fitur yang Anda inginkan.
          </p>
        </div>

        {/* Wireframe Slot Mockups */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl mx-auto text-left">
          <div className="p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-between h-24">
            <span className="text-[10px] font-mono text-purple-400 font-semibold">[01. Hero & Bio]</span>
            <p className="text-[11px] text-gray-400">Headline, nama, typewriter & foto profil</p>
          </div>
          <div className="p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-between h-24">
            <span className="text-[10px] font-mono text-blue-400 font-semibold">[02. Proyek Pilihan]</span>
            <p className="text-[11px] text-gray-400">Showcase karya, demo link & tech stack</p>
          </div>
          <div className="p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-between h-24">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">[03. Keahlian]</span>
            <p className="text-[11px] text-gray-400">Matriks skill, level & sertifikasi</p>
          </div>
          <div className="p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-between h-24">
            <span className="text-[10px] font-mono text-amber-400 font-semibold">[04. Kontak]</span>
            <p className="text-[11px] text-gray-400">Social channels & tombol CTA interaktif</p>
          </div>
        </div>

        {/* Quick Idea Starters */}
        <div className="pt-4 text-left bg-[#14161d] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-400" />
              Inspirasi Konsep Awal (Klik untuk langsung gunakan):
            </span>
            <span className="text-[10px] text-gray-500 font-mono">1-Click Starter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CANVAS_IDEAS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickPrompt?.(item.prompt)}
                className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group flex items-start justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-200 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.desc}</p>
                </div>
                <ArrowRight size={13} className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pt-4 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
        <span className="flex items-center gap-1.5">
          <MousePointerClick size={13} className="text-purple-400" />
          Ketik prompt di panel kiri untuk mulai membangun desain kustom Anda.
        </span>
        <span className="text-purple-400 font-medium">
          Ditenagai AI Studio Architect • Revisi tanpa batas
        </span>
      </div>
    </div>
  );
};
