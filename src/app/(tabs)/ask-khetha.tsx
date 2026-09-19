import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdvisorMessage } from '@/components/ncap/advisor-message';
import { RoadmapStepRow } from '@/components/ncap/roadmap-step-row';
import { ScreenLoading } from '@/components/ncap/screen-loading';
import { TopNavBar } from '@/components/ncap/top-nav-bar';
import { TypingIndicator } from '@/components/ncap/typing-indicator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { ChatMessage, SuggestedPrompt } from '@/data/ask-khetha';
import { useRoadmap } from '@/hooks/use-roadmap';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { ChatService } from '@/services/chat-service';
import { navigateToJourneyStep } from '@/utils/journey-step-navigation';

const CHAT_CARD_HEIGHT = 600;

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AskKhethaScreen() {
  const theme = useTheme();
  const { learner } = useAuth();
  const chatScrollRef = useRef<ScrollView>(null);
  const nextMessageId = useRef(0);
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>([]);
  const { roadmap, roadmapError, retryRoadmap } = useRoadmap();
  const [inputText, setInputText] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([ChatService.getConversationHistory(), ChatService.getSuggestedPrompts()])
      .then(([history, prompts]) => {
        if (cancelled) return;
        setLoadError(null);
        setMessages(history);
        setSuggestedPrompts(prompts);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(error instanceof ApiError ? error.message : 'Something went wrong loading Ask Khetha.');
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  function generateMessageId(suffix: string) {
    nextMessageId.current += 1;
    return `${nextMessageId.current}-${suffix}`;
  }

  function sendMessage(displayText: string) {
    if (isSending) return;

    const userMessage: ChatMessage = {
      id: generateMessageId('user'),
      sender: 'user',
      text: displayText,
      time: formatTime(),
    };
    setMessages((current) => [...(current ?? []), userMessage]);
    setIsSending(true);

    ChatService.sendMessage(displayText)
      .then((reply) => {
        const aiMessage: ChatMessage = {
          id: generateMessageId('ai'),
          sender: 'ai',
          time: formatTime(),
          ...reply,
        };
        setMessages((current) => [...(current ?? []), aiMessage]);
      })
      .catch((error: unknown) => {
        const errorMessage: ChatMessage = {
          id: generateMessageId('ai-error'),
          sender: 'ai',
          time: formatTime(),
          text:
            error instanceof ApiError
              ? `Couldn't reach the DHET advisor: ${error.message}`
              : "Couldn't reach the DHET advisor. Please try again.",
        };
        setMessages((current) => [...(current ?? []), errorMessage]);
      })
      .finally(() => setIsSending(false));
  }

  function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInputText('');
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn} edges={['top']}>
        <TopNavBar />
        {loadError ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="cloud-off" size={32} color={theme.onSurfaceVariant} />
            <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.errorText}>
              {loadError}
            </ThemedText>
            <Pressable
              onPress={() => setLoadAttempt((attempt) => attempt + 1)}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" themeColor="onPrimary">
                Retry
              </ThemedText>
            </Pressable>
          </View>
        ) : messages === null ? (
          <ScreenLoading label="Loading Ask Khetha..." />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Ask Khetha AI advisor */}
            <View
              style={[
                styles.section,
                styles.chatCard,
                { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder },
              ]}>
              <View style={[styles.advisorHeader, { backgroundColor: theme.surfaceContainerLow }]}>
                <View style={styles.advisorIdentity}>
                  <View style={styles.avatarWrapper}>
                    <View style={[styles.avatar, { backgroundColor: theme.primaryContainer }]}>
                      <MaterialIcons name="smart-toy" size={24} color={theme.onPrimaryContainer} />
                    </View>
                    <View style={[styles.avatarDot, { backgroundColor: theme.secondary }]} />
                  </View>
                  <View style={styles.advisorTextColumn}>
                    <View style={styles.advisorTitleRow}>
                      <ThemedText type="smallBold" themeColor="primary" style={styles.advisorTitle}>
                        Ask Khetha AI
                      </ThemedText>
                      <View style={[styles.guideBadge, { backgroundColor: theme.secondaryContainer }]}>
                        <ThemedText type="small" themeColor="onSecondaryContainer" style={styles.guideBadgeLabel}>
                          DHET Guide
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.advisorSubtitleRow}>
                      <MaterialIcons name="verified" size={13} color={theme.secondary} />
                      <ThemedText type="small" themeColor="onSurfaceVariant">
                        Official Career Intelligence Companion
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.advisorActions}>
                  <Pressable
                    accessibilityLabel="Audio readout"
                    style={({ pressed }) => [
                      styles.advisorIconButton,
                      { backgroundColor: theme.surfaceContainer },
                      pressed && styles.pressed,
                    ]}>
                    <MaterialIcons name="volume-up" size={18} color={theme.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Clear chat"
                    onPress={() => setMessages([])}
                    style={({ pressed }) => [
                      styles.advisorIconButton,
                      { backgroundColor: theme.surfaceContainer },
                      pressed && styles.pressed,
                    ]}>
                    <MaterialIcons name="restart-alt" size={18} color={theme.onSurfaceVariant} />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                ref={chatScrollRef}
                style={styles.chatStream}
                contentContainerStyle={styles.chatStreamContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}>
                {messages.map((message) => (
                  <AdvisorMessage key={message.id} message={message} />
                ))}
                {isSending && (
                  <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
                    <TypingIndicator />
                  </Animated.View>
                )}
              </ScrollView>

              <ScrollView
                horizontal
                style={styles.chipsScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}>
                {suggestedPrompts.map((prompt) => (
                  <Pressable
                    key={prompt.id}
                    onPress={() => sendMessage(`${prompt.emoji} ${prompt.label}`)}
                    style={({ pressed }) => [
                      styles.promptChip,
                      { backgroundColor: theme.surfaceContainer },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="small" numberOfLines={1}>
                      {prompt.emoji} {prompt.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceContainerLow }]}>
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    placeholder="Ask Khetha anything about subjects, careers or colleges..."
                    placeholderTextColor={theme.onSurfaceVariant}
                    style={[styles.textInput, { color: theme.onSurface }]}
                    returnKeyType="send"
                  />
                  <Pressable
                    accessibilityLabel="Voice input"
                    style={({ pressed }) => [styles.inlineIconButton, pressed && styles.pressed]}>
                    <MaterialIcons name="mic" size={20} color={theme.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Send query"
                    onPress={handleSend}
                    style={({ pressed }) => [
                      styles.sendButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressed,
                    ]}>
                    <MaterialIcons name="send" size={18} color={theme.onPrimary} />
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.inputFootnote}>
                  Aligned with DHET Career Development Services • Updates verified weekly
                </ThemedText>
              </View>
            </View>

            {/* Career roadmap */}
            <View style={[styles.section, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
              {!learner ? (
                <View style={styles.roadmapSignInPrompt}>
                  <MaterialIcons name="route" size={28} color={theme.primary} />
                  <ThemedText type="smallBold" themeColor="primary">
                    Track Your Career Roadmap
                  </ThemedText>
                  <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.roadmapSignInText}>
                    Create a free account to save your progress across subjects, assessments, shortlisted careers
                    and funding applications.
                  </ThemedText>
                  <Pressable
                    onPress={() => router.push('/account')}
                    style={({ pressed }) => [
                      styles.roadmapSignInButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="smallBold" themeColor="onPrimary">
                      Sign In / Register
                    </ThemedText>
                  </Pressable>
                </View>
              ) : roadmapError ? (
                <View style={styles.roadmapSignInPrompt}>
                  <MaterialIcons name="cloud-off" size={28} color={theme.onSurfaceVariant} />
                  <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.roadmapSignInText}>
                    {roadmapError}
                  </ThemedText>
                  <Pressable
                    onPress={retryRoadmap}
                    style={({ pressed }) => [
                      styles.roadmapSignInButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="smallBold" themeColor="onPrimary">
                      Retry
                    </ThemedText>
                  </Pressable>
                </View>
              ) : !roadmap ? (
                <ScreenLoading label="Loading your roadmap..." />
              ) : (
                <>
                  <View style={styles.roadmapHeader}>
                    <View>
                      <ThemedText type="smallBold" themeColor="primary" style={styles.roadmapTitle}>
                        My Career Roadmap
                      </ThemedText>
                      <ThemedText type="small" themeColor="onSurfaceVariant">
                        {learner.name ? `${learner.name}'s ` : ''}
                        {learner.grade ? `Grade ${learner.grade} ` : ''}Journey
                      </ThemedText>
                    </View>
                    <View style={styles.roadmapProgressColumn}>
                      <ThemedText type="smallBold" themeColor="primary">
                        {roadmap.progressLabel}
                      </ThemedText>
                      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceContainer }]}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${roadmap.progressPercent}%`, backgroundColor: theme.primary },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.roadmapSteps}>
                    {roadmap.steps.map((step, index) => (
                      <RoadmapStepRow
                        key={step.id}
                        step={step}
                        isLast={index === roadmap.steps.length - 1}
                        onPress={() => navigateToJourneyStep(Number(step.id))}
                      />
                    ))}
                  </View>

                  <View style={[styles.offlinePill, { backgroundColor: theme.surfaceContainerLow }]}>
                    <View style={styles.offlinePillLeft}>
                      <MaterialIcons name="cloud-done" size={18} color={theme.secondary} />
                      <ThemedText type="small" themeColor="secondary">
                        Synced to your Khetha account
                      </ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="outline" style={styles.syncedLabel}>
                      SYNCHRONIZED
                    </ThemedText>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scroll: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  errorText: {
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  scrollContent: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  section: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chatCard: {
    height: CHAT_CARD_HEIGHT,
  },
  advisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  advisorIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  advisorTextColumn: {
    flexShrink: 1,
    gap: 2,
  },
  advisorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  advisorTitle: {
    fontSize: 16,
  },
  guideBadge: {
    paddingHorizontal: Spacing.one,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  guideBadgeLabel: {
    fontSize: 10,
    lineHeight: 13,
  },
  advisorSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  advisorActions: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  advisorIconButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  chatStream: {
    flex: 1,
    minHeight: 0,
  },
  chatStreamContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  chipsScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsRow: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  promptChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  inputRow: {
    padding: Spacing.three,
    paddingTop: 0,
    gap: Spacing.one,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Radius.lg,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    gap: Spacing.half,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  inlineIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFootnote: {
    textAlign: 'center',
    fontSize: 10,
  },
  roadmapSignInPrompt: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  roadmapSignInText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  roadmapSignInButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
  roadmapHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    paddingBottom: 0,
  },
  roadmapTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  roadmapProgressColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  progressTrack: {
    width: 80,
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  roadmapSteps: {
    padding: Spacing.three,
    paddingBottom: 0,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: Spacing.three,
    marginTop: 0,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  offlinePillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  syncedLabel: {
    fontSize: 9,
    letterSpacing: 0.4,
  },
});
