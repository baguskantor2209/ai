import React, { useState } from 'react';
import { callPortfolioAI, PortfolioAiRequest } from '../portfolioAiService';
import {
  Sparkles,
  Wand2,
  Languages,
  Check,
  RefreshCw,
  X,
  Loader2,
  ArrowRight,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';

export interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string, field?: string) => void;
  initialMode?: 'write' | 'improve' | 'translate';
  initialField?: 'headline' | 'about' | 'experience' | 'project' | 'skills' | 'cta';
  initialText?: string;
  userProfession?: string;
  portfolioLang?: 'id' | 'en';
}

export const AiWritingModal: React.FC<AiModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialMode = 'write',
  initialField = 'headline',
  initialText = '',
  userProfession = 'Full-Stack Developer',
  portfolioLang = 'id',
}) => {
  const [mode, setMode] = useState<'write' | 'improve' | 'translate'>(initialMode);
  const [field, setField] = useState<'headline' | 'about' | 'experience' | 'project' | 'skills' | 'cta'>(initialField);
  const [profession, setProfession] = useState<string>(userProfession || 'Software Engineer');
  const [currentText, setCurrentText] = useState<string>(initialText);
  const [tone, setTone] = useState<'Professional' | 'Concise' | 'Confident' | 'Creative' | 'Friendly'>('Professional');
  const [length, setLength] = useState<'Short' | 'Balanced' | 'Detailed'>('Balanced');
  const [targetLang, setTargetLang] = useState<'id' | 'en'>(portfolioLang === 'id' ? 'en' : 'id');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const payload: PortfolioAiRequest = {
        action: mode,
        field,
        profession,
        currentText,
        tone,
        length,
        language: portfolioLang,
        sourceLang: targetLang === 'en' ? 'id' : 'en',
        targetLang,
      };

      const result = await callPortfolioAI(payload);
      setGeneratedText(result);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Gagal memproses AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedText) return;
    onApply(generatedText, field);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#14161d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#191c25] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Portfolio Copywriter</h3>
              <p className="text-[11px] text-slate-400">
                Penyempurnaan teks portofolio kontekstual & profesional
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-white/10 bg-[#12141a] px-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('write'); setGeneratedText(''); }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              mode === 'write'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 size={14} />
            <span>Tulis dengan AI</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('improve'); setGeneratedText(''); }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              mode === 'improve'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Perbaiki dengan AI</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('translate'); setGeneratedText(''); }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              mode === 'translate'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Languages size={14} />
            <span>Terjemahkan (ID ↔ EN)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Profession input: Contextual Anchor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Profesi / Bidang Keahlian:
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="contoh: Senior Full-Stack Engineer, Data Analyst, UI/UX Designer..."
              className="w-full bg-[#1c1f2a] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>

          {/* Mode 1: AI WRITE */}
          {mode === 'write' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Bagian yang Ingin Ditulis:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'headline', label: 'Headline / Tagline' },
                    { id: 'about', label: 'Tentang Saya (Bio)' },
                    { id: 'experience', label: 'Pengalaman & Capaian' },
                    { id: 'project', label: 'Deskripsi Proyek' },
                    { id: 'skills', label: 'Rekomendasi Keahlian' },
                    { id: 'cta', label: 'Call to Action (CTA)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setField(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        field === item.id
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: AI IMPROVE */}
          {mode === 'improve' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Teks Asli yang Ingin Ditingkatkan:
                </label>
                <textarea
                  rows={3}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Tempel atau ketik teks portofolio Anda di sini..."
                  className="w-full bg-[#1c1f2a] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Nada Bahasa (Tone):
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full bg-[#1c1f2a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Professional">Professional (Resmi & Berbobot)</option>
                    <option value="Concise">Concise (Padat & Ringkas)</option>
                    <option value="Confident">Confident (Meyakinkan & Kuat)</option>
                    <option value="Creative">Creative (Kreatif & Inspiratif)</option>
                    <option value="Friendly">Friendly (Ramah & Hangat)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Panjang Teks:
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="w-full bg-[#1c1f2a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Short">Short (Singkat & To the point)</option>
                    <option value="Balanced">Balanced (Seimbang & Proporsional)</option>
                    <option value="Detailed">Detailed (Komprehensif & Mendalam)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: TRANSLATE */}
          {mode === 'translate' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">Target Bahasa:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetLang('id')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetLang === 'id'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Bahasa Indonesia (ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetLang === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Teks yang Ingin Diterjemahkan:
                </label>
                <textarea
                  rows={3}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Ketik teks yang ingin diterjemahkan..."
                  className="w-full bg-[#1c1f2a] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Generate Button Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/25"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Memproses dengan AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>
                    {mode === 'write'
                      ? 'Buat Teks Sekarang'
                      : mode === 'improve'
                      ? 'Perbaiki Teks Sekarang'
                      : 'Terjemahkan Sekarang'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Error notice if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedText && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check size={14} />
                  <span>Hasil Rekomendasi AI:</span>
                </span>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1014] border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {generatedText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#191c25] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!generatedText}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Check size={14} />
            <span>Terapkan ke Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
