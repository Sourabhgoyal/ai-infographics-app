import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const hapticImpact = (style = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(style).catch(() => {});
  }
};

export const hapticNotification = (type = Haptics.NotificationFeedbackType.Warning) => {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(type).catch(() => {});
  }
};

export { Haptics };
