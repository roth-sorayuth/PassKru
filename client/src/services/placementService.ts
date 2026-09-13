import { api } from '../utils/api';
import { PlacementPreview, PlacementResult, PlacementSession, PlacementStatus } from '../types/aiStudyPlan';

/** Whether the candidate has sat the placement test for their current track. */
export const getPlacementStatus = (): Promise<PlacementStatus> =>
  api('/placement/status').then((res) => res.placement);

/** Question split per subject for a new test, e.g. before a retake. */
export const getPlacementPreview = (): Promise<PlacementPreview> =>
  api('/placement/preview').then((res) => res.preview);

/**
 * Starts (or resumes) the placement test: 15 questions per subject drawn from the
 * question bank for the candidate's chosen subjects plus the core subjects.
 */
export const startPlacement = (): Promise<PlacementSession> =>
  api('/placement/start', { method: 'POST' }).then((res) => res.session);

/** Saves one answer as it's picked, so a paused test can resume. */
export const savePlacementAnswer = (attemptId: number, questionId: number, selectedOptionId: number) =>
  api(`/placement/${attemptId}/answers`, {
    method: 'PUT',
    body: { questionId, selectedOptionId },
  });

/** Scores the test and runs the analysis. */
export const submitPlacement = (attemptId: number): Promise<PlacementResult> =>
  api(`/placement/${attemptId}/submit`, { method: 'POST' }).then((res) => res.result);
