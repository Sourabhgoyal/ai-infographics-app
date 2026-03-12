import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export function CircularProgress({ size = 160, percentage = 0, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const dashOffset = circumference * (1 - progress / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.accent} />
            <Stop offset="100%" stopColor={colors.accentLight} />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={center} cy={center} r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center} cy={center} r={radius}
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[styles.percentText, typography.headlineLarge]}>{percentage}%</Text>
        <Text style={[styles.doneText, typography.labelMedium]}>complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { alignItems: 'center' },
  percentText: {
    color: colors.text,
    letterSpacing: -1,
  },
  doneText: {
    color: colors.textSecondary,
    marginTop: -2,
  },
});
