import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PortfolioData } from '../portfolioTypes';
import { SwissEditorialView } from '../templates/SwissEditorialView';
import { CreativeBrutalistView } from '../templates/CreativeBrutalistView';
import { FuturisticDigitalView } from '../templates/FuturisticDigitalView';
import { ImmersiveCreativeView } from '../templates/ImmersiveCreativeView';
import { MinimalLuxuryView } from '../templates/MinimalLuxuryView';
import { BentoGridView } from '../templates/BentoGridView';
import { ExperimentalTypographyView } from '../templates/ExperimentalTypographyView';
import { InteractiveDeveloperView } from '../templates/InteractiveDeveloperView';
import { ModernProfessionalView } from '../templates/ModernProfessionalView';
import { CleanElegantView } from '../templates/CleanElegantView';
import { CreativeBoldView } from '../templates/CreativeBoldView';
import { BlankCanvasView } from './BlankCanvasView';
import { PortfolioViewportProvider, ViewportMode } from '../context/PortfolioViewportContext';

interface Props {
  data: PortfolioData;
  viewportMode: ViewportMode;
  onChangeViewport: (mode: ViewportMode) => void;
  onQuickPrompt?: (promptText: string) => void;
}

export const LivePreview: React.FC<Props> = ({
  data,
  viewportMode,
  onChangeViewport,
  onQuickPrompt,
}) => {
  const [zoom, setZoom] = useState<number>(100);

  const renderActiveTemplate = (mode: ViewportMode) => {
    if (data.isBlankCanvas) {
      return (
        <PortfolioViewportProvider mode={mode}>
          <BlankCanvasView onQuickPrompt={onQuickPrompt} />
        </PortfolioViewportProvider>
      );
    }

    const templateEl = (() => {
      switch (data.design.template) {
        case 'swiss-editorial':
          return <SwissEditorialView data={data} />;
        case 'creative-brutalist':
          return <CreativeBrutalistView data={data} />;
        case 'futuristic-digital':
          return <FuturisticDigitalView data={data} />;
        case 'immersive-creative':
          return <ImmersiveCreativeView data={data} />;
        case 'minimal-luxury':
          return <MinimalLuxuryView data={data} />;
        case 'bento-grid':
          return <BentoGridView data={data} />;
        case 'experimental-typography':
          return <ExperimentalTypographyView data={data} />;
        case 'interactive-developer':
          return <InteractiveDeveloperView data={data} />;
        // Legacy compatibility
        case 'elegant':
          return <CleanElegantView data={data} />;
        case 'creative':
          return <CreativeBoldView data={data} />;
        case 'modern':
        default:
          return <SwissEditorialView data={data} />;
      }
    })();

    return (
      <PortfolioViewportProvider mode={mode}>
        {templateEl}
      </PortfolioViewportProvider>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#111215] text-gray-200 overflow-hidden">
      {/* Live Preview Controls Header */}
      <div className="px-3 sm:px-4 py-2.5 border-b border-white/5 bg-[#17181c] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Realtime Preview</span>
          </div>
          <span className="text-[11px] text-gray-400 hidden xl:inline capitalize truncate">
            ({data.design.template} Template)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Zoom controls */}
          <div className="hidden lg:flex items-center bg-white/5 rounded-lg border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(60, prev - 10))}
              className="p-1.5 hover:text-white text-gray-400"
              title="Perkecil"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-1 text-[11px] font-mono text-gray-300 select-none">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(130, prev + 10))}
              className="p-1.5 hover:text-white text-gray-400"
              title="Perbesar"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="p-1.5 hover:text-white text-gray-400 border-l border-white/10"
              title="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Device viewport toggle: Desktop, Tablet, Mobile */}
          <div className="flex items-center bg-[#0d0e11] rounded-xl p-1 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => onChangeViewport('desktop')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewportMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Tampilan Desktop (1025px+)"
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewport('tablet')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewportMode === 'tablet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Tampilan Tablet (768px - 834px)"
            >
              <Tablet size={14} />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewport('mobile')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Tampilan Smartphone (375px - 430px)"
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-3 sm:p-5 md:p-6 flex items-start justify-center bg-[radial-gradient(#1f222b_1px,transparent_1px)] [background-size:16px_16px]">
        {viewportMode === 'desktop' && (
          <div
            className="w-full h-full min-h-[600px] bg-black rounded-2xl shadow-2xl border border-white/10 overflow-auto transition-transform origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {renderActiveTemplate('desktop')}
          </div>
        )}

        {viewportMode === 'tablet' && (
          /* Tablet Frame Mockup (768px width) */
          <div
            className="w-[768px] max-w-full my-auto rounded-[32px] p-3.5 bg-[#1b1d22] shadow-2xl border-4 border-gray-700/60 ring-1 ring-white/10 transition-transform origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Tablet Camera dot */}
            <div className="flex justify-center items-center py-1 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/10" />
            </div>
            {/* Tablet Screen */}
            <div className="h-[750px] overflow-y-auto rounded-[22px] border border-white/10 bg-black scrollbar-thin">
              {renderActiveTemplate('tablet')}
            </div>
          </div>
        )}

        {viewportMode === 'mobile' && (
          /* Mobile Device Frame Mockup (380px width) */
          <div
            className="w-[380px] max-w-full my-auto rounded-[40px] p-3 bg-[#1e2025] shadow-2xl border-4 border-gray-700/60 ring-1 ring-white/10 transition-transform origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Phone Speaker & Notch */}
            <div className="flex justify-center items-center py-1.5 mb-2">
              <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>
            </div>

            {/* Inner Phone Screen */}
            <div className="h-[680px] overflow-y-auto rounded-[30px] border border-white/10 bg-black scrollbar-thin">
              {renderActiveTemplate('mobile')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
