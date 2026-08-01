import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 12 }}>Scan Prescription</Text>
      <Text style={{ fontSize: 14, color: '#94a3b8', marginBottom: 40, textAlign: 'center' }}>
        Camera view placeholder. Position prescription within frame.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Results')}
        style={{ backgroundColor: '#10b981', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 }}
      >
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>View Results Placeholder</Text>
      </TouchableOpacity>
    </View>
  );
}
