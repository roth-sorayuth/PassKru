import { api } from '../utils/api';
import { FlashcardApi } from '../types';

export interface FlashcardDeckApi {
  deckId: number;
  subjectId: number;
  subjectName: string | null;
  title: string;
  description: string | null;
  totalFlashcards: number;
}

export interface GetFlashcardsResponse {
  success: boolean;
  count: number;
  flashcards: FlashcardApi[];
}

export interface GetDecksResponse {
  success: boolean;
  count: number;
  decks: FlashcardDeckApi[];
}

const flashcardCache = new Map<string, GetFlashcardsResponse>();
const deckCache = new Map<string, GetDecksResponse>();

export const getFlashcards = async (params?: {
  subjectId?: string;
  subjectName?: string;
  deckId?: string;
  difficulty?: string;
}): Promise<GetFlashcardsResponse> => {
  const query = new URLSearchParams();
  if (params?.subjectId) query.set('subjectId', params.subjectId);
  if (params?.subjectName) query.set('subjectName', params.subjectName);
  if (params?.deckId) query.set('deckId', params.deckId);
  if (params?.difficulty) query.set('difficulty', params.difficulty);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const cacheKey = queryString || 'all';

  if (flashcardCache.has(cacheKey)) {
    const cached = flashcardCache.get(cacheKey)!;
    // Silent background revalidation
    api(`/flashcards${queryString}`)
      .then((res) => {
        if (res && res.flashcards) flashcardCache.set(cacheKey, res);
      })
      .catch(() => {});
    return cached;
  }

  const res = await api(`/flashcards${queryString}`);
  if (res && res.flashcards) {
    flashcardCache.set(cacheKey, res);
  }
  return res;
};

export const getFlashcardDecks = async (params?: {
  subjectId?: string;
  subjectName?: string;
}): Promise<GetDecksResponse> => {
  const query = new URLSearchParams();
  if (params?.subjectId) query.set('subjectId', params.subjectId);
  if (params?.subjectName) query.set('subjectName', params.subjectName);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const cacheKey = queryString || 'all';

  if (deckCache.has(cacheKey)) {
    const cached = deckCache.get(cacheKey)!;
    // Silent background revalidation
    api(`/flashcards/decks${queryString}`)
      .then((res) => {
        if (res && res.decks) deckCache.set(cacheKey, res);
      })
      .catch(() => {});
    return cached;
  }

  const res = await api(`/flashcards/decks${queryString}`);
  if (res && res.decks) {
    deckCache.set(cacheKey, res);
  }
  return res;
};
