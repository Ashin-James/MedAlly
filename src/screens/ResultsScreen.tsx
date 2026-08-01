import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>Prescription Results</Text>
      <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 40, textAlign: 'center' }}>
        Extracted medication details will appear here as cards.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{ backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 }}
      >
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
