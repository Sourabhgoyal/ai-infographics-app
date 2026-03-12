import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact, Haptics } from '../utils/haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { QUIZ_QUESTIONS, QUIZ_COUNT } from '../data/quiz';

const { width: W } = Dimensions.get('window');
const CARD_WIDTH = Math.min(W * 0.88, 420);
const CARD_PAD = 16;
const ITEM_WIDTH = CARD_WIDTH + CARD_PAD * 2;

function QuizCard({ item, index, totalRemaining, onNext }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const correctIndex = item.correctIndex;
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === correctIndex;

  const handleSelect = useCallback((optionIndex) => {
    if (selectedIndex !== null) return;
    hapticImpact(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIndex(optionIndex);
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    hapticImpact(Haptics.ImpactFeedbackStyle.Light);
    onNext?.(item.id);
  }, [item.id, onNext]);

  const getOptionStyle = (optionIndex) => {
    if (!answered) {
      return [styles.optionBtn, styles.optionBtnDefault];
    }
    const isSelected = optionIndex === selectedIndex;
    const isCorrectOption = optionIndex === correctIndex;
    if (isCorrectOption) return [styles.optionBtn, styles.optionCorrect];
    if (isSelected && !isCorrect) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionBtnDisabled];
  };

  return (
    <View style={[styles.cardWrapper, { width: ITEM_WIDTH }]}>
      <View style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={styles.cardInner}>
        <View style={styles.topicRow}>
          <Text style={[styles.topicLabel, typography.labelMedium]}>{item.topic}</Text>
          <Text style={[styles.questionNum, typography.labelMedium]}>{index + 1} / {totalRemaining}</Text>
        </View>
        <Text style={[styles.questionText, typography.titleMedium]}>{item.question}</Text>

        <View style={styles.optionsContainer}>
          {item.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={getOptionStyle(optionIndex)}
              onPress={() => handleSelect(optionIndex)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionLetter, typography.labelLarge]}>
                {String.fromCharCode(65 + optionIndex)}.
              </Text>
              <Text style={[styles.optionText, typography.bodyMedium]} numberOfLines={3}>
                {option}
              </Text>
              {answered && optionIndex === correctIndex && (
                <Text style={styles.checkMark}>✓</Text>
              )}
              {answered && optionIndex === selectedIndex && !isCorrect && (
                <Text style={styles.crossMark}>✗</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {answered && (
          <View style={styles.conceptBox}>
            <Text style={[styles.conceptTitle, typography.labelLarge]}>💡 Concept</Text>
            <ScrollView style={styles.conceptScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.conceptText, typography.bodyMedium]}>{item.concept}</Text>
            </ScrollView>
            <View style={styles.correctBadge}>
              <Text style={[styles.correctBadgeText, typography.labelMedium]}>
                {isCorrect ? '✓ Correct!' : `Correct: ${item.options[correctIndex]}`}
              </Text>
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={[styles.nextBtnText, typography.labelLarge]}>Next question →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </View>
    </View>
  );
}

export function QuizScreen() {
  const insets = useSafeAreaInsets();
  const [answeredIds, setAnsweredIds] = useState(() => new Set());
  const remainingQuestions = QUIZ_QUESTIONS.filter((q) => !answeredIds.has(q.id));

  const handleAnswered = useCallback((questionId) => {
    setAnsweredIds((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <QuizCard
        item={item}
        index={index}
        totalRemaining={remainingQuestions.length}
        onNext={handleAnswered}
      />
    ),
    [remainingQuestions.length, handleAnswered]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={[styles.title, typography.headlineMedium]}>Quiz</Text>
        <Text style={[styles.subtitle, typography.bodyMedium]}>
          Swipe left/right • Tap an answer to see correct answer & concept • Tap "Next question" to continue
        </Text>
      </View>

      {remainingQuestions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, typography.titleLarge]}>🎉 All done!</Text>
          <Text style={[styles.emptySubtitle, typography.bodyMedium]}>
            You've answered all {QUIZ_COUNT} questions. Come back later for more.
          </Text>
        </View>
      ) : (
        <FlatList
          data={remainingQuestions}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          horizontal
          pagingEnabled={false}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: CARD_PAD }]}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: CARD_PAD + ITEM_WIDTH * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  cardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 380,
  },
  cardInner: {
    padding: 20,
    flex: 1,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicLabel: {
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionNum: {
    color: colors.textMuted,
  },
  questionText: {
    color: colors.text,
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 10,
  },
  optionBtnDefault: {
    backgroundColor: colors.bgSurface,
    borderColor: colors.border,
  },
  optionBtnDisabled: {
    backgroundColor: colors.bgSurface,
    borderColor: colors.border,
    opacity: 0.7,
  },
  optionCorrect: {
    backgroundColor: colors.successDim,
    borderColor: colors.success,
  },
  optionWrong: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    borderColor: colors.error,
  },
  optionLetter: {
    color: colors.textMuted,
    minWidth: 22,
  },
  optionText: {
    flex: 1,
    color: colors.text,
  },
  checkMark: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '700',
  },
  crossMark: {
    fontSize: 18,
    color: colors.error,
    fontWeight: '700',
  },
  conceptBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.accentDim,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.25)',
  },
  conceptTitle: {
    color: colors.text,
    marginBottom: 8,
  },
  conceptScroll: {
    maxHeight: 140,
    marginBottom: 12,
  },
  conceptText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  correctBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  correctBadgeText: {
    color: colors.success,
  },
  nextBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: colors.textOnPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
