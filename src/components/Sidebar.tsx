import { FilePlus2, Pin, Search, Trash2, X } from 'lucide-react';
import type { Note, NoteFilter } from '../types/note';
import { computeTextStats, formatShortDate } from '../utils/noteStats';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  filter: NoteFilter;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSelectNote: (id: string) => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: NoteFilter) => void;
  onCreateNote: () => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function Sidebar({
  notes,
  activeNoteId,
  searchQuery,
  filter,
  isOpenMobile,
  onCloseMobile,
  onSelectNote,
  onSearchChange,
  onFilterChange,
  onCreateNote,
  onTogglePin,
  onDeleteNote,
}: SidebarProps) {
  const pinnedCount = notes.filter((n) => n.pinned).length;

  const filteredNotes = notes
    .filter((note) => {
      if (filter === 'pinned' && !note.pinned) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const sidebarContent = (
    <aside
      aria-label="Notes list"
      className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
        <button
          type="button"
          onClick={onCreateNote}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#162C49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F] whitespace-nowrap shrink-0 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          <FilePlus2 className="h-4 w-4 shrink-0" />
          <span>New Note</span>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[#1E3A5F] lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3A5F] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Filter notes"
          className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => onFilterChange('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            All ({notes.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'pinned'}
            onClick={() => onFilterChange('pinned')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              filter === 'pinned'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Pinned ({pinnedCount})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredNotes.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {searchQuery ? 'No matching notes' : filter === 'pinned' ? 'No pinned notes' : 'No notes yet'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try another search term.'
                : filter === 'pinned'
                  ? 'Pin any note to keep it at the top.'
                  : 'Create a new note to start writing.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const stats = computeTextStats(note.content);
              const excerpt = note.content.replace(/\s+/g, ' ').trim();

              return (
                <li key={note.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectNote(note.id);
                      onCloseMobile();
                    }}
                    className={`w-full rounded-lg px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#1E3A5F] ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 pr-12">
                      <span
                        className={`truncate text-sm font-semibold ${
                          isActive
                            ? 'text-[#1E3A5F] dark:text-sky-300'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {note.title.trim() || 'Untitled Note'}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {excerpt || 'Empty note'}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                      <span>{formatShortDate(note.updatedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {stats.words} {stats.words === 1 ? 'word' : 'words'}
                      </span>
                      {note.pinned && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#1E3A5F] dark:text-sky-400">Pinned</span>
                        </>
                      )}
                    </div>
                  </button>

                  <div className="absolute top-2.5 right-2 flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(note.id);
                      }}
                      aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                      title={note.pinned ? 'Unpin note' : 'Pin note'}
                      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                        note.pinned
                          ? 'text-[#1E3A5F] hover:bg-slate-200 dark:text-sky-400 dark:hover:bg-slate-700'
                          : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      aria-label="Delete note"
                      title="Delete note"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden h-full lg:block">{sidebarContent}</div>

      {isOpenMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full shadow-xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
