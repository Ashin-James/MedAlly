import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#38bdf8', marginBottom: 8 }}>MedAlly</Text>
      <Text style={{ fontSize: 16, color: '#94a3b8', marginBottom: 40, textAlign: 'center' }}>
        Your Smart Prescription Assistant
      </Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Home')}
        style={{ backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 }}
      >
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
