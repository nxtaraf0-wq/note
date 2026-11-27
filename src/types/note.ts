export type FontStyle = 'serif' | 'sans' | 'mono';
export type TitleAlignment = 'left' | 'center';
export type NoteFilter = 'all' | 'pinned';

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  fontStyle: FontStyle;
  titleAlign: TitleAlignment;
  createdAt: string;
  updatedAt: string;
}
