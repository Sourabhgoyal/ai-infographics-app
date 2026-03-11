import React, { useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CircularProgress } from '../components/CircularProgress';
import { INFOGRAPHICS, CATEGORIES, TOTAL_COUNT } from '../data/infographics';
import { colors, categoryColors, categoryIcons } from '../theme/colors';
import { ProgressContext } from '../../App';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Feed', { startIndex });
  }, [readSet, navigation]);

  const handleCategoryPress = useCallback((catImages) => {
    if (catImages.length === 0) return;
    const firstUnread = catImages.find((img) => !readSet.has(img.id)) ?? catImages[0];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Feed', { startIndex: firstUnread.id });
  }, [readSet, navigation]);

  const allDone = readCount === TOTAL_COUNT;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Infographics</Text>
          <Text style={styles.subtitle}>Daily Dose of Data Science</Text>
        </View>

        {/* Progress ring */}
        <View style={styles.ringContainer}>
          <CircularProgress size={180} percentage={percentage} strokeWidth={14} />
          <Text style={styles.statsText}>
            {readCount} of {TOTAL_COUNT} infographics read
          </Text>
          {allDone && (
            <Text style={styles.congrats}>🎉 You've completed everything!</Text>
          )}
        </View>

        {/* CTA button */}
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>
            {readCount === 0 ? '🚀  Start Reading' : allDone ? '🔄  Review All' : '▶  Continue Reading'}
          </Text>
        </TouchableOpacity>

        {/* Category grid */}
        <Text style={styles.sectionTitle}>Topics</Text>
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
                <Text style={styles.catName} numberOfLines={2}>{cat.name}</Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 24,
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsText: {
    marginTop: 16,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  congrats: {
    marginTop: 8,
    fontSize: 15,
    color: colors.success,
    fontWeight: '700',
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
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
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  catCardDone: {
    borderColor: 'rgba(74, 222, 128, 0.25)',
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
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
    fontSize: 13,
    fontWeight: '700',
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
  catPct: { fontSize: 14, fontWeight: '800' },
  catCount: { fontSize: 11, color: colors.textMuted },
  miniTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    fontWeight: '800',
  },
});
