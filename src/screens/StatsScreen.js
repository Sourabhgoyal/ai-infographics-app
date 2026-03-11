import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { INFOGRAPHICS, CATEGORIES, TOTAL_COUNT } from '../data/infographics';
import { colors, categoryColors, categoryIcons } from '../theme/colors';
import { ProgressContext } from '../../App';

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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetAll();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your Stats</Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.statBlock}>
            <Text style={styles.bigNum}>{readCount}</Text>
            <Text style={styles.bigLabel}>Read</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={styles.bigNum}>{TOTAL_COUNT - readCount}</Text>
            <Text style={styles.bigLabel}>Remaining</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={[styles.bigNum, { color: colors.accent }]}>{percentage}%</Text>
            <Text style={styles.bigLabel}>Done</Text>
          </View>
        </View>

        {/* Overall bar */}
        <View style={styles.overallTrack}>
          <View style={[styles.overallFill, { width: `${percentage}%` }]} />
        </View>

        {/* Category breakdown */}
        <Text style={styles.sectionTitle}>By Topic</Text>
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
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={[styles.catPct, { color: done ? colors.success : color }]}>
                    {done ? '✓ Done' : `${pct}%`}
                  </Text>
                </View>
                <View style={styles.catTrack}>
                  <View style={[styles.catFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <Text style={styles.catCount}>{read} of {total} viewed</Text>
              </View>
            </View>
          );
        })}

        {/* Reset button */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.75}>
          <Text style={styles.resetText}>↺  Reset All Progress</Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBlock: { alignItems: 'center', flex: 1 },
  bigNum: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  bigLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },
  overallTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  catRowDone: {
    borderColor: 'rgba(74, 222, 128, 0.25)',
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
  catPct: { fontSize: 13, fontWeight: '800' },
  catTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  catFill: { height: 4, borderRadius: 2 },
  catCount: { fontSize: 11, color: colors.textMuted },
  resetBtn: {
    marginTop: 32,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.3)',
    backgroundColor: 'rgba(255, 100, 100, 0.07)',
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
  },
});
