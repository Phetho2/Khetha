import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api-client';
import { Roadmap, RoadmapService } from '@/services/roadmap-service';

export function useRoadmap() {
  const { learner } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Refetch every time this screen regains focus, not just on mount — tab
  // screens stay mounted, so completing a step elsewhere (e.g. Subject
  // Chooser) wouldn't otherwise be reflected here until the app reloaded.
  useFocusEffect(
    useCallback(() => {
      if (!learner) return;
      let cancelled = false;
      RoadmapService.getRoadmap(learner.id)
        .then((result) => {
          if (!cancelled) {
            setRoadmap(result);
            setError(null);
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(err instanceof ApiError ? err.message : 'Could not load your roadmap.');
          }
        });
      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- attempt forces a manual retry to refire this even without a focus change
    }, [learner, attempt]),
  );

  function retry() {
    setError(null);
    setRoadmap(null);
    setAttempt((current) => current + 1);
  }

  return { roadmap, roadmapError: error, retryRoadmap: retry };
}
