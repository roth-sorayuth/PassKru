import { api } from '../utils/api';
import { FlashcardApi } from '../types';

export interface GetFlashcardsResponse {
  success: boolean;
  count: number;
  flashcards: FlashcardApi[];
}

export const getFlashcards = async (params?: {
  subjectId?: string;
  deckId?: string;
  difficulty?: string;
}): Promise<GetFlashcardsResponse> => {
  const query = new URLSearchParams();
  if (params?.subjectId) query.set('subjectId', params.subjectId);
  if (params?.deckId) query.set('deckId', params.deckId);
  if (params?.difficulty) query.set('difficulty', params.difficulty);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await api(`/flashcards${queryString}`);
};
