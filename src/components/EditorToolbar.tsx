import {
  AlignCenter,
  AlignLeft,
  Check,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Pin,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type { FontStyle, Note, TitleAlignment } from '../types/note';

interface EditorToolbarProps {
  note: Note;
  fontSize: number;
  isFocusMode: boolean;
  copied: boolean;
  isOriginalMessiNote: boolean;
  onFontStyleChange: (style: FontStyle) => void;
  onTitleAlignChange: (align: TitleAlignment) => void;
  onFontSizeChange: (delta: number) => void;
  onTogglePin: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadMd: () => void;
  onPrint: () => void;
  onRestoreOriginal: () => void;
  onDelete: () => void;
  onToggleFocusMode: () => void;
}

export function EditorToolbar({
  note,
  fontSize,
  isFocusMode,
  copied,
  isOriginalMessiNote,
  onFontStyleChange,
  onTitleAlignChange,
  onFontSizeChange,
  onTogglePin,
  onCopy,
  onDownloadTxt,
  onDownloadMd,
  onPrint,
  onRestoreOriginal,
  onDelete,
  onToggleFocusMode,
}: EditorToolbarProps) {
  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Font family"
          className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800"
        >
          {(
            [
              { id: 'serif', label: 'Serif' },
              { id: 'sans', label: 'Sans' },
              { id: 'mono', label: 'Mono' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onFontStyleChange(option.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                note.fontStyle === option.id
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label="Title alignment"
          className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800"
        >
          <button
            type="button"
            onClick={() => onTitleAlignChange('left')}
            aria-label="Align title left"
            title="Align title left"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              note.titleAlign === 'left'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onTitleAlignChange('center')}
            aria-label="Center title"
            title="Center title"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              note.titleAlign === 'center'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          role="group"
          aria-label="Text size"
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800"
        >
          <button
            type="button"
            onClick={() => onFontSizeChange(-1)}
            disabled={fontSize <= 14}
            aria-label="Decrease font size"
            title="Decrease font size"
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            A-
          </button>
          <span className="px-1 text-xs font-medium text-slate-600 tabular-nums dark:text-slate-300">
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => onFontSizeChange(1)}
            disabled={fontSize >= 24}
            aria-label="Increase font size"
            title="Increase font size"
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            A+
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {isOriginalMessiNote && (
          <button
            type="button"
            onClick={onRestoreOriginal}
            title="Restore original note text"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restore</span>
          </button>
        )}

        <button
          type="button"
          onClick={onTogglePin}
          aria-pressed={note.pinned}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
          className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            note.pinned
              ? 'border-[#1E3A5F]/30 bg-[#1E3A5F]/5 text-[#1E3A5F] dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{note.pinned ? 'Pinned' : 'Pin'}</span>
        </button>

        <button
          type="button"
          onClick={onCopy}
          title="Copy note to clipboard"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={onDownloadTxt}
          title="Download as .txt"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          <span>.txt</span>
        </button>

        <button
          type="button"
          onClick={onDownloadMd}
          title="Download as Markdown (.md)"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          <span>.md</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          title="Print note"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Print</span>
        </button>

        <button
          type="button"
          onClick={onToggleFocusMode}
          aria-pressed={isFocusMode}
          title={isFocusMode ? 'Exit focus mode' : 'Focus mode'}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isFocusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          <span className="hidden xl:inline">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete note"
          title="Delete note"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/60 dark:hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
