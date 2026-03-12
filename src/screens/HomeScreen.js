import React, { useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact, Haptics } from '../utils/haptics';
import { CircularProgress } from '../components/CircularProgress';
import { INFOGRAPHICS, CATEGORIES, TOTAL_COUNT } from '../data/infographics';
import { colors, categoryColors, categoryIcons } from '../theme/colors';
import { typography } from '../theme/typography';
import { ProgressContext } from '../context/ProgressContext';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48) / 2;

// Group images by category
const imagesByCategory = CATEGORIES.map((cat) =>
  INFOGRAPHICS.filter((img) => img.catIdx === cat.id)
);

export function HomeScreen({ navigation }) {
  const { readSet, readCount, percentage, getCategoryProgress } = useContext(ProgressContext);
  const insets = useSafeAreaInsets();

  const handleContinue = useCallback(() => {
    // Find first unread infographic
    const firstUnread = INFOGRAPHICS.find((img) => !readSet.has(img.id));
    const startIndex = firstUnread ? firstUnread.id : 0;
    hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Feed', { startIndex });
  }, [readSet, navigation]);

  const handleCategoryPress = useCallback((catImages) => {
    if (catImages.length === 0) return;
    const firstUnread = catImages.find((img) => !readSet.has(img.id)) ?? catImages[0];
    hapticImpact(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Feed', { startIndex: firstUnread.id });
  }, [readSet, navigation]);

  const allDone = readCount === TOTAL_COUNT;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, typography.headlineLarge]}>AI Infographics</Text>
          <Text style={[styles.subtitle, typography.bodyMedium]}>Daily Dose of Data Science</Text>
        </View>

        {/* Progress ring */}
        <View style={styles.ringContainer}>
          <CircularProgress size={180} percentage={percentage} strokeWidth={14} />
          <Text style={[styles.statsText, typography.bodyMedium]}>
            {readCount} of {TOTAL_COUNT} infographics read
          </Text>
          {allDone && (
            <Text style={[styles.congrats, typography.labelLarge]}>🎉 You've completed everything!</Text>
          )}
        </View>

        {/* CTA button */}
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={[styles.ctaBtnText, typography.labelLarge]}>
            {readCount === 0 ? '🚀  Start Reading' : allDone ? '🔄  Review All' : '▶  Continue Reading'}
          </Text>
        </TouchableOpacity>

        {/* Category grid */}
        <Text style={[styles.sectionTitle, typography.titleMedium]}>Topics</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((cat, i) => {
            const catImages = imagesByCategory[i];
            const { read, total } = getCategoryProgress(catImages);
            const pct = total > 0 ? Math.round((read / total) * 100) : 0;
            const color = categoryColors[i];
            const icon = categoryIcons[i];
            const done = read === total;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, done && styles.catCardDone]}
                onPress={() => handleCategoryPress(catImages)}
                activeOpacity={0.75}
              >
                <View style={[styles.catIconBg, { backgroundColor: color + '22' }]}>
                  <Text style={styles.catIcon}>{icon}</Text>
                </View>
                <Text style={[styles.catName, typography.labelMedium]} numberOfLines={2}>{cat.name}</Text>
                <View style={styles.catMeta}>
                  <Text style={[styles.catPct, { color }]}>{pct}%</Text>
                  <Text style={styles.catCount}>{read}/{total}</Text>
                </View>
                {/* Mini progress bar */}
                <View style={styles.miniTrack}>
                  <View style={[styles.miniFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                {done && <Text style={styles.doneCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { marginTop: 12, marginBottom: 28 },
  title: {
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 24,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  congrats: {
    marginTop: 8,
    color: colors.success,
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? { boxShadow: `0 2px 8px ${colors.accent}66` }
      : {
          shadowColor: colors.accent,
          shadowOpacity: 0.35,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }),
  },
  ctaBtnText: {
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  catCard: {
    width: CARD_W,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  catCardDone: {
    borderColor: colors.successDim,
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
  },
  catIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  catIcon: { fontSize: 20 },
  catName: {
    color: colors.text,
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
  },
  catMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catPct: { fontSize: 14, fontWeight: '600' },
  catCount: { fontSize: 11, color: colors.textMuted },
  miniTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniFill: { height: 3, borderRadius: 2 },
  doneCheck: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontSize: 16,
    color: colors.success,
    fontWeight: '600',
  },
});
