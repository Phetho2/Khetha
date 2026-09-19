import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { JOURNEY_STEP } from '@/data/journey';
import { RoadmapService } from '@/services/roadmap-service';
import { SavedCareersService } from '@/services/saved-careers-service';

const EMPTY_SET = new Set<number>();

// Tracks which careers the signed-in learner has saved, and lets any screen
// toggle save state without duplicating the fetch-and-sync logic.
export function useSavedCareers() {
  const { learner } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<number>>(EMPTY_SET);

  useEffect(() => {
    if (!learner) return;
    let cancelled = false;
    SavedCareersService.getSavedCareers()
      .then((saved) => {
        if (!cancelled) setSavedIds(new Set(saved.map((entry) => entry.career.id)));
      })
      .catch(() => {
        // Best-effort — cards just fall back to showing "not saved".
      });
    return () => {
      cancelled = true;
    };
  }, [learner]);

  const toggleSaved = useCallback(
    (careerId: number): Promise<void> => {
      if (!learner) {
        router.push('/account');
        return Promise.resolve();
      }
      const nextSaved = !savedIds.has(careerId);
      const action = nextSaved
        ? SavedCareersService.saveCareer(careerId)
        : SavedCareersService.unsaveCareer(careerId);

      return action
        .then(() => {
          setSavedIds((current) => {
            const next = new Set(current);
            if (nextSaved) {
              next.add(careerId);
            } else {
              next.delete(careerId);
            }
            return next;
          });
          if (nextSaved) {
            // Best-effort — a roadmap sync failure shouldn't block the save the learner just made.
            RoadmapService.completeStep(JOURNEY_STEP.shortlist).catch(() => {});
          }
        })
        .catch(() => {
          // Best-effort — leave saved state as-is so the learner can retry.
        });
    },
    [learner, savedIds],
  );

  return { savedIds: learner ? savedIds : EMPTY_SET, toggleSaved };
}
