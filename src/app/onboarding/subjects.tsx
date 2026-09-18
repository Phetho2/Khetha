import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useOnboarding } from '@/context/onboarding-context';
import { Radius, Spacing } from '@/constants/theme';

const SUBJECT_GROUPS = [
  {
    title: 'GROUP A COMPULSORY',
    intro: 'Select 4 subjects from group A. Not more than one language shall be offered from the same language group, namely: isiXhosa, isiZulu, SiSwati and isiNdebele; and Sepedi, Sesotho and Setswana. You may not offer both Mathematics and Mathematical Literacy.',
    sections: [
      {
        title: 'OFFICIAL LANGUAGES AT HOME AND FIRST ADDITIONAL LEVEL',
        subjects: ['Afrikaans First Additional', 'English', 'isiNdebele', 'isiXhosa', 'isiZulu', 'SiSwati', 'Sepedi', 'Sesotho', 'Setswana', 'Tshivenda', 'Xitsonga'],
      },
      { title: 'MATHEMATICAL SCIENCES', subjects: ['Mathematical Literacy', 'Mathematics'] },
      { title: 'LIFE ORIENTATION', subjects: ['Life Orientation'] },
    ],
  },
  {
    title: 'GROUP B ELECTIVES',
    intro: 'A minimum 3 subjects selected from Group B, a maximum of 2 additional languages over and above the 2 official languages selected from group A. NB: You can do either Consumer Studies or Hospitality Studies.',
    sections: [
      { title: 'AGRICULTURE', subjects: ['Agricultural Management Practices', 'Agricultural Sciences', 'Agricultural Technology'] },
      { title: 'CULTURE AND ARTS', subjects: ['Dance Studies', 'Design', 'Dramatic Arts', 'Music', 'Visual Arts'] },
      { title: 'BUSINESS, COMMERCE AND MANAGEMENT STUDIES', subjects: ['Accounting', 'Business Studies', 'Economics'] },
      { title: 'ENGINEERING AND TECHNOLOGY', subjects: ['Civil Technology', 'Electrical Technology', 'Mechanical Technology', 'Engineering Graphics and Design'] },
      { title: 'HUMAN AND SOCIAL STUDIES', subjects: ['Geography', 'History', 'Religion Studies'] },
      { title: 'PHYSICAL, MATHEMATICAL, COMPUTER AND LIFE SCIENCES', subjects: ['Computer Applications Technology', 'Information Technology', 'Life Sciences', 'Physical Sciences'] },
      { title: 'SERVICES', subjects: ['Consumer Studies', 'Hospitality Studies', 'Tourism'] },
      { title: 'OFFICIAL LANGUAGES AT SECOND ADDITIONAL LEVEL, AND NON-OFFICIAL LANGUAGES', subjects: ['Afrikaans', 'isiXhosa second additional', 'isiZulu second additional', 'SiSwati second additional', 'Sepedi second additional', 'Sesotho second additional', 'Setswana second additional', 'Tshivenda second additional', 'Xitsonga second additional', 'Arabic', 'French', 'German', 'Gujarati', 'Hebrew', 'Hindi', 'Italian', 'Latin', 'Portuguese'] },
    ],
  },
] as const;

const DEFAULT_SELECTION = ['English', 'isiNdebele', 'Mathematical Literacy', 'Life Orientation'];

export default function SubjectsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { setSubjects } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [isReviewing, setIsReviewing] = useState(false);
  const selectedCounts = useMemo(
    () => SUBJECT_GROUPS.map((group) => group.sections.reduce((count, section) => count + section.subjects.filter((subject) => selected.includes(subject)).length, 0)),
    [selected],
  );
  const selectedByGroup = useMemo(
    () => SUBJECT_GROUPS.map((group) => group.sections.flatMap((section) => section.subjects.filter((subject) => selected.includes(subject)))),
    [selected],
  );

  const toggleSubject = (subject: string) => {
    setSelected((current) =>
      current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject],
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialIcons name="chevron-left" size={28} color={theme.onSurface} />
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant">Step 3 of 4</ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceContainer }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '75%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>{isReviewing ? 'Review your subjects' : 'Choose your subjects'}</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant">
          {isReviewing ? 'Check your selections before submitting.' : 'Select the subjects you are taking so we can tailor your career advice.'}
        </ThemedText>

        {!isReviewing && <View style={[styles.summary, { borderColor: theme.outlineVariant }]}>
          <ThemedText type="smallBold" themeColor="onSurfaceVariant">Selected subjects</ThemedText>
          <ThemedText type="small" themeColor="onSurfaceVariant">{selected.join(', ') || 'No subjects selected yet'}</ThemedText>
        </View>}

        {isReviewing ? SUBJECT_GROUPS.map((group, groupIndex) => (
          <View key={group.title} style={[styles.summary, { borderColor: theme.outlineVariant }]}>
            <ThemedText type="smallBold">{group.title}</ThemedText>
            <ThemedText type="small" themeColor="onSurfaceVariant">
              {selectedByGroup[groupIndex].join(', ') || 'No subjects selected'}
            </ThemedText>
          </View>
        )) : SUBJECT_GROUPS.map((group, groupIndex) => (
          <View key={group.title} style={styles.group}>
            <ThemedText type="smallBold" style={styles.groupTitle}>{group.title}</ThemedText>
            <ThemedText type="small" themeColor="onSurfaceVariant">{group.intro}</ThemedText>
            {group.sections.map((section) => (
              <View key={section.title} style={styles.section}>
                <ThemedText type="smallBold" themeColor="onSurfaceVariant">{section.title}</ThemedText>
                <View style={styles.chipGrid}>
                  {section.subjects.map((subject) => {
                    const isSelected = selected.includes(subject);
                    return (
                      <Pressable
                        key={subject}
                        onPress={() => toggleSubject(subject)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        style={[styles.chip, { borderColor: isSelected ? theme.primary : theme.outlineVariant, backgroundColor: isSelected ? theme.primary : theme.surfaceContainerLowest }]}
                      >
                        <ThemedText type="smallBold" themeColor={isSelected ? 'onPrimary' : 'onSurface'}>{subject}</ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <ThemedText type="small" themeColor="onSurfaceVariant">{selectedCounts[groupIndex]} selected</ThemedText>
          </View>
        ))}

        {isReviewing ? (
          <View style={styles.actions}>
            <Pressable onPress={() => setIsReviewing(false)} style={[styles.secondaryButton, { borderColor: theme.outlineVariant }]}>
              <ThemedText type="smallBold" themeColor="onSurface">Edit subjects</ThemedText>
            </Pressable>
            <Pressable onPress={() => {
              setSubjects(selected);
              router.replace('/onboarding/review');
            }} style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
              <ThemedText type="smallBold" themeColor="onPrimary">Submit</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsReviewing(true)}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: selectedCounts[0] >= 4 && selectedCounts[1] >= 3 ? theme.primary : theme.surfaceContainerHigh }, pressed && selectedCounts[0] >= 4 && selectedCounts[1] >= 3 && styles.pressed]}
            disabled={selectedCounts[0] < 4 || selectedCounts[1] < 3}
          >
            <ThemedText type="smallBold" themeColor={selectedCounts[0] >= 4 && selectedCounts[1] >= 3 ? 'onPrimary' : 'onSurfaceVariant'}>Review selections</ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.one },
  progressTrack: { height: 5, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  content: { paddingTop: Spacing.four, paddingBottom: Spacing.five, gap: Spacing.two },
  title: { fontSize: 26, lineHeight: 32 },
  summary: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.two, gap: Spacing.one },
  group: { gap: Spacing.one, marginTop: Spacing.two },
  groupTitle: { fontSize: 16 },
  section: { gap: Spacing.one, marginTop: Spacing.two },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { minHeight: 38, paddingHorizontal: Spacing.two, borderWidth: 1, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  actions: { gap: Spacing.two, marginTop: Spacing.two },
  secondaryButton: { height: 52, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.85 },
});
