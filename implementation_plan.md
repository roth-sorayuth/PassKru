# Study Plan Subject Selection Implementation

Integrating the Cambodian MoEYS teacher examination subject structure into the AI Study Plan requires a dynamic subject selection step. Because candidates' subject requirements depend entirely on the exam level they are taking (NIE, RTTC, or PTTC), the wizard must adapt its flow based on the initial exam choice.

## User Review Required
> [!IMPORTANT]
> This plan proposes changing the `targetSubject` field in the database and user profiles from a `string` to an `array of strings` (`targetSubjects: string[]`) to support the RTTC dual-major requirement.

## Proposed Changes

### Frontend Types (`client/src/types/index.ts`)
*   **[MODIFY]** Update `UserProfile`, `StudyPlanRecord`, and `generateStudyPlan` payload types. Change `targetSubject: string` to `targetSubjects: string[]`.

### Study Plan Wizard UI (`client/src/components/pages/StudyPlanPage.tsx`)
*   **[MODIFY]** **Step 1 (Exam Target)**: User selects NIE, RTTC, PTTC, or Kindergarten.
*   **[NEW]** **Step 1.5 (Dynamic Subject Selection)**: 
    *   **If NIE (Upper Secondary):** Display a single-select list of subjects (Math, Physics, Chemistry, Khmer Literature, etc.). The user must select exactly one subject.
    *   **If RTTC (Lower Secondary):** Display a selection interface where the user picks a dual-major pairing (e.g., Math + ICT, Physics + Chemistry). We can either offer pre-defined pairings or let them select exactly two subjects.
    *   **If PTTC (Primary) or Kindergarten:** Skip this step entirely. The system will automatically assign `['generalist']` as the target subjects.
*   **[MODIFY]** **State Management:** Add `targetSubjects: string[]` to the component state and pass it correctly into the `generateStudyPlan` API call.

### Backend Controller (`server/src/controllers/studyPlanController.js`)
*   **[MODIFY]** Update the `generatePlan` endpoint to accept `targetSubjects` as an array instead of a single string.

### AI Generation Logic (`server/src/services/studyPlanService.js`)
*   **[MODIFY]** Update the Gemini prompt generation to explicitly handle the different subject constraints:
    *   If `nie`, focus the study plan deeply on the single major subject (e.g., 80% Math, 20% Pedagogy).
    *   If `rttc`, split the study plan evenly across the two paired subjects (e.g., 40% Math, 40% ICT, 20% Pedagogy).
    *   If `pttc`, generate a broad generalist study plan covering fundamental Math, Khmer, Basic Science, and Social Studies.

## Open Questions
> [!NOTE]
> For the **RTTC Dual Major**, should we present a list of pre-defined pairs (e.g., "Math + ICT", "Physics + Chemistry") for them to select, or should we just allow them to independently select any two subjects from the list? Pre-defined pairs are often safer if MoEYS only accepts specific combinations.

## Verification Plan
1.  **Manual Verification:** Start the Study Plan wizard as a PTTC candidate and verify the subject step is skipped.
2.  **Manual Verification:** Start the wizard as an RTTC candidate, select a dual major, and verify the backend AI correctly generates a study plan covering both subjects.
3.  **Manual Verification:** Check the user profile state to ensure `targetSubjects` is saved correctly as an array.
