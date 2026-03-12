import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticNotification, Haptics } from '../utils/haptics';
import { INFOGRAPHICS, CATEGORIES, TOTAL_COUNT } from '../data/infographics';
import { colors, categoryColors, categoryIcons } from '../theme/colors';
import { typography } from '../theme/typography';
import { ProgressContext } from '../context/ProgressContext';

const imagesByCategory = CATEGORIES.map((cat) =>
  INFOGRAPHICS.filter((img) => img.catIdx === cat.id)
);

export function StatsScreen() {
  const { readSet, readCount, percentage, resetAll } = useContext(ProgressContext);
  const insets = useSafeAreaInsets();

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will mark all infographics as unread. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive', onPress: () => {
            hapticNotification(Haptics.NotificationFeedbackType.Warning);
            resetAll();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, typography.headlineLarge]}>Your Stats</Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.statBlock}>
            <Text style={[styles.bigNum, typography.headlineMedium]}>{readCount}</Text>
            <Text style={[styles.bigLabel, typography.labelMedium]}>Read</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={[styles.bigNum, typography.headlineMedium]}>{TOTAL_COUNT - readCount}</Text>
            <Text style={[styles.bigLabel, typography.labelMedium]}>Remaining</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={[styles.bigNum, typography.headlineMedium, { color: colors.accent }]}>{percentage}%</Text>
            <Text style={[styles.bigLabel, typography.labelMedium]}>Done</Text>
          </View>
        </View>

        {/* Overall bar */}
        <View style={styles.overallTrack}>
          <View style={[styles.overallFill, { width: `${percentage}%` }]} />
        </View>

        {/* Category breakdown */}
        <Text style={[styles.sectionTitle, typography.titleMedium]}>By Topic</Text>
        {CATEGORIES.map((cat, i) => {
          const catImages = imagesByCategory[i];
          const read = catImages.filter((img) => readSet.has(img.id)).length;
          const total = catImages.length;
          const pct = total > 0 ? Math.round((read / total) * 100) : 0;
          const color = categoryColors[i];
          const icon = categoryIcons[i];
          const done = read === total && total > 0;

          return (
            <View key={cat.id} style={[styles.catRow, done && styles.catRowDone]}>
              <View style={[styles.catDot, { backgroundColor: color }]} />
              <Text style={styles.catIcon}>{icon}</Text>
              <View style={styles.catInfo}>
                <View style={styles.catHeader}>
                  <Text style={[styles.catName, typography.labelLarge]}>{cat.name}</Text>
                  <Text style={[styles.catPct, { color: done ? colors.success : color }]}>
                    {done ? '✓ Done' : `${pct}%`}
                  </Text>
                </View>
                <View style={styles.catTrack}>
                  <View style={[styles.catFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <Text style={[styles.catCount, typography.labelMedium]}>{read} of {total} viewed</Text>
              </View>
            </View>
          );
        })}

        {/* Reset button */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.75}>
          <Text style={[styles.resetText, typography.labelLarge]}>↺  Reset All Progress</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  title: {
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBlock: { alignItems: 'center', flex: 1 },
  bigNum: {
    color: colors.text,
  },
  bigLabel: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },
  overallTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 32,
  },
  overallFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: 16,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  catRowDone: {
    borderColor: colors.successDim,
  },
  catDot: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  catIcon: { fontSize: 22, marginLeft: 8, marginTop: 2 },
  catInfo: { flex: 1 },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  catPct: { fontWeight: '600' },
  catTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  catFill: { height: 4, borderRadius: 2 },
  catCount: { color: colors.textMuted },
  resetBtn: {
    marginTop: 32,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'rgba(198, 40, 40, 0.08)',
  },
  resetText: {
    color: colors.error,
  },
});
