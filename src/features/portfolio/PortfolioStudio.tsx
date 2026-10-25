import React, { useState, useEffect } from 'react';
import {
  PortfolioData,
  INITIAL_PORTFOLIO_DATA,
  BLANK_PORTFOLIO_DATA,
  PortfolioTemplateId,
} from './portfolioTypes';
import {
  generateProjectFiles,
  downloadProjectZip,
} from './projectGenerator';
import { FileExplorer } from './components/FileExplorer';
import { PortfolioFormEditor } from './components/PortfolioFormEditor';
import { AiBuilderPanel, PortfolioCheckpoint } from './components/AiBuilderPanel';
import { LivePreview } from './components/LivePreview';
import { ViewportMode } from './context/PortfolioViewportContext';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Sliders,
  FolderTree,
  Eye,
  Loader2,
  Layers,
  Sparkles,
  Wand2,
  X,
  Palette,
  MessageSquareCode,
  LayoutGrid,
} from 'lucide-react';

interface Props {
  onBackToApp: () => void;
}

const STORAGE_KEY = 'mkenzo_portfolio_project_v1';
const MODE_CHOSEN_KEY = 'mkenzo_portfolio_mode_chosen_v1';

export const PortfolioStudio: React.FC<Props> = ({ onBackToApp }) => {
  // Main Portfolio Data State
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.profile || parsed.isBlankCanvas)) return parsed;
      }
    } catch (e) {
      console.error('Failed reading saved portfolio data:', e);
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  // Creation Mode: 'template' (Mode A: By Template) | 'ai' (Mode B: Build with AI)
  const [creationMode, setCreationMode] = useState<'template' | 'ai'>('template');
  const [showModeSelectorModal, setShowModeSelectorModal] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(MODE_CHOSEN_KEY);
    } catch {
      return false;
    }
  });

  // Checkpoints for Safe Rollback & Recovery
  const [checkpoints, setCheckpoints] = useState<PortfolioCheckpoint[]>(() => [
    {
      id: 'cp_initial',
      label: 'Versi Awal (Stable)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: portfolioData,
    },
  ]);

  const [quickPromptText, setQuickPromptText] = useState<string>('');

  // Studio UI view modes
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [mobileTab, setMobileTab] = useState<'editor' | 'explorer' | 'preview'>('editor');
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const handleCreateCheckpoint = (label: string, customData?: PortfolioData) => {
    const newCp: PortfolioCheckpoint = {
      id: 'cp_' + Date.now(),
      label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: JSON.parse(JSON.stringify(customData || portfolioData)),
    };
    setCheckpoints((prev) => [newCp, ...prev.slice(0, 4)]);
  };

  const handleRestoreCheckpoint = (cp: PortfolioCheckpoint) => {
    handleCreateCheckpoint('Sebelum pemulihan');
    setPortfolioData(JSON.parse(JSON.stringify(cp.data)));
  };

  const handleResetToBlankCanvas = () => {
    handleCreateCheckpoint('Sebelum ke kanvas kosong');
    setPortfolioData(BLANK_PORTFOLIO_DATA);
  };

  // Auto-save effect
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
        setSaveStatus('saved');
      } catch (e) {
        console.error('Failed saving portfolio data:', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [portfolioData]);

  // Handle data updates directly from visual editor
  const handleDataChange = (updated: PortfolioData) => {
    setPortfolioData(updated);
  };

  // Generate virtual files for file explorer and zip exporter
  const projectFiles = generateProjectFiles(portfolioData);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip(portfolioData);
    } catch (e) {
      console.error('Failed downloading ZIP:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0e1014] text-gray-100 font-sans overflow-hidden select-none">
      {/* ================= TOP STUDIO NAVBAR ================= */}
      <header className="h-14 border-b border-white/5 bg-[#14161b] px-3 md:px-5 flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
            title="Kembali ke Beranda / Chat"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />

          {/* Project Name editable */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 hidden md:inline-block" />
            <input
              type="text"
              value={portfolioData.projectName}
              onChange={(e) =>
                handleDataChange({ ...portfolioData, projectName: e.target.value })
              }
              placeholder="Nama Project Portofolio"
              className="bg-transparent text-white font-bold text-xs sm:text-sm px-2 py-1 rounded-lg border border-transparent hover:border-white/10 focus:border-blue-500/60 focus:bg-white/5 outline-none truncate max-w-[140px] sm:max-w-[220px]"
            />
          </div>

          {/* Auto-save status */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-emerald-400/90 font-medium">Tersimpan otomatis</span>
              </>
            ) : (
              <>
                <Loader2 size={13} className="animate-spin text-blue-400" />
                <span>Menyimpan...</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Dual Mode Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Dual Mode Switcher: By Template vs Build with AI */}
          <div className="flex items-center bg-[#0a0b0e] p-1 rounded-xl border border-white/10 shadow-inner text-xs">
            <button
              type="button"
              onClick={() => {
                setCreationMode('template');
                try {
                  localStorage.setItem(MODE_CHOSEN_KEY, 'template');
                } catch {}
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                creationMode === 'template'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Mode A: Atur template dan visual form editor tanpa token AI"
            >
              <Sliders size={13} />
              <span className="hidden sm:inline">By Template</span>
              <span className="sm:hidden">Template</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCreationMode('ai');
                try {
                  localStorage.setItem(MODE_CHOSEN_KEY, 'ai');
                } catch {}
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                creationMode === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Mode B: Buat & revisi website melalui prompt AI tanpa batas"
            >
              <Sparkles size={13} className="text-purple-300" />
              <span className="hidden sm:inline">Build with AI</span>
              <span className="sm:hidden">AI Prompt</span>
            </button>
          </div>

          {/* Template Selector Dropdown */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#0e1014] px-2.5 py-1 rounded-xl border border-white/10 text-xs">
            <Layers size={13} className="text-amber-400" />
            <span className="text-gray-400 text-[11px]">Template:</span>
            <select
              value={portfolioData.design.template}
              onChange={(e) =>
                handleDataChange({
                  ...portfolioData,
                  design: {
                    ...portfolioData.design,
                    template: e.target.value as PortfolioTemplateId,
                  },
                })
              }
              className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer pr-1"
            >
              <option value="swiss-editorial" className="bg-[#1a1c22]">01. Swiss Editorial</option>
              <option value="creative-brutalist" className="bg-[#1a1c22]">02. Creative Brutalist</option>
              <option value="futuristic-digital" className="bg-[#1a1c22]">03. Futuristic Digital</option>
              <option value="immersive-creative" className="bg-[#1a1c22]">04. Immersive Creative</option>
              <option value="minimal-luxury" className="bg-[#1a1c22]">05. Minimal Luxury</option>
              <option value="bento-grid" className="bg-[#1a1c22]">06. Bento Grid</option>
              <option value="experimental-typography" className="bg-[#1a1c22]">07. Experimental Typography</option>
              <option value="interactive-developer" className="bg-[#1a1c22]">08. Interactive Developer</option>
            </select>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="hidden md:flex items-center bg-[#0e1014] p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() =>
                handleDataChange({
                  ...portfolioData,
                  design: {
                    ...portfolioData.design,
                    contentLanguage: 'id',
                  },
                })
              }
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                portfolioData.design.contentLanguage === 'id' || !portfolioData.design.contentLanguage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Bahasa Konten: Indonesia"
            >
              ID
            </button>
            <button
              type="button"
              onClick={() =>
                handleDataChange({
                  ...portfolioData,
                  design: {
                    ...portfolioData.design,
                    contentLanguage: 'en',
                  },
                })
              }
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                portfolioData.design.contentLanguage === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Content Language: English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Right: Download ZIP Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span className="hidden sm:inline">Mengompres...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download .zip</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM / TAB CONTROLS (for small screens) ================= */}
      <div className="md:hidden flex items-center justify-around bg-[#14161b] border-b border-white/5 p-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            mobileTab === 'editor'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {creationMode === 'ai' ? <Sparkles size={14} /> : <Sliders size={14} />}
          <span>{creationMode === 'ai' ? 'AI Builder' : 'Editor Form'}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('explorer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            mobileTab === 'explorer'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderTree size={14} />
          <span>Files</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          <span>Live Preview</span>
        </button>
      </div>

      {/* ================= 3-PANEL MAIN DESKTOP / ADAPTIVE LAYOUT ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel A: File Explorer (Desktop: 220px fixed / Mobile: conditioned) */}
        <div
          className={`w-64 shrink-0 h-full border-r border-white/5 transition-all ${
            mobileTab === 'explorer' ? 'block w-full' : 'hidden md:block'
          }`}
        >
          <FileExplorer
            files={projectFiles}
            onDownloadZip={handleDownload}
            isDownloading={isDownloading}
          />
        </div>

        {/* Panel B: Center Editor (Mode A: By Template OR Mode B: Build with AI) */}
        <div
          className={`flex-1 min-w-0 h-full border-r border-white/5 transition-all ${
            mobileTab === 'editor' ? 'block w-full' : 'hidden md:block'
          }`}
        >
          {creationMode === 'template' ? (
            <PortfolioFormEditor
              data={portfolioData}
              onChange={handleDataChange}
            />
          ) : (
            <AiBuilderPanel
              data={portfolioData}
              onChange={(updated) => {
                handleCreateCheckpoint('Revisi AI');
                handleDataChange(updated);
              }}
              onSwitchToTemplateMode={() => {
                setCreationMode('template');
                try {
                  localStorage.setItem(MODE_CHOSEN_KEY, 'template');
                } catch {}
              }}
              onResetToBlankCanvas={handleResetToBlankCanvas}
              checkpoints={checkpoints}
              onRestoreCheckpoint={handleRestoreCheckpoint}
              externalPrompt={quickPromptText}
              onClearExternalPrompt={() => setQuickPromptText('')}
            />
          )}
        </div>

        {/* Panel C: Right Live Realtime Preview (Desktop, Tablet, Mobile) */}
        <div
          className={`flex-1 min-w-0 h-full transition-all ${
            mobileTab === 'preview' ? 'block w-full' : 'hidden lg:block'
          }`}
        >
          <LivePreview
            data={portfolioData}
            viewportMode={viewportMode}
            onChangeViewport={setViewportMode}
            onQuickPrompt={(prompt) => {
              setCreationMode('ai');
              setQuickPromptText(prompt);
            }}
          />
        </div>
      </div>

      {/* ================= MODAL PEMILIHAN DUA MODE PEMBUATAN WEBSITE ================= */}
      {showModeSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#171920] border border-white/10 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
                  <Wand2 size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Portfolio Website Builder</h2>
                  <p className="text-xs text-gray-400">Pilih mode pembuatan website yang Anda sukai</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModeSelectorModal(false);
                  try {
                    localStorage.setItem(MODE_CHOSEN_KEY, creationMode);
                  } catch {}
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Anda dapat memilih salah satu mode di bawah ini untuk memulai. Anda juga dapat beralih antar mode kapan saja melalui tombol di bagian atas studio.
            </p>

            {/* Dua Pilihan Mode Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pilihan A: By Template */}
              <div
                onClick={() => {
                  setCreationMode('template');
                  setShowModeSelectorModal(false);
                  try {
                    localStorage.setItem(MODE_CHOSEN_KEY, 'template');
                  } catch {}
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  creationMode === 'template'
                    ? 'bg-blue-950/30 border-blue-500/80 ring-2 ring-blue-500/30'
                    : 'bg-[#1e2029] border-white/10 hover:border-blue-500/50 hover:bg-[#232632]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Sliders size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      0 Token AI
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      A. By Template
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Pilih dari 8 template modern dan sesuaikan seluruh tampilan website melalui kontrol visual manual.
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-gray-300 pt-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>8 Template premium responsif</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Kontrol font, warna, dan layout</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Pengeditan instan tanpa kuota AI</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/25"
                >
                  Pilih Mode Template
                </button>
              </div>

              {/* Pilihan B: Build with AI (Desain Sendiri / Blank Canvas) */}
              <div
                onClick={() => {
                  setCreationMode('ai');
                  // User chose to create their own design -> give clean blank canvas without preloaded template
                  setPortfolioData(BLANK_PORTFOLIO_DATA);
                  setShowModeSelectorModal(false);
                  try {
                    localStorage.setItem(MODE_CHOSEN_KEY, 'ai');
                  } catch {}
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  creationMode === 'ai'
                    ? 'bg-purple-950/30 border-purple-500/80 ring-2 ring-purple-500/30'
                    : 'bg-[#1e2029] border-white/10 hover:border-purple-500/50 hover:bg-[#232632]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Sparkles size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      Revisi Tanpa Batas
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      B. Build with AI
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Jelaskan konsep website impian Anda melalui prompt percakapan. AI akan merancang dan merevisi secara fleksibel.
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-gray-300 pt-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Revisi berulang kali tanpa batas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Progress tracker real-time 5 tahap</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Ringkasan poin perubahan nyata</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/25"
                >
                  Pilih Build with AI
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400 border-t border-white/5">
              <span>Kedua mode dilengkapi Live Preview responsif & Download ZIP.</span>
              <button
                type="button"
                onClick={() => {
                  setShowModeSelectorModal(false);
                  try {
                    localStorage.setItem(MODE_CHOSEN_KEY, creationMode);
                  } catch {}
                }}
                className="text-gray-300 hover:text-white font-semibold underline underline-offset-2 cursor-pointer"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
