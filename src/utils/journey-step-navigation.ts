import { router } from 'expo-router';
import { Alert } from 'react-native';

import { JOURNEY_STEP } from '@/data/journey';

export function navigateToJourneyStep(stepId: number) {
  switch (stepId) {
    case JOURNEY_STEP.explore:
      router.push('/subject-chooser');
      break;
    case JOURNEY_STEP.assess:
      router.push('/career-job-fit');
      break;
    case JOURNEY_STEP.shortlist:
      router.push('/shortlist');
      break;
    default:
      Alert.alert('Coming Soon', "We're still building this part of your journey.");
  }
}
