import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Onboard } from '@/components/ncap/onboarding-ui';
import { useOnboarding } from '@/context/onboarding-context';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ReviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { audience, fullName, age, province, track, grade, disability, subjects } = useOnboarding();
  const audienceLabel = audience === 'school' ? "I'm still at school" : audience === 'finished' ? "I've finished school" : 'I help others choose';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <ThemedText style={styles.back}>‹</ThemedText>
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant">Step 4 of 4</ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceContainer }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Review and submit</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant">Check your details before entering Khetha.</ThemedText>

        <SummaryRow label="Name" value={fullName || 'Not provided'} onEdit={() => router.replace('/onboarding/account')} />
        <SummaryRow label="Audience" value={audienceLabel} onEdit={() => router.replace('/onboarding/welcome')} />
        <SummaryRow label="Age" value={age || 'Not provided'} onEdit={() => router.replace('/onboarding/profile')} />
        <SummaryRow label="Province" value={province || 'Not provided'} onEdit={() => router.replace('/onboarding/profile')} />
        <SummaryRow label="Study status" value={track || 'Not provided'} onEdit={() => router.replace('/onboarding/profile')} />
        <SummaryRow label="Grade" value={grade || 'Not applicable'} onEdit={() => router.replace('/onboarding/profile')} />
        <SummaryRow label="Disability support" value={disability || 'Not provided'} onEdit={() => router.replace('/onboarding/profile')} />

        {audience === 'school' && (
          <SummaryRow label="Subjects" value={subjects.join(', ') || 'No subjects selected'} onEdit={() => router.replace('/onboarding/subjects')} />
        )}

        <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.submit, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="smallBold" themeColor="onPrimary">Submit and enter Khetha</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderColor: theme.outlineVariant }]}>
      <View style={styles.copy}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <ThemedText type="small" themeColor="onSurfaceVariant">{value}</ThemedText>
      </View>
      <Pressable onPress={onEdit} accessibilityRole="button">
        <ThemedText type="smallBold" themeColor="secondary">Edit</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.one },
  back: { fontSize: 30, lineHeight: 32, color: Onboard.navy },
  progressTrack: { height: 5, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', width: '100%', borderRadius: 4 },
  content: { paddingTop: Spacing.four, paddingBottom: Spacing.five, gap: Spacing.two },
  title: { fontSize: 26, lineHeight: 32 },
  row: { minHeight: 64, borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.two, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  copy: { flex: 1, gap: Spacing.one },
  submit: { minHeight: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  pressed: { opacity: 0.85 },
});
