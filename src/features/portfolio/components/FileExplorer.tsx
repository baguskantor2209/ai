import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Download,
} from 'lucide-react';
import { ProjectFile } from '../projectGenerator';

interface Props {
  files: Record<string, ProjectFile>;
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const FileExplorer: React.FC<Props> = ({
  files,
  onDownloadZip,
  isDownloading,
}) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    root: true,
    src: true,
    'src/data': true,
  });

  const toggleFolder = (folderKey: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={14} className="text-amber-400 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText size={14} className="text-blue-400 shrink-0" />;
    if (fileName.endsWith('.html')) return <FileCode size={14} className="text-orange-400 shrink-0" />;
    if (fileName.endsWith('.css')) return <FileCode size={14} className="text-cyan-400 shrink-0" />;
    return <FileCode size={14} className="text-yellow-400 shrink-0" />;
  };

  return (
    <div className="h-full flex flex-col bg-[#14161b] text-gray-300 border-r border-white/5 select-none">
      {/* File Explorer Header */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder size={15} className="text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Project Structure
          </span>
        </div>
        <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-mono">
          Vite + React
        </span>
      </div>

      {/* Tree Content (Visual file list representation only, no code viewing) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs font-mono">
        {/* Root Directory */}
        <div>
          <div
            onClick={() => toggleFolder('root')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-gray-200 font-semibold"
          >
            {openFolders['root'] ? (
              <ChevronDown size={14} className="text-gray-400" />
            ) : (
              <ChevronRight size={14} className="text-gray-400" />
            )}
            {openFolders['root'] ? (
              <FolderOpen size={15} className="text-amber-400" />
            ) : (
              <Folder size={15} className="text-amber-400" />
            )}
            <span>portfolio-website/</span>
          </div>

          {openFolders['root'] && (
            <div className="pl-4 space-y-0.5 mt-0.5 border-l border-white/5 ml-3">
              {/* Root Files */}
              {['package.json', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js', 'index.html', 'README.md'].map((fileKey) => (
                <div
                  key={fileKey}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors select-none"
                >
                  {getFileIcon(fileKey)}
                  <span className="truncate">{fileKey}</span>
                </div>
              ))}

              {/* src/ Folder */}
              <div>
                <div
                  onClick={() => toggleFolder('src')}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-gray-300 font-medium"
                >
                  {openFolders['src'] ? (
                    <ChevronDown size={13} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={13} className="text-gray-400" />
                  )}
                  {openFolders['src'] ? (
                    <FolderOpen size={14} className="text-blue-400" />
                  ) : (
                    <Folder size={14} className="text-blue-400" />
                  )}
                  <span>src/</span>
                </div>

                {openFolders['src'] && (
                  <div className="pl-4 space-y-0.5 mt-0.5 border-l border-white/5 ml-3">
                    {['main.jsx', 'App.jsx', 'index.css', 'translations.js'].map((fileName) => (
                      <div
                        key={fileName}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors select-none"
                      >
                        {getFileIcon(fileName)}
                        <span className="truncate">{fileName}</span>
                      </div>
                    ))}

                    {/* src/data Folder */}
                    <div>
                      <div
                        onClick={() => toggleFolder('src/data')}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer text-gray-400"
                      >
                        {openFolders['src/data'] ? (
                          <ChevronDown size={12} />
                        ) : (
                          <ChevronRight size={12} />
                        )}
                        <Folder size={13} className="text-purple-400" />
                        <span>data/</span>
                      </div>

                      {openFolders['src/data'] && (
                        <div className="pl-4 space-y-0.5 mt-0.5 border-l border-white/5 ml-3">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors select-none">
                            {getFileIcon('portfolio.js')}
                            <span className="truncate">portfolio.js</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Bottom Box */}
      <div className="p-3 border-t border-white/5 bg-[#101216] space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <Sparkles size={13} className="text-amber-400" />
          <span>Siap diekspor ke file ZIP mandiri</span>
        </div>
        <button
          type="button"
          onClick={onDownloadZip}
          disabled={isDownloading}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Download size={14} />
          <span>{isDownloading ? 'Menyiapkan ZIP...' : 'Download ZIP (.zip)'}</span>
        </button>
      </div>
    </div>
  );
};
