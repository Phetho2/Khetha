import { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { QUOTES } from '@/data/quotes';
import { useTheme } from '@/hooks/use-theme';

const AUTO_ADVANCE_INTERVAL_MS = 7000;

export function QuoteCarousel() {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    if (QUOTES.length <= 1 || pageWidth === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % QUOTES.length;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * pageWidth, animated: true });
    }, AUTO_ADVANCE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [pageWidth]);

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (pageWidth === 0) return;
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    indexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }

  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Words of Wisdom
      </ThemedText>

      <View onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}>
          {QUOTES.map((quote) => (
            <View key={quote.id} style={{ width: pageWidth }}>
              <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
                <ThemedText type="default" style={styles.quoteText}>
                  &ldquo;{quote.text}&rdquo;
                </ThemedText>
                <ThemedText type="smallBold" themeColor="primary" style={styles.author}>
                  — {quote.author}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dotsRow}>
        {QUOTES.map((quote, index) => (
          <View
            key={quote.id}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? theme.primary : theme.surfaceContainerHigh },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
    minHeight: 140,
    justifyContent: 'center',
  },
  quoteText: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  author: {
    textAlign: 'right',
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
