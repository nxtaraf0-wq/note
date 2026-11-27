import { useCallback, useEffect, useState } from 'react';
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, Undo2, X } from 'lucide-react';
import { EditorToolbar } from './components/EditorToolbar';
import { NoteEditor } from './components/NoteEditor';
import { Sidebar } from './components/Sidebar';
import { INITIAL_NOTES, MESSI_ESSAY_ID } from './data/initialNotes';
import type { FontStyle, Note, NoteFilter, TitleAlignment } from './types/note';

const STORAGE_NOTES_KEY = 'folio_notes_v1';
const STORAGE_ACTIVE_KEY = 'folio_active_note_v1';
const STORAGE_FONT_SIZE_KEY = 'folio_font_size_v1';
const STORAGE_THEME_KEY = 'folio_theme_v1';

function loadInitialNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_NOTES_KEY);
    if (raw === null) {
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback to initial note if storage is unreadable
  }
  return INITIAL_NOTES;
}

function loadInitialFontSize(): number {
  try {
    const raw = localStorage.getItem(STORAGE_FONT_SIZE_KEY);
    if (raw) {
      const num = Number(raw);
      if (Number.isFinite(num) && num >= 14 && num <= 24) {
        return num;
      }
    }
  } catch {
    // Ignore storage error
  }
  return 17;
}

function loadInitialTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(STORAGE_THEME_KEY);
    if (raw === 'dark' || raw === 'light') {
      return raw;
    }
  } catch {
    // Ignore storage error
  }
  return 'light';
}

function sanitizeFilename(title: string, ext: 'txt' | 'md'): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'untitled-note'}.${ext}`;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (saved && notes.some((n) => n.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage error
    }
    return notes[0]?.id ?? null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<NoteFilter>('all');
  const [fontSize, setFontSize] = useState<number>(loadInitialFontSize);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadInitialTheme);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletedUndo, setDeletedUndo] = useState<{ note: Note; index: number } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage error
    }
  }, [notes]);

  useEffect(() => {
    try {
      if (activeNoteId) {
        localStorage.setItem(STORAGE_ACTIVE_KEY, activeNoteId);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_KEY);
      }
    } catch {
      // Ignore storage error
    }
  }, [activeNoteId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FONT_SIZE_KEY, String(fontSize));
    } catch {
      // Ignore storage error
    }
  }, [fontSize]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!deletedUndo) return;
    const timer = window.setTimeout(() => setDeletedUndo(null), 6000);
    return () => window.clearTimeout(timer);
  }, [deletedUndo]);

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;

  const handleCreateNote = useCallback(() => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: '',
      content: '',
      pinned: false,
      fontStyle: 'serif',
      titleAlign: 'left',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setFilter('all');
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFocusMode]);

  const updateActiveNote = useCallback(
    (patch: Partial<Note>) => {
      if (!activeNoteId) return;
      const now = new Date().toISOString();
      setNotes((prev) =>
        prev.map((note) =>
          note.id === activeNoteId ? { ...note, ...patch, updatedAt: now } : note
        )
      );
    },
    [activeNoteId]
  );

  const handleTogglePin = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    );
  }, []);

  const handleDeleteNote = useCallback(
    (id: string) => {
      const idx = notes.findIndex((n) => n.id === id);
      if (idx === -1) return;
      const target = notes[idx];
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      setDeletedUndo({ note: target, index: idx });

      if (activeNoteId === id) {
        setActiveNoteId(remaining[0]?.id ?? null);
      }
    },
    [notes, activeNoteId]
  );

  const handleUndoDelete = useCallback(() => {
    if (!deletedUndo) return;
    setNotes((prev) => {
      const next = [...prev];
      const insertAt = Math.min(deletedUndo.index, next.length);
      next.splice(insertAt, 0, deletedUndo.note);
      return next;
    });
    setActiveNoteId(deletedUndo.note.id);
    setDeletedUndo(null);
  }, [deletedUndo]);

  const handleCopyNote = useCallback(async () => {
    if (!activeNote) return;
    const text = activeNote.title.trim()
      ? `${activeNote.title.trim()}\n\n${activeNote.content}`
      : activeNote.content;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setToastMessage('Copied note to clipboard');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setToastMessage('Unable to access clipboard');
    }
  }, [activeNote]);

  const handleDownload = useCallback(
    (ext: 'txt' | 'md') => {
      if (!activeNote) return;
      const title = activeNote.title.trim();
      const body =
        ext === 'md'
          ? title
            ? `# ${title}\n\n${activeNote.content}`
            : activeNote.content
          : title
            ? `${title}\n\n${activeNote.content}`
            : activeNote.content;

      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = sanitizeFilename(title, ext);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setToastMessage(`Downloaded ${sanitizeFilename(title, ext)}`);
    },
    [activeNote]
  );

  const handleRestoreOriginal = useCallback(() => {
    const original = INITIAL_NOTES[0];
    if (!original) return;
    updateActiveNote({
      title: original.title,
      content: original.content,
      fontStyle: original.fontStyle,
      titleAlign: original.titleAlign,
    });
    setToastMessage('Restored original note');
  }, [updateActiveNote]);

  const originalMessi = INITIAL_NOTES[0];
  const isModifiedMessiNote =
    activeNote?.id === MESSI_ESSAY_ID &&
    (activeNote.title !== originalMessi.title || activeNote.content !== originalMessi.content);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!isFocusMode && (
        <header className="no-print flex h-14 shrink-0 items-center justify-between gap-8 border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open notes sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              title={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <span className="text-lg font-bold tracking-tight text-[#1E3A5F] whitespace-nowrap shrink-0 dark:text-sky-300">
              Folio
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </header>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!isFocusMode && !isSidebarCollapsed && (
          <div className="no-print h-full">
            <Sidebar
              notes={notes}
              activeNoteId={activeNoteId}
              searchQuery={searchQuery}
              filter={filter}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onSelectNote={(id) => setActiveNoteId(id)}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilter}
              onCreateNote={handleCreateNote}
              onTogglePin={handleTogglePin}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        {!isFocusMode && isSidebarCollapsed && isMobileSidebarOpen && (
          <div className="no-print h-full lg:hidden">
            <Sidebar
              notes={notes}
              activeNoteId={activeNoteId}
              searchQuery={searchQuery}
              filter={filter}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onSelectNote={(id) => setActiveNoteId(id)}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilter}
              onCreateNote={handleCreateNote}
              onTogglePin={handleTogglePin}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {activeNote && (
            <EditorToolbar
              note={activeNote}
              fontSize={fontSize}
              isFocusMode={isFocusMode}
              copied={copied}
              isOriginalMessiNote={isModifiedMessiNote}
              onFontStyleChange={(fontStyle: FontStyle) => updateActiveNote({ fontStyle })}
              onTitleAlignChange={(titleAlign: TitleAlignment) => updateActiveNote({ titleAlign })}
              onFontSizeChange={(delta) =>
                setFontSize((prev) => Math.min(24, Math.max(14, prev + delta)))
              }
              onTogglePin={() => handleTogglePin(activeNote.id)}
              onCopy={handleCopyNote}
              onDownloadTxt={() => handleDownload('txt')}
              onDownloadMd={() => handleDownload('md')}
              onPrint={() => window.print()}
              onRestoreOriginal={handleRestoreOriginal}
              onDelete={() => handleDeleteNote(activeNote.id)}
              onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
            />
          )}

          <NoteEditor
            note={activeNote}
            fontSize={fontSize}
            onUpdateTitle={(title) => updateActiveNote({ title })}
            onUpdateContent={(content) => updateActiveNote({ content })}
            onCreateNote={handleCreateNote}
          />
        </main>
      </div>

      {(deletedUndo || toastMessage) && (
        <div className="no-print fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
          {deletedUndo && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <span>
                Deleted &ldquo;{deletedUndo.note.title.trim() || 'Untitled Note'}&rdquo;
              </span>
              <button
                type="button"
                onClick={handleUndoDelete}
                className="inline-flex items-center gap-1 font-semibold text-[#1E3A5F] hover:underline whitespace-nowrap shrink-0 dark:text-sky-300"
              >
                <Undo2 className="h-3.5 w-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => setDeletedUndo(null)}
                aria-label="Dismiss"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {toastMessage && !deletedUndo && (
            <div
              role="status"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {toastMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
