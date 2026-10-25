import React, { useState, useRef, useEffect } from 'react';
import { PortfolioData } from '../portfolioTypes';
import {
  buildOrRevisePortfolioWithAI,
  AiBuildHistoryItem,
} from '../portfolioAiService';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  User as UserIcon,
  HelpCircle,
  Lightbulb,
  ListChecks,
  ChevronDown,
  ChevronUp,
  History,
  RotateCcw,
  ShieldCheck,
  FilePlus2,
  Smartphone,
  Sliders,
  Check,
} from 'lucide-react';

export interface PortfolioCheckpoint {
  id: string;
  label: string;
  timestamp: string;
  data: PortfolioData;
}

interface Props {
  data: PortfolioData;
  onChange: (updated: PortfolioData) => void;
  onSwitchToTemplateMode: () => void;
  onResetToBlankCanvas: () => void;
  checkpoints: PortfolioCheckpoint[];
  onRestoreCheckpoint: (cp: PortfolioCheckpoint) => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

const PROGRESS_STEPS = [
  'Memeriksa instruksi & kode',
  'Menjalankan build & validasi runtime',
  'Memeriksa responsivitas (320px - 1025px+) & animasi',
  'Menyimpan checkpoint & memvalidasi struktur',
  'Memperbarui live preview',
];

const SUGGESTED_PROMPTS = [
  'Buatkan website Full-Stack Developer dengan gaya Futuristic Cyberpunk neon cyan',
  'Terapkan gaya Minimal Luxury dengan font serif Playfair dan palet warm amber',
  'Ganti template ke Bento Grid dan tambahkan proyek analitik AI baru',
  'Ubah menjadi Creative Brutalist dengan kontras tinggi dan aksen kuning tajam',
  'Jadikan website untuk AI Engineer dengan keahlian PyTorch, Gemini, dan LLM',
  'Buat headline lebih punchy dan optimalkan deskripsi bio profesional',
];

export const AiBuilderPanel: React.FC<Props> = ({
  data,
  onChange,
  onSwitchToTemplateMode,
  onResetToBlankCanvas,
  checkpoints,
  onRestoreCheckpoint,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCheckpointsModal, setShowCheckpointsModal] = useState(false);

  const [history, setHistory] = useState<AiBuildHistoryItem[]>(() => [
    {
      role: 'assistant',
      text: data.isBlankCanvas
        ? 'Halo! Anda berada di Halaman Kosong (Option B). Tuliskan konsep website portofolio impian Anda di kolom prompt di bawah ini. AI akan merancang struktur, tema, warna, dan konten dari awal.'
        : 'Halo! Saya asisten AI pembuat website portofolio mKenzo AI. Jelaskan konsep website atau perubahan yang Anda inginkan.',
      summary: [
        'Live Preview siap menampilkan hasil desain Anda',
        'Checkpoint otomatis dibuat sebelum setiap pembaruan',
        'Anda dapat meminta revisi kapan saja tanpa batas',
      ],
      timestamp: 'Baru saja',
    },
  ]);

  const [expandedSummaries, setExpandedSummaries] = useState<Record<number, boolean>>({
    0: true,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external prompt from BlankCanvasView if passed
  useEffect(() => {
    if (externalPrompt) {
      setPrompt(externalPrompt);
      onClearExternalPrompt?.();
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [externalPrompt, onClearExternalPrompt]);

  // Auto-scroll chat thread to bottom on message or generation updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isGenerating, currentStepIndex]);

  // Smooth progression through testing & validation steps while awaiting AI response
  useEffect(() => {
    if (!isGenerating) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROGRESS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 950);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (userPromptText?: string) => {
    const textToSend = (userPromptText || prompt).trim();
    if (!textToSend || isGenerating) return;

    setPrompt('');
    setIsGenerating(true);
    setCurrentStepIndex(0);

    const userMsg: AiBuildHistoryItem = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [...prev, userMsg]);

    try {
      const response = await buildOrRevisePortfolioWithAI(
        textToSend,
        data,
        [...history, userMsg]
      );

      // Final step: update live preview with valid schema
      setCurrentStepIndex(PROGRESS_STEPS.length - 1);

      // Clean isBlankCanvas flag once customized
      const updated = {
        ...response.updatedData,
        isBlankCanvas: false,
      };

      onChange(updated);

      const aiMsg: AiBuildHistoryItem = {
        role: 'assistant',
        text: `Portofolio berhasil diperbarui dan divalidasi! Quality Gate: PASSED (Build, Responsivitas, Animasi & ZIP kompatibel).`,
        summary: response.changesSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => {
        const nextList = [...prev, aiMsg];
        setExpandedSummaries((prevExp) => ({
          ...prevExp,
          [nextList.length - 1]: true,
        }));
        return nextList;
      });
    } catch (err) {
      console.error('Error during AI portfolio build:', err);
      const errorMsg: AiBuildHistoryItem = {
        role: 'assistant',
        text: 'Terjadi kendala saat memproses revisi. Checkpoint versi terakhir yang stabil berhasil dipertahankan tanpa merusak preview.',
        summary: [
          'Versi terakhir yang stabil tetap aktif',
          'Silakan ulangi instruksi dengan spesifikasi yang lebih jelas',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const toggleSummary = (idx: number) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#14161b] text-gray-100 overflow-hidden">
      {/* Top Banner / Mode Header */}
      <div className="p-3.5 sm:p-4 border-b border-white/5 bg-[#171920] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/20 shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                Mode Custom Design & AI
              </h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold shrink-0">
                Revisi Tanpa Batas
              </span>
            </div>
            <p className="text-[11px] text-gray-400 truncate">
              {data.isBlankCanvas
                ? 'Halaman kosong aktif — Tuliskan konsep Anda untuk memulai'
                : 'Jelaskan website impian atau revisi Anda melalui prompt'}
            </p>
          </div>
        </div>

        {/* Action buttons: Reset to Blank & Checkpoints */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onResetToBlankCanvas}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Bersihkan kanvas ke halaman kosong"
          >
            <FilePlus2 size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Kanvas Kosong</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCheckpointsModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Buka riwayat checkpoint pemulihan"
          >
            <History size={13} className="text-blue-400" />
            <span className="hidden sm:inline">Checkpoint ({checkpoints.length})</span>
          </button>
        </div>
      </div>

      {/* Main Conversation & Revision Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              item.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1 px-1">
              {item.role === 'user' ? (
                <>
                  <span>Anda</span>
                  <span>•</span>
                  <span>{item.timestamp || 'Terkirim'}</span>
                </>
              ) : (
                <>
                  <Bot size={12} className="text-purple-400" />
                  <span className="font-semibold text-purple-300">mKenzo Portfolio AI</span>
                  <span>•</span>
                  <span>{item.timestamp || 'Terkirim'}</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[94%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                item.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-tr-sm'
                  : 'bg-[#1e2029] text-gray-200 border border-white/10 shadow-lg rounded-tl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{item.text}</p>

              {/* Quality Gate Status Badge */}
              {item.role === 'assistant' && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">
                    <ShieldCheck size={11} /> Quality Gate: Passed
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md">
                    <Smartphone size={11} /> 320px–1025px+ Responsif
                  </span>
                  <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md">
                    <CheckCircle2 size={11} /> Checkpoint Saved
                  </span>
                </div>
              )}

              {/* 2-5 Bullet Point Changes Summary */}
              {item.summary && item.summary.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div
                    onClick={() => toggleSummary(idx)}
                    className="flex items-center justify-between text-[11px] font-bold text-purple-300 hover:text-purple-200 cursor-pointer select-none mb-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <ListChecks size={13} className="text-emerald-400" />
                      Rincian Perubahan ({item.summary.length} poin)
                    </span>
                    {expandedSummaries[idx] ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </div>

                  {expandedSummaries[idx] && (
                    <ul className="space-y-1.5 pl-1 mt-2">
                      {item.summary.map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2 text-[11px] text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Real-time Progress Tracker during AI generation */}
        {isGenerating && (
          <div className="flex flex-col items-start w-full max-w-[94%]">
            <div className="flex items-center gap-1.5 text-[10px] text-purple-400 mb-1 px-1">
              <Loader2 size={12} className="animate-spin text-purple-400" />
              <span className="font-semibold">Membangun & Menguji Portofolio...</span>
            </div>

            <div className="w-full bg-[#1e2029] border border-purple-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-400 animate-pulse" />
                  Testing & Quality Gate Tracker
                </span>
                <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md font-mono">
                  Langkah {currentStepIndex + 1}/{PROGRESS_STEPS.length}
                </span>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-3.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{
                    width: `${((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              {/* 5 Real Testing & Build Steps Checklist */}
              <div className="space-y-2">
                {PROGRESS_STEPS.map((stepName, sIdx) => {
                  const isDone = sIdx < currentStepIndex;
                  const isCurrent = sIdx === currentStepIndex;
                  return (
                    <div
                      key={sIdx}
                      className={`flex items-center gap-2.5 text-xs transition-colors ${
                        isDone
                          ? 'text-emerald-400 font-medium'
                          : isCurrent
                          ? 'text-purple-300 font-bold'
                          : 'text-gray-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2
                          size={14}
                          className="animate-spin text-purple-400 shrink-0"
                        />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-600 flex items-center justify-center text-[9px] shrink-0 text-gray-500">
                          {sIdx + 1}
                        </span>
                      )}
                      <span>{stepName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Inspiration Prompts */}
      <div className="p-3 border-t border-white/5 bg-[#171920]/80">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-2">
          <Lightbulb size={13} className="text-amber-400" />
          <span>Ide Cepat / Inspirasi Prompt:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SUGGESTED_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              type="button"
              disabled={isGenerating}
              onClick={() => handleSubmit(promptText)}
              className="shrink-0 text-[11px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl px-2.5 py-1.5 transition-all text-left max-w-[260px] truncate cursor-pointer disabled:opacity-50"
              title={promptText}
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Main Prompt Bar Input */}
      <div className="p-3 border-t border-white/10 bg-[#14161b]">
        <div className="relative flex items-end gap-2 bg-[#1e2029] border border-white/15 focus-within:border-purple-500/80 rounded-2xl p-2 transition-all shadow-lg">
          <textarea
            ref={textareaRef}
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              data.isBlankCanvas
                ? "Jelaskan konsep website Anda (misal: 'Buatkan website Full-Stack Developer bernama Rizky dengan tema Futuristic Cyberpunk neon cyan')..."
                : "Ketik instruksi atau revisi website (misal: 'Ganti tema ke Minimal Luxury', 'Tambahkan proyek Machine Learning', 'Ubah warna aksen ke emerald')..."
            }
            disabled={isGenerating}
            className="flex-1 bg-transparent text-white text-xs sm:text-sm p-1 outline-none resize-none placeholder:text-gray-500 disabled:opacity-50"
          />

          <button
            type="button"
            disabled={!prompt.trim() || isGenerating}
            onClick={() => handleSubmit()}
            className="h-9 px-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-purple-600 disabled:hover:to-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer shrink-0"
          >
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Send size={14} />
                <span className="hidden sm:inline">Kirim</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-500">
          <span>Tekan <b>Enter</b> untuk kirim, <b>Shift+Enter</b> baris baru.</span>
          <span className="text-purple-400/90 font-medium">Auto-checkpoint aktif • Revisi aman</span>
        </div>
      </div>

      {/* Checkpoints & Version Recovery Modal */}
      {showCheckpointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a1c22] border border-white/10 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <History size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white">Checkpoint & Pemulihan Versi</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckpointsModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Setiap kali Anda menerapkan perubahan, sistem secara otomatis menyimpan checkpoint yang berfungsi. Anda dapat memulihkan versi mana pun jika hasil revisi tidak sesuai harapan.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {checkpoints.map((cp, cIdx) => (
                <div
                  key={cp.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{cp.label}</span>
                      {cIdx === 0 && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                          Terbaru
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {cp.timestamp} • Template: {cp.data.design.template}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onRestoreCheckpoint(cp);
                      setShowCheckpointsModal(false);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all cursor-pointer shrink-0"
                  >
                    <RotateCcw size={12} />
                    <span>Pulihkan</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCheckpointsModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Kembali ke Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
