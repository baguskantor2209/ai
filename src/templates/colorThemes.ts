export interface PresetColor {
  id: string;
  name: string;
  hex: string;
  category: 'Warm' | 'Cool' | 'Executive' | 'Vibrant';
}

export const PRESET_COLOR_TONES: PresetColor[] = [
  { id: 'amber', name: 'Sunset Amber', hex: '#f59e0b', category: 'Warm' },
  { id: 'teal', name: 'Deep Teal', hex: '#0d9488', category: 'Cool' },
  { id: 'indigo', name: 'Modern Indigo', hex: '#4f46e5', category: 'Cool' },
  { id: 'emerald', name: 'Emerald Forest', hex: '#059669', category: 'Cool' },
  { id: 'rose', name: 'Rose Coral', hex: '#e11d48', category: 'Vibrant' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06b6d4', category: 'Cool' },
  { id: 'violet', name: 'Royal Violet', hex: '#7c3aed', category: 'Vibrant' },
  { id: 'crimson', name: 'Crimson Ruby', hex: '#b91c1c', category: 'Warm' },
  { id: 'bronze', name: 'Warm Bronze', hex: '#b45309', category: 'Warm' },
  { id: 'sky', name: 'Sky Marine', hex: '#0284c7', category: 'Cool' },
  { id: 'slate', name: 'Executive Slate', hex: '#334155', category: 'Executive' },
  { id: 'dark', name: 'Midnight Charcoal', hex: '#0f172a', category: 'Executive' },
];

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryBorder: string;
  darkSidebar: string;
  darkSidebarCard: string;
  darkSidebarBorder: string;
  textOnPrimary: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 245, g: 158, b: 11 }; // Fallback amber
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getColorPalette(hexColor?: string): ColorPalette {
  const hex = hexColor && hexColor.startsWith('#') ? hexColor : '#f59e0b';
  const { r, g, b } = hexToRgb(hex);

  // Calculate luminance to decide text on primary
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textOnPrimary = luminance > 0.65 ? '#0f172a' : '#ffffff';

  // Tinted dark sidebar: blend ~15% theme color with dark charcoal #14161b
  const darkR = Math.round(18 + r * 0.08);
  const darkG = Math.round(20 + g * 0.08);
  const darkB = Math.round(25 + b * 0.08);
  const darkSidebar = `rgb(${darkR}, ${darkG}, ${darkB})`;

  const cardR = Math.round(24 + r * 0.12);
  const cardG = Math.round(27 + g * 0.12);
  const cardB = Math.round(33 + b * 0.12);
  const darkSidebarCard = `rgb(${cardR}, ${cardG}, ${cardB})`;

  const darkSidebarBorder = `rgba(${r}, ${g}, ${b}, 0.25)`;

  return {
    primary: hex,
    primaryLight: `rgba(${r}, ${g}, ${b}, 0.12)`,
    primaryLighter: `rgba(${r}, ${g}, ${b}, 0.05)`,
    primaryBorder: `rgba(${r}, ${g}, ${b}, 0.35)`,
    darkSidebar,
    darkSidebarCard,
    darkSidebarBorder,
    textOnPrimary,
  };
}
