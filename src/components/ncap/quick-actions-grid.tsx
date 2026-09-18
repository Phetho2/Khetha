import { MaterialIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuickAction = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBackground: keyof ReturnType<typeof useTheme>;
  iconColor: keyof ReturnType<typeof useTheme>;
  title: string;
  subtitle: string;
  href?: Href;
};

const ACTIONS: QuickAction[] = [
  {
    id: 'subject-chooser',
    icon: 'menu-book',
    iconBackground: 'secondaryContainer',
    iconColor: 'onSecondaryContainer',
    title: 'Subject Chooser',
    subtitle: 'Grade 10-12 combo',
    href: '/subject-chooser',
  },
  {
    id: 'career-job-fit',
    icon: 'psychology',
    iconBackground: 'secondaryContainer',
    iconColor: 'onSecondaryContainer',
    title: 'Job Fit Finder',
    subtitle: 'Strengths & values',
    href: '/career-job-fit',
  },
  {
    id: 'occupations-directory',
    icon: 'local-fire-department',
    iconBackground: 'tertiaryContainer',
    iconColor: 'onTertiaryContainer',
    title: 'High Demand',
    subtitle: 'National scarce skills',
  },
  {
    id: 'ask-khetha',
    icon: 'smart-toy',
    iconBackground: 'surfaceContainerHigh',
    iconColor: 'primary',
    title: 'Ask Khetha AI',
    subtitle: '24/7 Advisor chat',
    href: '/ask-khetha',
  },
];

export function QuickActionsGrid() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Guidance Toolset
        </ThemedText>
        <ThemedText type="smallBold" themeColor="secondary">
          Fast Access
        </ThemedText>
      </View>

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            onPress={() =>
              action.href
                ? router.push(action.href)
                : Alert.alert('Coming Soon', "We're still building this part of Khetha.")
            }
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.iconCircle, { backgroundColor: theme[action.iconBackground] }]}>
              <MaterialIcons name={action.icon} size={20} color={theme[action.iconColor]} />
            </View>
            <View style={styles.textColumn}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {action.title}
              </ThemedText>
              <ThemedText type="small" themeColor="outline" numberOfLines={1}>
                {action.subtitle}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 116,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    gap: 2,
  },
});
