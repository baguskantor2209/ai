import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-1.5',
    lg: 'w-16 h-16 p-3.5',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 36,
  };

  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0 ${className}`}
    >
      <svg
        width={iconSizes[size] || 20}
        height={iconSizes[size] || 20}
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
