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
  return await api(`/flashcards${queryString}`);
};

export const getFlashcardDecks = async (params?: {
  subjectId?: string;
  subjectName?: string;
}): Promise<GetDecksResponse> => {
  const query = new URLSearchParams();
  if (params?.subjectId) query.set('subjectId', params.subjectId);
  if (params?.subjectName) query.set('subjectName', params.subjectName);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await api(`/flashcards/decks${queryString}`);
};
