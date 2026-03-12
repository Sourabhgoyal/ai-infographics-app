import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { ProgressContext } from './src/context/ProgressContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { useProgress } from './src/hooks/useProgress';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    primary: colors.accent,
    text: colors.text,
    border: colors.border,
    card: colors.bgCard,
  },
};

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
  );
}

export default function App() {
  const progress = useProgress();

  useEffect(() => {
    if (progress.loaded) SplashScreen.hideAsync();
  }, [progress.loaded]);

  if (!progress.loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProgressContext.Provider value={progress}>
          <StatusBar style="dark" />
          <NavigationContainer theme={navTheme}>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: colors.bgCard,
                  borderTopColor: colors.border,
                  borderTopWidth: 1,
                  height: 70,
                  paddingBottom: 12,
                  paddingTop: 6,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
                }}
              />
              <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                  tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
                  tabBarLabel: 'Read',
                }}
              />
              <Tab.Screen
                name="Quiz"
                component={QuizScreen}
                options={{
                  tabBarIcon: ({ focused }) => <TabIcon emoji="✏️" focused={focused} />,
                  tabBarLabel: 'Quiz',
                }}
              />
              <Tab.Screen
                name="Stats"
                component={StatsScreen}
                options={{
                  tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </ProgressContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
