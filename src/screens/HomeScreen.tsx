import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 }}>Welcome to MedAlly</Text>
      <Text style={{ fontSize: 15, color: '#64748b', marginBottom: 32, textAlign: 'center' }}>
        Scan your prescription to get easy-to-understand medication insights.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Scan')}
        style={{ backgroundColor: '#0284c7', paddingVertical: 16, paddingHorizontal: 36, borderRadius: 12 }}
      >
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Scan Prescription</Text>
      </TouchableOpacity>
    </View>
  );
}
