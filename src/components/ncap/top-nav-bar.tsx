import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useTheme } from '@/hooks/use-theme';

export function TopNavBar() {
  const theme = useTheme();
  const { learner } = useAuth();
  const isOnline = useNetworkStatus();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: theme.surfaceContainerLowest, borderBottomColor: theme.cardBorder }]}>
        <Image
          source={require('@/assets/images/dhet-logo.jpg')}
          style={styles.dhetLogo}
          contentFit="contain"
        />
        <View style={styles.rightGroup}>
          <Image
            source={require('@/assets/images/khetha-logo.png')}
            style={styles.khethaLogo}
            contentFit="contain"
          />
          <Pressable
            accessibilityLabel={learner ? 'My account' : 'Log in'}
            onPress={() => router.push('/account')}
            style={({ pressed }) => [
              styles.accountButton,
              { backgroundColor: theme.surfaceContainer },
              pressed && styles.pressed,
            ]}>
            <MaterialIcons name="account-circle" size={22} color={learner ? theme.primary : theme.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      {!isOnline && (
        <View style={[styles.offlineStrip, { backgroundColor: theme.tertiaryContainer }]}>
          <MaterialIcons name="cloud-off" size={14} color={theme.onTertiaryContainer} />
          <ThemedText type="small" themeColor="onTertiaryContainer">
            You&apos;re offline — showing saved data
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.two,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  dhetLogo: {
    height: 48,
    width: 128,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  khethaLogo: {
    height: 34,
    width: 78,
  },
  accountButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  offlineStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
});
