import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import TabNavigator from './TabNavigator';
import ScanScreen from '../screens/ScanScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HospitalsScreen from '../screens/HospitalsScreen';
import TranslationScreen from '../screens/TranslationScreen';
import VoiceAIScreen from '../screens/VoiceAIScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Hospitals" component={HospitalsScreen} />
        <Stack.Screen name="Translation" component={TranslationScreen} />
        <Stack.Screen name="VoiceAI" component={VoiceAIScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
