import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useOnboarding } from '@/context/onboarding-context';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Image } from 'expo-image';

const routes = [
  { id: 'school', title: "I'm still at school", subtitle: 'Grade 8–12 · subject and career choices', icon: 'school' as const, target: '/onboarding/account' as const },
  { id: 'finished', title: "I've finished school", subtitle: 'Studying, working or looking for work', icon: 'work' as const, target: '/onboarding/account' as const },
  { id: 'help', title: 'I help others choose', subtitle: 'Parent, teacher or career practitioner', icon: 'groups' as const, target: '/onboarding/account' as const },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { setAudience } = useOnboarding();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.top}>
        <Image source={require('@/assets/images/khetha-logo.png')} style={styles.logo} contentFit="contain" />
        <View style={styles.languagePill}>
          <ThemedText type="smallBold">EN</ThemedText>
          <MaterialIcons name="expand-more" size={16} color={theme.onSurfaceVariant} />
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Where are you{'\n'}right now?</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.description}>
          We&apos;ll shape your advice around you. You can change this later.
        </ThemedText>

        <View style={styles.routes}>
          {routes.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setAudience(item.id as 'school' | 'finished' | 'helper');
                router.push(item.target);
              }}
              style={({ pressed }) => [
                styles.routeCard,
                { borderColor: index === 0 ? theme.primary : theme.outlineVariant, backgroundColor: index === 0 ? theme.primaryFixed : theme.surfaceContainerLowest },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.routeIcon}>
                <MaterialIcons name={item.icon} size={22} color={theme.primary} />
              </View>
              <View style={styles.routeText}>
                <ThemedText type="smallBold">{item.title}</ThemedText>
                <ThemedText type="small" themeColor="onSurfaceVariant">{item.subtitle}</ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={theme.outline} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="onSurfaceVariant">Been here before? </ThemedText>
        <Pressable onPress={() => router.push('/onboarding/login')}>
          <ThemedText type="smallBold" themeColor="secondary">Sign in</ThemedText>
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant"> </ThemedText>
        <Pressable onPress={() => router.push('/onboarding/browse')}>
          <ThemedText type="smallBold" style={styles.underline}>Just look around first</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.two },
  logo: { width: 112, height: 62 },
  languagePill: { flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 1, borderColor: '#D9DEE7', borderRadius: Radius.full, paddingHorizontal: Spacing.two, height: 32 },
  content: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 30, lineHeight: 34, marginBottom: Spacing.two },
  description: { lineHeight: 20, marginBottom: Spacing.four },
  routes: { gap: Spacing.two },
  routeCard: { minHeight: 66, borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.two, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  routeIcon: { width: 38, height: 38, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  routeText: { flex: 1, gap: 2 },
  pressed: { opacity: 0.86 },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingBottom: Spacing.four },
  underline: { textDecorationLine: 'underline' },
});
