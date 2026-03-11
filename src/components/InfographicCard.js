import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { colors, categoryColors, categoryIcons } from '../theme/colors';
import { CATEGORIES, TOTAL_COUNT } from '../data/infographics';

const { width: W, height: H } = Dimensions.get('window');

export function InfographicCard({ item, isRead, onMarkRead, onMarkUnread }) {
  const checkAnim = useRef(new Animated.Value(isRead ? 1 : 0)).current;
  const category = CATEGORIES[item.catIdx];
  const catColor = categoryColors[item.catIdx] ?? '#7C6FFF';
  const catIcon = categoryIcons[item.catIdx] ?? '📚';

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isRead ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [isRead]);

  return (
    <View style={styles.card}>
      {/* Full-screen image */}
      <Image
        source={item.image}
        style={styles.image}
        contentFit="contain"
        autoplay={item.isGif}
        cachePolicy="memory-disk"
        transition={300}
      />

      {/* Top gradient overlay */}
      <View style={styles.topOverlay}>
        <View style={[styles.categoryChip, { backgroundColor: catColor + '33', borderColor: catColor + '66' }]}>
          <Text style={styles.chipIcon}>{catIcon}</Text>
          <Text style={[styles.chipText, { color: catColor }]}>{category?.name ?? ''}</Text>
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{item.id + 1}</Text>
          <Text style={styles.counterTotal}>/{TOTAL_COUNT}</Text>
        </View>
      </View>

      {/* Bottom overlay with read toggle */}
      <View style={styles.bottomOverlay}>
        <View style={styles.bottomRow}>
          <Text style={styles.typeLabel}>{item.isGif ? '⚡ Animated' : '🖼 Visual'}</Text>

          <TouchableOpacity
            style={[styles.readBtn, isRead && styles.readBtnActive]}
            onPress={isRead ? () => onMarkUnread(item.id) : () => onMarkRead(item.id)}
            activeOpacity={0.7}
          >
            <Animated.View style={{
              transform: [{ scale: checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
              opacity: checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
            }}>
              <Text style={styles.readBtnText}>
                {isRead ? '✓ Read' : '○ Mark read'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: W,
    height: H,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: W,
    height: H * 0.82,
    backgroundColor: colors.bgCard,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
    maxWidth: W * 0.65,
  },
  chipIcon: { fontSize: 14 },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  counterTotal: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 60,
    background: 'transparent',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  readBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  readBtnActive: {
    borderColor: colors.success,
    backgroundColor: colors.successDim,
  },
  readBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
