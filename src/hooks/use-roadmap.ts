import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api-client';
import { Roadmap, RoadmapService } from '@/services/roadmap-service';

export function useRoadmap() {
  const { learner } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!learner) return;
    let cancelled = false;
    RoadmapService.getRoadmap()
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
  }, [learner, attempt]);

  function retry() {
    setError(null);
    setRoadmap(null);
    setAttempt((current) => current + 1);
  }

  return { roadmap, roadmapError: error, retryRoadmap: retry };
}
