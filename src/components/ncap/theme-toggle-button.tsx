import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';
import { useThemePreference } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/use-theme';

// A sun / quarter-moon toggle for switching between light and dark mode.
export function ThemeToggleButton() {
  const theme = useTheme();
  const { scheme, setPreference } = useThemePreference();
  const isDark = scheme === 'dark';

  return (
    <Pressable
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      onPress={() => setPreference(isDark ? 'light' : 'dark')}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.surfaceContainer }, pressed && styles.pressed]}>
      <MaterialIcons
        name={isDark ? 'nightlight-round' : 'wb-sunny'}
        size={20}
        color={isDark ? theme.primary : theme.tertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
