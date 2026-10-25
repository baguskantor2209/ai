import React, { useState, useEffect, useRef } from 'react';

export type CursorStyle = 'pipe' | 'block' | 'underscore' | 'glow' | 'accent' | 'none';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char (default: 45)
  delay?: number; // initial delay before typing starts (default: 100)
  cursorStyle?: CursorStyle;
  cursorColor?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div' | 'p';
  onComplete?: () => void;
  keepCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = '',
  speed = 45,
  delay = 100,
  cursorStyle = 'pipe',
  cursorColor,
  className = '',
  as: Component = 'span',
  onComplete,
  keepCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  // Reset and animate whenever `text` changes
  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsDone(true);
      return;
    }

    if (prefersReducedMotion.current) {
      setDisplayedText(text);
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedText('');
    setIsDone(false);

    let currentIndex = 0;
    let timerId: NodeJS.Timeout;

    const delayTimer = setTimeout(() => {
      timerId = setInterval(() => {
        currentIndex++;
        setDisplayedText(text.slice(0, currentIndex));

        if (currentIndex >= text.length) {
          clearInterval(timerId);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timerId);
    };
  }, [text, speed, delay, onComplete]);

  // Subtle cursor blink loop
  useEffect(() => {
    if (cursorStyle === 'none') return;
    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, [cursorStyle]);

  // Cursor representation based on template personality
  const renderCursor = () => {
    if (cursorStyle === 'none') return null;
    if (!keepCursor && isDone) return null;

    const opacityClass = cursorVisible ? 'opacity-100' : 'opacity-0';
    const transitionClass = 'transition-opacity duration-100 select-none';

    switch (cursorStyle) {
      case 'block':
        return (
          <span
            className={`inline-block w-[0.55em] h-[0.9em] ml-1 align-baseline translate-y-[0.05em] bg-current ${opacityClass} ${transitionClass}`}
            style={cursorColor ? { backgroundColor: cursorColor } : undefined}
            aria-hidden="true"
          />
        );
      case 'underscore':
        return (
          <span
            className={`inline-block font-mono font-bold ml-0.5 text-current ${opacityClass} ${transitionClass}`}
            style={cursorColor ? { color: cursorColor } : undefined}
            aria-hidden="true"
          >
            _
          </span>
        );
      case 'glow':
        return (
          <span
            className={`inline-block w-[2.5px] h-[0.85em] ml-1 align-middle rounded-full ${opacityClass} ${transitionClass}`}
            style={{
              backgroundColor: cursorColor || '#38bdf8',
              boxShadow: `0 0 10px ${cursorColor || '#38bdf8'}, 0 0 20px ${cursorColor || '#38bdf8'}`,
            }}
            aria-hidden="true"
          />
        );
      case 'accent':
        return (
          <span
            className={`inline-block w-[3px] h-[0.9em] ml-1.5 align-middle rounded-sm ${opacityClass} ${transitionClass}`}
            style={{ backgroundColor: cursorColor || '#ec4899' }}
            aria-hidden="true"
          />
        );
      case 'pipe':
      default:
        return (
          <span
            className={`inline-block w-[2px] h-[0.85em] ml-1 align-middle bg-current ${opacityClass} ${transitionClass}`}
            style={cursorColor ? { backgroundColor: cursorColor } : undefined}
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <Component className={`break-words ${className}`}>
      <span>{displayedText}</span>
      {renderCursor()}
    </Component>
  );
};
