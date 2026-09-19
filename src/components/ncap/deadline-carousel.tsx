import { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { Deadline } from '@/data/deadlines';
import { useTheme } from '@/hooks/use-theme';

import { DeadlineBanner } from './deadline-banner';

const AUTO_ADVANCE_INTERVAL_MS = 5000;

export function DeadlineCarousel({ deadlines }: { deadlines: Deadline[] }) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    if (deadlines.length <= 1 || pageWidth === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % deadlines.length;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * pageWidth, animated: true });
    }, AUTO_ADVANCE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [deadlines.length, pageWidth]);

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (pageWidth === 0) return;
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    indexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }

  return (
    <View style={styles.container} onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}>
        {deadlines.map((deadline) => (
          <View key={deadline.id} style={{ width: pageWidth }}>
            <DeadlineBanner
              eyebrow={deadline.eyebrow}
              daysLeftLabel={deadline.daysLeftLabel}
              title={deadline.title}
              description={deadline.description}
              tone={deadline.tone}
            />
          </View>
        ))}
      </ScrollView>

      {deadlines.length > 1 && (
        <View style={styles.dotsRow}>
          {deadlines.map((deadline, index) => (
            <View
              key={deadline.id}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? theme.primary : theme.surfaceContainerHigh },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
});
