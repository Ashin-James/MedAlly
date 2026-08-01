import React from 'react';
import { LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AccessibilityProvider } from './src/context/AccessibilityContext';

// Suppress yellow dev-tool connection warnings on physical device UI
LogBox.ignoreLogs(['Cannot connect to Expo CLI', 'Expo CLI']);
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <AccessibilityProvider>
      <AppNavigator />
    </AccessibilityProvider>
  );
}
