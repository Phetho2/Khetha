import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding-context';

const provinces = ['KwaZulu-Natal', 'Gauteng', 'Western Cape', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'];
const tracks = ['School', 'TVET college', 'University', 'Not studying'];
const grades = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Not applicable'];

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { audience, setProfile } = useOnboarding();
  const [age, setAge] = useState('17');
  const [province, setProvince] = useState('KwaZulu-Natal');
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [track, setTrack] = useState('School');
  const [grade, setGrade] = useState('Grade 11');
  const [disability, setDisability] = useState('No');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialIcons name="chevron-left" size={28} color={theme.onSurface} />
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant">Step 2 of 4</ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceContainer }]}><View style={[styles.progressFill, { backgroundColor: theme.primary, width: '50%' }]} /></View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>A bit about you</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant">This helps us show providers and funding near you.</ThemedText>

        <View style={styles.twoCol}>
          <Field label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
          <View style={styles.field}>
            <ThemedText type="small" themeColor="onSurfaceVariant">Province</ThemedText>
            <Pressable
              onPress={() => setProvinceOpen((value) => !value)}
              style={[styles.fieldBox, { borderColor: theme.outlineVariant }]}
              accessibilityRole="button"
              accessibilityLabel="Select province"
            >
              <ThemedText type="smallBold" style={styles.fieldValue}>{province}</ThemedText>
              <MaterialIcons name={provinceOpen ? 'expand-less' : 'expand-more'} size={18} color={theme.outline} />
            </Pressable>
            {provinceOpen && (
              <View style={[styles.dropdown, { borderColor: theme.outlineVariant, backgroundColor: theme.surfaceContainerLowest }]}>
                {provinces.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setProvince(item);
                      setProvinceOpen(false);
                    }}
                    style={[styles.dropdownOption, province === item && { backgroundColor: theme.primaryFixed }]}
                  >
                    <ThemedText type="smallBold">{item}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <ThemedText type="smallBold" themeColor="onSurfaceVariant" style={styles.sectionLabel}>I am in</ThemedText>
        <View style={styles.chipGrid}>
          {tracks.map((item) => {
            const selected = track === item;
            return <Chip key={item} label={item} selected={selected} onPress={() => setTrack(item)} />;
          })}
        </View>

        <ThemedText type="smallBold" themeColor="onSurfaceVariant" style={styles.sectionLabel}>Grade</ThemedText>
        <View style={styles.chipGrid}>
          {grades.map((item) => {
            const selected = grade === item;
            return <Chip key={item} label={item} selected={selected} onPress={() => setGrade(item)} />;
          })}
        </View>

        <View style={[styles.disabilityCard, { borderColor: theme.outlineVariant }]}>
          <ThemedText type="smallBold">Do you live with a disability?</ThemedText>
          <ThemedText type="small" themeColor="onSurfaceVariant">We&apos;ll suggest providers with the right support.</ThemedText>
          <View style={styles.chipGrid}>
            {['Yes', 'No', 'Rather not say'].map((item) => {
              const selected = disability === item;
              return <Chip key={item} label={item} selected={selected} onPress={() => setDisability(item)} />;
            })}
          </View>
        </View>

        <Pressable onPress={() => {
          setProfile({ age, province, track, grade, disability });
          router.replace(audience === 'school' ? '/onboarding/subjects' : '/onboarding/review');
        }} style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="smallBold" themeColor="onPrimary">Save and continue</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'number-pad' }) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="onSurfaceVariant">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[styles.fieldBox, styles.fieldInput, { color: theme.onSurface, borderColor: theme.outlineVariant }]}
      />
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.chip, { borderColor: selected ? theme.primary : theme.outlineVariant, backgroundColor: selected ? theme.primary : theme.surfaceContainerLowest }]}>
      <ThemedText type="smallBold" themeColor={selected ? 'onPrimary' : 'onSurface'}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.one },
  progressTrack: { height: 5, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  content: { paddingTop: Spacing.four, paddingBottom: Spacing.five, gap: Spacing.two },
  title: { fontSize: 26, lineHeight: 32 },
  twoCol: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  field: { flex: 1, gap: Spacing.one },
  fieldBox: { minHeight: 54, borderWidth: 1, borderRadius: Radius.lg, paddingHorizontal: Spacing.two, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldValue: { flexShrink: 1 },
  fieldInput: { fontSize: 16 },
  dropdown: { borderWidth: 1, borderRadius: Radius.lg, marginTop: Spacing.one, overflow: 'hidden' },
  dropdownOption: { minHeight: 44, justifyContent: 'center', paddingHorizontal: Spacing.two },
  sectionLabel: { marginTop: Spacing.two },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { minHeight: 38, paddingHorizontal: Spacing.two, borderWidth: 1, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  disabilityCard: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.three, gap: Spacing.one, marginTop: Spacing.two },
  primaryButton: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  pressed: { opacity: 0.85 },
});
