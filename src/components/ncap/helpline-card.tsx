import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const HELPLINE_NUMBER = '0800872222';
const HELPLINE_DISPLAY = '0800 87 22 22';

export function HelplineCard() {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={styles.topRow}>
        <ThemedText type="smallBold" themeColor="primary" style={styles.liveLabel}>
          Official DHET Helpline
        </ThemedText>
        <ThemedText type="smallBold" themeColor="secondary">
          Toll-Free in SA
        </ThemedText>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => Linking.openURL(`tel:${HELPLINE_NUMBER}`)}
          style={({ pressed }) => [styles.callButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
            {HELPLINE_DISPLAY}
          </ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.whatsAppButton,
            { backgroundColor: theme.surfaceContainerHigh },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold">WhatsApp Advisor</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="small" themeColor="outline" style={styles.footnote}>
        Mon–Fri 08:00 to 16:30 • Speaks all 11 official languages
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveLabel: {
    letterSpacing: 0.4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  callButton: {
    flex: 1,
    height: 48,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  whatsAppButton: {
    flex: 1,
    height: 48,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.85,
  },
  footnote: {
    textAlign: 'center',
  },
});
