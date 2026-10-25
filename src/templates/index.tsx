import React from 'react';
import CreativeRenderer, { CREATIVE_TEMPLATES, CreativeThemeInfo } from './creative/CreativeRenderer';
import AtsRenderer, { ATS_TEMPLATES, AtsThemeInfo } from './ats/AtsRenderer';
import { CvData } from '../types';
import { PRESET_COLOR_TONES, getColorPalette } from './colorThemes';

export interface TemplateItem {
  id: string;
  name: string;
  subtitle: string;
  type: 'Creative' | 'ATS';
  badge: string;
  layoutType: string;
}

export const ALL_TEMPLATES: TemplateItem[] = [
  // 10 CREATIVE TEMPLATES DENGAN DESAIN & STRUKTUR LAYOUT RADIKAL BERBEDA
  ...CREATIVE_TEMPLATES.map((c) => ({
    id: c.id,
    name: c.name,
    subtitle: c.subtitle,
    type: 'Creative' as const,
    badge: c.layoutType,
    layoutType: c.layoutType,
  })),

  // 10 ATS TEMPLATES DENGAN STRUKTUR TEKS & MATRIKS ATS BERBEDA
  ...ATS_TEMPLATES.map((a) => ({
    id: a.id,
    name: a.name,
    subtitle: a.subtitle,
    type: 'ATS' as const,
    badge: a.layoutType,
    layoutType: a.layoutType,
  })),
];

export function TemplateThumbnail({ template, colorTone }: { template: TemplateItem; colorTone?: string }) {
  const activeColor = colorTone || (template.id.startsWith('tpl-c') ? '#f59e0b' : '#334155');

  // === 1. TPL-C1: ASYMMETRIC RIGHT SIDEBAR ===
  if (template.id === 'tpl-c1') {
    return (
      <div className="flex h-full w-full border border-slate-200 overflow-hidden rounded-lg shadow-xs bg-white">
        <div className="w-[64%] p-2 flex flex-col justify-between">
          <div>
            <div className="w-full h-3 mb-1.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-3/4 h-1 bg-slate-800 rounded-xs mb-1" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs mb-0.5" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs mb-1" />
            <div className="w-1/2 h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
          </div>
          <div className="w-full h-0.5 bg-slate-200" />
        </div>
        <div className="w-[36%] bg-[#1e232d] p-1.5 flex flex-col items-center justify-between">
          <div className="w-4 h-4 rounded-full border-2 bg-slate-700" style={{ borderColor: activeColor }} />
          <div className="w-full space-y-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-3/4 h-0.5 bg-white/40 rounded-xs" />
            <div className="w-1/2 h-0.5 bg-white/30 rounded-xs" />
          </div>
          <div className="w-full h-0.5 bg-white/20" />
        </div>
      </div>
    );
  }

  // === 2. TPL-C2: NORDIC LEFT DRAWER ===
  if (template.id === 'tpl-c2') {
    return (
      <div className="flex h-full w-full border border-slate-200 overflow-hidden rounded-lg shadow-xs bg-white">
        <div className="w-[35%] bg-[#13282b] p-1.5 flex flex-col items-center justify-between">
          <div className="w-4 h-4 rounded-md border-2 bg-slate-800" style={{ borderColor: activeColor }} />
          <div className="w-full space-y-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-3/4 h-0.5 bg-teal-200/50 rounded-xs" />
          </div>
          <div className="w-full h-0.5 bg-white/20" />
        </div>
        <div className="w-[65%] p-2 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="w-3/4 h-2 bg-slate-900 rounded-xs mb-1" />
            <div className="w-1/2 h-1 rounded-xs mb-1.5" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-1 bg-white border border-slate-200 rounded-xs" />
            <div className="w-full h-1 bg-white border border-slate-200 rounded-xs" />
          </div>
          <div className="w-full h-0.5 bg-slate-200" />
        </div>
      </div>
    );
  }

  // === 3. TPL-C3: TOP HERO BANNER + 2 EQUAL COLUMNS ===
  if (template.id === 'tpl-c3') {
    return (
      <div className="flex flex-col h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs">
        <div className="h-[32%] bg-[#182136] p-1.5 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border-2 shrink-0" style={{ borderColor: activeColor, backgroundColor: '#0f172a' }} />
          <div className="flex-1 space-y-0.5">
            <div className="w-3/4 h-1.5 bg-white rounded-xs" />
            <div className="w-1/2 h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
          </div>
        </div>
        <div className="flex-1 p-2 flex gap-2">
          <div className="w-1/2 space-y-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-3/4 h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="w-1/2 border-l border-slate-200 pl-1.5 space-y-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // === 4. TPL-C4: MODULAR DASHBOARD CARDS ===
  if (template.id === 'tpl-c4') {
    return (
      <div className="p-2 h-full w-full bg-[#f8fafc] border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="bg-white p-1 rounded border border-slate-200 flex items-center gap-1.5 mb-1.5 shadow-xs">
          <div className="w-4 h-4 rounded-full border shrink-0" style={{ borderColor: activeColor, backgroundColor: '#fee2e2' }} />
          <div className="w-2/3 space-y-0.5">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-1/2 h-0.5 bg-slate-300 rounded-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <div className="bg-white p-1 rounded border border-slate-200 space-y-1">
            <div className="w-3/4 h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="bg-white p-1 rounded border border-slate-200 space-y-1">
            <div className="w-3/4 h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // === 5. TPL-C5: CYBER TERMINAL TECH ===
  if (template.id === 'tpl-c5') {
    return (
      <div className="p-2 h-full w-full bg-[#0c131d] border border-slate-800 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between font-mono">
        <div className="border-b border-slate-700/60 pb-1 flex justify-between items-center mb-1">
          <div className="w-1/2 space-y-0.5">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-2/3 h-0.5 bg-slate-500 rounded-xs" />
          </div>
          <div className="w-4 h-4 rounded border" style={{ borderColor: activeColor, backgroundColor: '#0f172a' }} />
        </div>
        <div className="grid grid-cols-5 gap-1 flex-1">
          <div className="col-span-3 space-y-1 bg-[#121c2a] p-1 rounded">
            <div className="w-2/3 h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-700 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-700 rounded-xs" />
          </div>
          <div className="col-span-2 space-y-1 bg-[#121c2a] p-1 rounded">
            <div className="w-3/4 h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-700 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // === 6. TPL-C6: CENTER SPINE SYMMETRICAL TIMELINE ===
  if (template.id === 'tpl-c6') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="text-center pb-1 border-b mb-1 flex flex-col items-center" style={{ borderColor: `${activeColor}40` }}>
          <div className="w-4 h-4 rounded-full border-2 mb-0.5" style={{ borderColor: activeColor }} />
          <div className="w-1/2 h-1 bg-slate-900 rounded-xs" />
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1 relative">
          <div className="border-r-2 pr-1 space-y-1 text-right" style={{ borderColor: activeColor }}>
            <div className="w-3/4 h-1 rounded-xs ml-auto" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
          <div className="pl-1 space-y-1">
            <div className="w-3/4 h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // === 7. TPL-C7: BOLD GEOMETRIC RIBBON 3-COLUMN ===
  if (template.id === 'tpl-c7') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="bg-slate-900 p-1.5 rounded flex items-center justify-between mb-1 text-white relative">
          <div className="w-1.5 h-full absolute left-0 top-0 bottom-0" style={{ backgroundColor: activeColor }} />
          <div className="w-1/2 space-y-0.5 pl-2">
            <div className="w-full h-1 bg-white rounded-xs" />
            <div className="w-2/3 h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
          </div>
          <div className="w-3.5 h-3.5 rounded border border-white/20" />
        </div>
        <div className="grid grid-cols-12 gap-1 flex-1">
          <div className="col-span-3 bg-slate-50 p-1 rounded border border-slate-200 space-y-0.5">
            <div className="w-full h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-300" />
          </div>
          <div className="col-span-6 bg-white p-1 rounded border border-slate-200 space-y-1">
            <div className="w-3/4 h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200" />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="col-span-3 bg-slate-50 p-1 rounded border border-slate-200 space-y-0.5">
            <div className="w-full h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-300" />
          </div>
        </div>
      </div>
    );
  }

  // === 8. TPL-C8: DOUBLE-FRAME LUXURY ELEGANCE ===
  if (template.id === 'tpl-c8') {
    return (
      <div
        className="p-2 h-full w-full bg-[#faf8f5] overflow-hidden rounded-lg shadow-xs flex flex-col justify-between border-2 border-double"
        style={{ borderColor: activeColor }}
      >
        <div className="text-center pb-1 border-b border-double mb-1" style={{ borderColor: `${activeColor}60` }}>
          <div className="w-1/2 h-1 mx-auto rounded-xs bg-slate-900 mb-0.5" />
          <div className="w-1/3 h-0.5 mx-auto rounded-xs" style={{ backgroundColor: activeColor }} />
        </div>
        <div className="p-1 rounded mb-1 text-center" style={{ backgroundColor: `${activeColor}15` }}>
          <div className="w-3/4 h-0.5 bg-slate-400 mx-auto" />
        </div>
        <div className="grid grid-cols-5 gap-1.5 flex-1">
          <div className="col-span-3 space-y-1">
            <div className="w-full h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200" />
            <div className="w-4/5 h-0.5 bg-slate-200" />
          </div>
          <div className="col-span-2 border-l pl-1 space-y-1" style={{ borderColor: `${activeColor}40` }}>
            <div className="w-full h-0.5 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // === 9. TPL-C9: NUMBERED PIPELINE STEPS ===
  if (template.id === 'tpl-c9') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="border-b pb-1 mb-1 flex justify-between items-center" style={{ borderColor: `${activeColor}40` }}>
          <div className="w-1/2 h-1 bg-slate-900 rounded-xs" />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeColor }} />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-full text-[6px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: activeColor }}>1</div>
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-full text-[6px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: activeColor }}>2</div>
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-full text-[6px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: activeColor }}>3</div>
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-full text-[6px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: activeColor }}>4</div>
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // === 10. TPL-C10: MAGAZINE EDITORIAL SPREAD ===
  if (template.id === 'tpl-c10') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="border-b-2 border-slate-950 pb-1 mb-1.5 flex gap-1.5 items-start">
          <div className="w-4 h-5 border-2 p-0.5 shrink-0" style={{ borderColor: activeColor }}>
            <div className="w-full h-full bg-slate-200" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="w-full h-1.5 bg-slate-950" />
            <div className="w-1/2 h-0.5" style={{ backgroundColor: activeColor }} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 flex-1">
          <div className="col-span-7 space-y-1">
            <div className="w-full h-0.5" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200" />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="col-span-5 border-l pl-1 space-y-1">
            <div className="w-full h-0.5" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // === ATS 2: LEFT-RAIL DEDICATED TIMELINE ===
  if (template.id === 'tpl-a2') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="border-b pb-1 mb-1" style={{ borderColor: activeColor }}>
          <div className="w-2/3 h-1.5 bg-slate-900 rounded-xs" />
        </div>
        <div className="flex-1 flex gap-1.5 text-xs">
          <div className="w-1/4 border-r border-slate-300 pr-1 space-y-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
            <div className="w-full h-0.5 bg-slate-300 rounded-xs" />
          </div>
          <div className="w-3/4 space-y-1">
            <div className="w-full h-1 bg-slate-900 rounded-xs" />
            <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  // === ATS 3: BOXED SECTION HEADERS ===
  if (template.id === 'tpl-a3') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="text-center pb-1 border-b border-slate-200 mb-1">
          <div className="w-1/2 h-1.5 bg-slate-900 mx-auto rounded-xs" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="w-full h-1.5 rounded-xs px-1 border" style={{ backgroundColor: `${activeColor}15`, borderColor: `${activeColor}40` }} />
          <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
          <div className="w-full h-1.5 rounded-xs px-1 border" style={{ backgroundColor: `${activeColor}15`, borderColor: `${activeColor}40` }} />
          <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
        </div>
      </div>
    );
  }

  // === ATS 4: TECH MATRIX TABLE ===
  if (template.id === 'tpl-a4') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between font-mono">
        <div className="border-b pb-1 mb-1 flex justify-between" style={{ borderColor: activeColor }}>
          <div className="w-1/2 h-1.5 bg-slate-900 rounded-xs" />
          <div className="w-1/4 h-1 rounded-xs" style={{ backgroundColor: activeColor }} />
        </div>
        <div className="border rounded p-1 mb-1" style={{ borderColor: `${activeColor}40` }}>
          <div className="grid grid-cols-3 gap-1">
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: `${activeColor}30` }} />
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: `${activeColor}30` }} />
            <div className="w-full h-1 rounded-xs" style={{ backgroundColor: `${activeColor}30` }} />
          </div>
        </div>
        <div className="space-y-1 flex-1">
          <div className="w-3/4 h-1 bg-slate-900 rounded-xs" />
          <div className="w-full h-0.5 bg-slate-200 rounded-xs" />
        </div>
      </div>
    );
  }

  // === ATS 6: SPLIT HEADER 2-COLUMN ===
  if (template.id === 'tpl-a6') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-1 border-b pb-1 mb-1" style={{ borderColor: activeColor }}>
          <div className="w-3/4 h-2 bg-slate-900" />
          <div className="w-full h-2 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-12 gap-1 flex-1">
          <div className="col-span-7 space-y-1">
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
          <div className="col-span-5 border-l pl-1 space-y-1">
            <div className="w-full h-0.5 bg-slate-800" />
            <div className="w-full h-0.5 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // === ATS 8: LEFT MARGIN ARCHITECTURAL RAIL ===
  if (template.id === 'tpl-a8') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between">
        <div className="pl-2 border-l-2 mb-1" style={{ borderColor: activeColor }}>
          <div className="w-2/3 h-1.5 bg-slate-900" />
        </div>
        <div className="pl-2 border-l-2 flex-1 space-y-1.5" style={{ borderColor: `${activeColor}60` }}>
          <div className="w-full h-0.5" style={{ backgroundColor: activeColor }} />
          <div className="w-full h-0.5 bg-slate-200" />
          <div className="w-full h-0.5" style={{ backgroundColor: activeColor }} />
          <div className="w-full h-0.5 bg-slate-200" />
        </div>
      </div>
    );
  }

  // === ATS 10: SYMMETRICAL DIAMOND ===
  if (template.id === 'tpl-a10') {
    return (
      <div className="p-2 h-full w-full bg-white border border-slate-200 overflow-hidden rounded-lg shadow-xs flex flex-col justify-between text-center">
        <div className="border-b pb-1 mb-1" style={{ borderColor: activeColor }}>
          <div className="w-1/2 h-1.5 bg-slate-900 mx-auto mb-0.5" />
          <div className="w-1/4 h-0.5 mx-auto" style={{ backgroundColor: activeColor }} />
        </div>
        <div className="space-y-1 flex-1">
          <div className="w-1/3 h-1 mx-auto rounded border" style={{ borderColor: activeColor, color: activeColor }} />
          <div className="w-full h-0.5 bg-slate-200" />
          <div className="w-1/3 h-1 mx-auto rounded border" style={{ borderColor: activeColor, color: activeColor }} />
          <div className="w-full h-0.5 bg-slate-200" />
        </div>
      </div>
    );
  }

  // === DEFAULT ATS SINGLE COLUMN (tpl-a1, tpl-a5, tpl-a7, tpl-a9) ===
  return (
    <div className="p-2.5 space-y-1.5 bg-white h-full w-full flex flex-col justify-between border border-slate-200 overflow-hidden rounded-lg shadow-xs">
      <div className="border-b pb-1.5 text-center" style={{ borderColor: activeColor }}>
        <div className="w-2/3 h-2 bg-slate-900 rounded mb-1 mx-auto" />
        <div className="w-1/3 h-1 rounded mx-auto" style={{ backgroundColor: activeColor }} />
      </div>

      <div className="space-y-1 flex-1">
        <div className="w-1/4 h-1 bg-slate-800 rounded" />
        <div className="w-full h-0.5 bg-slate-200 rounded" />
        <div className="w-full h-0.5 bg-slate-200 rounded" />
        <div className="w-5/6 h-0.5 bg-slate-200 rounded" />

        <div className="w-1/3 h-1 rounded mt-1.5" style={{ backgroundColor: activeColor }} />
        <div className="grid grid-cols-2 gap-1">
          <div className="w-full h-0.5 bg-slate-300 rounded" />
          <div className="w-full h-0.5 bg-slate-300 rounded" />
        </div>
      </div>

      <div className="border-t border-slate-300 pt-1 flex justify-between">
        <div className="w-1/4 h-0.5 bg-slate-400 rounded" />
        <div className="w-1/6 h-0.5 bg-slate-300 rounded" />
      </div>
    </div>
  );
}

export function UniversalCvRender({
  cvData,
  templateId,
  language = 'id',
  colorTone,
}: {
  cvData: CvData;
  templateId: string;
  language?: 'id' | 'en';
  colorTone?: string;
}) {
  const isAts = templateId.startsWith('tpl-a');

  if (isAts) {
    return <AtsRenderer cvData={cvData} themeId={templateId} language={language} colorTone={colorTone} />;
  }

  return <CreativeRenderer cvData={cvData} themeId={templateId} language={language} colorTone={colorTone} />;
}
