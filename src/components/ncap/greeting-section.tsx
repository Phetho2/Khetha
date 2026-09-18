import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LearnerProfile } from '@/data/auth';

export function GreetingSection({ learner }: { learner: LearnerProfile | null }) {
  return (
    <View style={styles.container}>
      {learner ? (
        <>
          <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.eyebrow}>
            {learner.grade ? `Grade ${learner.grade}` : 'Khetha Learner'}
            {learner.track ? ` • ${learner.track}` : ''}
          </ThemedText>
          <ThemedText type="title" style={styles.headline}>
            Dumela, {learner.name}
          </ThemedText>
          <ThemedText themeColor="textSecondary">Here&apos;s where you left off in your career journey.</ThemedText>
        </>
      ) : (
        <>
          <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.eyebrow}>
            Welcome to Khetha
          </ThemedText>
          <ThemedText type="title" style={styles.headline}>
            Dumela!
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Explore careers, take the job-fit quiz, or sign in to track your journey.
          </ThemedText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  headline: {
    fontSize: 24,
    lineHeight: 30,
  },
});
