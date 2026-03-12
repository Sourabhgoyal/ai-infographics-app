import React, { useCallback, useRef, useState, useContext } from 'react';
import {
  View, FlatList, StyleSheet, Dimensions, StatusBar, Text, TouchableOpacity,
} from 'react-native';
import { hapticImpact, Haptics } from '../utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfographicCard } from '../components/InfographicCard';
import { INFOGRAPHICS, TOTAL_COUNT } from '../data/infographics';
import { colors, categoryColors } from '../theme/colors';
import { ProgressContext } from '../context/ProgressContext';

const { height: H, width: W } = Dimensions.get('window');

const READ_THRESHOLD_MS = 1500; // mark read after 1.5s of viewing

export function FeedScreen({ route }) {
  const { readSet, markRead, markUnread, readCount, percentage } = useContext(ProgressContext);
  const insets = useSafeAreaInsets();
  const timerRef = useRef(null);
  const listRef = useRef(null);

  // Start at specific index when navigating from Home (e.g. "Continue Reading")
  const startIndex = Math.min(
    Math.max(0, route?.params?.startIndex ?? 0),
    INFOGRAPHICS.length - 1
  );
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length === 0) return;
    const visible = viewableItems[0];
    const item = visible.item;
    setCurrentIndex(visible.index);

    // Clear existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!readSet.has(item.id)) {
      // Auto-mark read after threshold
      timerRef.current = setTimeout(() => {
        markRead(item.id);
        hapticImpact(Haptics.ImpactFeedbackStyle.Light);
      }, READ_THRESHOLD_MS);
    }
  }, [readSet, markRead]);

  // FlatList requires a stable reference; ref prevents "Changing onViewableItemsChanged on the fly" crash
  const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
  onViewableItemsChangedRef.current = onViewableItemsChanged;
  const stableOnViewableItemsChanged = useCallback((info) => {
    onViewableItemsChangedRef.current?.(info);
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 75,
  }).current;

  const renderItem = useCallback(({ item }) => (
    <InfographicCard
      item={item}
      isRead={readSet.has(item.id)}
      onMarkRead={(id) => {
        markRead(id);
        hapticImpact(Haptics.ImpactFeedbackStyle.Light);
      }}
      onMarkUnread={(id) => {
        markUnread(id);
        hapticImpact(Haptics.ImpactFeedbackStyle.Soft);
      }}
    />
  ), [readSet, markRead, markUnread]);

  const getItemLayout = useCallback((_, index) => ({
    length: H,
    offset: H * index,
    index,
  }), []);

  // Progress bar width
  const progressWidth = (readCount / TOTAL_COUNT) * W;
  const catColor = categoryColors[INFOGRAPHICS[currentIndex]?.catIdx ?? 0];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <FlatList
        ref={listRef}
        data={INFOGRAPHICS}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={H}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={stableOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialScrollIndex={startIndex > 0 ? startIndex : undefined}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews={false}
      />

      {/* Bottom progress bar */}
      <View style={[styles.progressBarTrack, { bottom: insets.bottom + 2 }]}>
        <View style={[styles.progressBarFill, { width: progressWidth, backgroundColor: catColor }]} />
      </View>

      {/* Floating mini progress pill */}
      <View style={[styles.pill, { bottom: insets.bottom + 14 }]}>
        <Text style={styles.pillText}>{percentage}% done · {readCount}/{TOTAL_COUNT}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  progressBarTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.border,
  },
  progressBarFill: {
    height: 3,
    borderRadius: 2,
  },
  pill: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
