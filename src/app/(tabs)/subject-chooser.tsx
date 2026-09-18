import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ncap/screen-header';
import { SubjectPlanner } from '@/components/ncap/subject-planner';
import { TopNavBar } from '@/components/ncap/top-nav-bar';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function SubjectChooserScreen() {
  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn} edges={['top']}>
        <TopNavBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Subject Chooser"
            subtitle="Plan your subjects, calculate your APS, and see which courses they unlock"
          />

          <SubjectPlanner />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: BottomTabInset + Spacing.four,
  },
});
