import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AccessibilityProvider } from './src/context/AccessibilityContext';

export default function App() {
  return (
    <AccessibilityProvider>
      <AppNavigator />
    </AccessibilityProvider>
  );
}
