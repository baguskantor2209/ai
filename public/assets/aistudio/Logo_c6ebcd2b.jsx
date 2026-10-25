import React from 'react';

export default function Logo({ size = 'md' }) {
  const sizeMap = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-20 h-20 p-4'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 40
  };

  return (
    <div className={`${sizeMap[size] || sizeMap.md} rounded-full bg-gradient-to-br from-[#4f75ff] via-[#7b52ff] to-[#b04eff] flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0`}>
      <svg 
        width={iconSizes[size] || 18} 
        height={iconSizes[size] || 18} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-white"
      >
        {/* Bintang Kilatan Utama */}
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        {/* Plus Kecil Kanan Atas */}
        <path d="M19 3v4M17 5h4" strokeWidth="1.5" />
        {/* Lingkaran Kecil Kiri Bawah */}
        <circle cx="5" cy="19" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}