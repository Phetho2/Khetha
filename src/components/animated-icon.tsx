import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SPLASH_BACKGROUND = '#FAFCFB';
const DISPLAY_DURATION = 1800;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const DOT_DELAYS = [0, 120, 240];

function LoadingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 350, easing: EASE_IN_OUT }),
            withTiming(0, { duration: 350, easing: EASE_IN_OUT }),
          ),
          -1,
          false,
        ),
      ),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + progress.get() * 0.65,
    transform: [{ translateY: -3 * progress.get() }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

function LoadingDots() {
  return (
    <View style={styles.dotsRow}>
      {DOT_DELAYS.map((delay) => (
        <LoadingDot key={delay} delay={delay} />
      ))}
    </View>
  );
}

const splashKeyframe = new Keyframe({
  0: {
    opacity: 1,
  },
  75: {
    opacity: 1,
  },
  100: {
    opacity: 0,
    easing: EASE_OUT,
  },
});

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const content = (
    <View style={styles.content}>
      <Image
        style={styles.logo}
        source={require('@/assets/images/khetha-splash-logo.png')}
        contentFit="contain"
      />
      <LoadingDots />
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DISPLAY_DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.splashOverlay, { backgroundColor: SPLASH_BACKGROUND }]}>
      {content}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={[styles.splashOverlay, { backgroundColor: SPLASH_BACKGROUND }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    gap: 28,
  },
  logo: {
    width: 240,
    height: 127,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1b6b51',
  },
});
