import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Translation'>;

const languages = [
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'en', name: 'English' },
];

const sampleTranslations: Record<string, any> = {
  hi: {
    med: 'एम्फिसिलिन / अमोक्सिसिलिन (Amoxicillin)',
    dosage: '500 मिलीग्राम',
    instructions: 'दिन में 3 बार, खाना खाने के बाद 7 दिनों तक लें।',
  },
  kn: {
    med: 'ಅಮೊಕ್ಸಿಸಿಲಿನ್ (Amoxicillin)',
    dosage: '500 ಎಂಜಿ',
    instructions: 'ದಿನಕ್ಕೆ 3 ಬಾರಿ ಊಟದ ನಂತರ 7 ದಿನಗಳವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
  },
  ml: {
    med: 'അമോക്സിസിലിൻ (Amoxicillin)',
    dosage: '500 മില്ലിഗ്രാം',
    instructions: 'ഭക്ഷണത്തിന് ശേഷം ദിവസവും 3 തവണ വീതം 7 ദിവസം കഴിക്കുക.',
  },
  ta: {
    med: 'அமோக்சிசிலின் (Amoxicillin)',
    dosage: '500 மி.கி',
    instructions: 'உணவுக்குப் பிறகு தினமும் 3 வேளை 7 நாட்களுக்கு எடுத்துக்கொள்ளவும்.',
  },
  te: {
    med: 'అమోక్సిసిలిన్ (Amoxicillin)',
    dosage: '500 మి.గ్రా',
    instructions: 'భోజనం తర్వాత రోజుకు 3 సార్లు 7 రోజుల పాటు తీసుకోండి.',
  },
  en: {
    med: 'Amoxicillin',
    dosage: '500mg',
    instructions: 'Take 3 times daily after meals for 7 days.',
  },
};

export default function TranslationScreen({ route, navigation }: Props) {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isPlaying, setIsPlaying] = useState(false);

  const translation = sampleTranslations[selectedLang] || sampleTranslations.hi;

  const handleAudioListen = () => {
    setIsPlaying(true);
    Alert.alert(
      '🔊 Reading Aloud',
      `Playing voice audio in ${languages.find((l) => l.code === selectedLang)?.name}...`
    );
    setTimeout(() => setIsPlaying(false), 2500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Language Translation</Text>
        <Text style={styles.subtitle}>Read & listen to prescription details in your preferred language</Text>
      </View>

      {/* Language Selector horizontal scroll */}
      <View style={styles.langSelectorRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langPill, isSelected ? styles.langActive : styles.langInactive]}
                onPress={() => setSelectedLang(lang.code)}
              >
                <Text style={[styles.langText, isSelected ? styles.langTextActive : styles.langTextInactive]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardBadgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌍 Translated Card</Text>
            </View>
            <TouchableOpacity style={styles.audioBtn} onPress={handleAudioListen}>
              <Text style={styles.audioBtnText}>{isPlaying ? '🔊 Playing...' : '🔊 Listen Audio'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Medicine Name:</Text>
          <Text style={styles.valueTitle}>{translation.med}</Text>

          <Text style={styles.label}>Dosage:</Text>
          <Text style={styles.valueText}>{translation.dosage}</Text>

          <Text style={styles.label}>Instructions & Schedule:</Text>
          <Text style={styles.valueText}>{translation.instructions}</Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Translation Note</Text>
          <Text style={styles.disclaimerText}>
            AI translations are provided to assist understanding. Always confirm critical medical instructions with your physician or pharmacist.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  langSelectorRow: {
    marginBottom: 16,
  },
  langScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  langPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  langActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#ffffff',
  },
  langTextInactive: {
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  audioBtn: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  audioBtnText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
  },
  valueTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  valueText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
    lineHeight: 24,
  },
  disclaimerBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#BF360C',
    lineHeight: 18,
  },
});
