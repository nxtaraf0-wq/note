import { useEffect, useRef } from 'react';
import { FilePlus2 } from 'lucide-react';
import type { Note } from '../types/note';
import { computeTextStats, formatShortDate, formatTime } from '../utils/noteStats';

interface NoteEditorProps {
  note: Note | null;
  fontSize: number;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onCreateNote: () => void;
}

export function NoteEditor({
  note,
  fontSize,
  onUpdateTitle,
  onUpdateContent,
  onCreateNote,
}: NoteEditorProps) {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [note?.id, note?.title]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = 'auto';
      bodyRef.current.style.height = `${Math.max(bodyRef.current.scrollHeight, 440)}px`;
    }
  }, [note?.id, note?.content, fontSize, note?.fontStyle]);

  if (!note) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            No note selected
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Select a note from the sidebar or create a new blank page to start writing.
          </p>
          <button
            type="button"
            onClick={onCreateNote}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#162C49] whitespace-nowrap shrink-0 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            <FilePlus2 className="h-4 w-4" />
            <span>Create New Note</span>
          </button>
        </div>
      </div>
    );
  }

  const stats = computeTextStats(note.content);

  const fontClass =
    note.fontStyle === 'serif'
      ? 'font-editorial'
      : note.fontStyle === 'mono'
        ? 'font-code'
        : 'font-ui';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-8 sm:py-10 dark:bg-slate-950">
      <article className="print-sheet mx-auto w-full max-w-[780px] rounded-xl border border-slate-200 bg-white px-6 py-10 shadow-xs sm:px-14 sm:py-14 dark:border-slate-800 dark:bg-slate-900">
        <textarea
          ref={titleRef}
          rows={1}
          value={note.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Untitled Note"
          aria-label="Note title"
          className={`w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-2xl font-bold tracking-tight text-[#1E3A5F] placeholder:text-slate-300 focus:outline-none sm:text-[30px] dark:text-sky-300 dark:placeholder:text-slate-600 ${
            note.titleAlign === 'center' ? 'text-center' : 'text-left'
          } ${note.fontStyle === 'mono' ? 'font-code' : 'font-ui'}`}
        />

        <div className="mt-6 sm:mt-8">
          <textarea
            ref={bodyRef}
            value={note.content}
            onChange={(e) => onUpdateContent(e.target.value)}
            placeholder="Start writing your note..."
            aria-label="Note content"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.78 }}
            className={`w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-300 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-600 ${fontClass}`}
          />
        </div>
      </article>

      <footer className="no-print mx-auto mt-4 flex w-full max-w-[780px] flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-500 tabular-nums dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            {stats.words} {stats.words === 1 ? 'word' : 'words'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {stats.characters.toLocaleString()} {stats.characters === 1 ? 'character' : 'characters'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {stats.paragraphs} {stats.paragraphs === 1 ? 'paragraph' : 'paragraphs'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{stats.readingMinutes} min read</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Edited {formatShortDate(note.updatedAt)} at {formatTime(note.updatedAt)}
          </span>
          <span aria-hidden="true">·</span>
          <span>Saved</span>
        </div>
      </footer>
    </div>
  );
}
