import { JOURNEY_STEP_META, RoadmapStatus, RoadmapStep } from '@/data/career-roadmap';
import { JourneyProgressResponse } from '@/data/journey';

import { apiClient } from './api-client';

export type Roadmap = {
  steps: RoadmapStep[];
  progressPercent: number;
  progressLabel: string;
  currentStepIndex: number;
};

function toRoadmap(response: JourneyProgressResponse): Roadmap {
  const completions = [
    response.exploreCompletedAtUtc,
    response.assessCompletedAtUtc,
    response.shortlistCompletedAtUtc,
    response.applyCompletedAtUtc,
    response.enrollCompletedAtUtc,
  ];

  const steps: RoadmapStep[] = JOURNEY_STEP_META.map((meta, index) => {
    const done = completions[index] != null;
    const active = !done && index === response.currentStep;
    const status: RoadmapStatus = done ? 'done' : active ? 'active' : 'upcoming';

    return {
      id: String(index),
      icon: meta.icon,
      title: meta.title,
      description: meta.description,
      status,
      badgeLabel: done ? '✓ Done' : active ? 'Active Focus' : 'Upcoming',
    };
  });

  const completedCount = completions.filter((value) => value != null).length;
  const progressPercent = Math.round((completedCount / completions.length) * 100);

  return {
    steps,
    progressPercent,
    progressLabel: `${progressPercent}% Complete`,
    currentStepIndex: response.currentStep,
  };
}

export const RoadmapService = {
  // GET /api/Journey/progress
  getRoadmap(): Promise<Roadmap> {
    return apiClient.get<JourneyProgressResponse>('/Journey/progress').then(toRoadmap);
  },

  // POST /api/Journey/progress/{step}/complete
  completeStep(step: number): Promise<Roadmap> {
    return apiClient.post<JourneyProgressResponse>(`/Journey/progress/${step}/complete`, {}).then(toRoadmap);
  },
};
