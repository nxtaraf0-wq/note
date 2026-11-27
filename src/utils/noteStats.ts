export interface TextStats {
  words: number;
  characters: number;
  paragraphs: number;
  readingMinutes: number;
}

export function computeTextStats(content: string): TextStats {
  const trimmed = content.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      paragraphs: 0,
      readingMinutes: 0,
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const characters = content.length;
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    paragraphs,
    readingMinutes,
  };
}

export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
