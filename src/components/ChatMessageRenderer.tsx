import React, { useMemo } from 'react';
import { marked } from 'marked';

interface ChatMessageRendererProps {
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessageRenderer({ content, isStreaming }: ChatMessageRendererProps) {
  const htmlContent = useMemo(() => {
    try {
      // Configure marked for clean, GitHub-flavored markdown with line breaks
      marked.setOptions({
        gfm: true,
        breaks: true,
      });

      // Pre-clean content: normalize raw <br> tags
      const normalized = content.replace(/<br\s*\/?>/gi, '\n');
      return marked.parse(normalized) as string;
    } catch (e) {
      console.error('Markdown parse error:', e);
      return content;
    }
  }, [content]);

  return (
    <div className="relative">
      <div
        className="gemini-markdown text-[15.5px] leading-relaxed text-gray-100 font-normal space-y-3.5 select-text"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {isStreaming && (
        <span
          className="inline-block w-2 h-4 ml-1 bg-blue-400 rounded-xs animate-pulse align-middle"
          title="Mengetik..."
        />
      )}
    </div>
  );
}
