import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Translation'>;

interface LangOption {
  code: string;
  speechCode: string;
  name: string;
}

const languages: LangOption[] = [
  { code: 'hi', speechCode: 'hi-IN', name: 'Hindi (हिंदी)' },
  { code: 'kn', speechCode: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', speechCode: 'ml-IN', name: 'Malayalam (മലയാളം)' },
  { code: 'ta', speechCode: 'ta-IN', name: 'Tamil (தமிழ்)' },
  { code: 'te', speechCode: 'te-IN', name: 'Telugu (తెలుగు)' },
  { code: 'en', speechCode: 'en-US', name: 'English' },
];

// Comprehensive translation dictionary for medical terms
const translationsDict: Record<string, Record<string, string>> = {
  hi: {
    title: 'प्रिस्क्रिप्शन अनुवाद',
    dosageLabel: 'खुुराक (Dosage):',
    timingLabel: 'समय व नियम (Schedule):',
    foodLabel: 'भोजन निर्देश (Food Note):',
    listenBtn: '🔊 सुनें (Listen Audio)',
    stopBtn: '⏹️ रोकें (Stop)',
    afterFood: 'खाना खाने के बाद लें',
    beforeFood: 'खाना खाने से पहले लें',
    twiceDaily: 'दिन में 2 बार लें',
    thriceDaily: 'दिन में 3 बार लें',
  },
  kn: {
    title: 'ಔಷಧಿ ಅನುವಾದ',
    dosageLabel: 'ಪ್ರಮಾಣ (Dosage):',
    timingLabel: 'ಸಮಯ ಮತ್ತು ವಿವರ (Schedule):',
    foodLabel: 'ಆಹಾರ ಸಲಹೆ (Food Note):',
    listenBtn: '🔊 ಕೇಳಿ (Listen Audio)',
    stopBtn: '⏹️ ನಿಲ್ಲಿಸಿ (Stop)',
    afterFood: 'ಊಟದ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ',
    beforeFood: 'ಊಟಕ್ಕೆ ಮೊದಲು ತೆಗೆದುಕೊಳ್ಳಿ',
    twiceDaily: 'ದಿನಕ್ಕೆ 2 ಬಾರಿ ತೆಗೆದುಕೊಳ್ಳಿ',
    thriceDaily: 'ದಿನಕ್ಕೆ 3 ಬಾರಿ ತೆಗೆದುಕೊಳ್ಳಿ',
  },
  ml: {
    title: 'മരുന്ന് വിവരണം',
    dosageLabel: 'അളവ് (Dosage):',
    timingLabel: 'സമയക്രമം (Schedule):',
    foodLabel: 'ഭക്ഷണ നിർദ്ദേശം (Food Note):',
    listenBtn: '🔊 കേൾക്കുക (Listen Audio)',
    stopBtn: '⏹️ നിർത്തുക (Stop)',
    afterFood: 'ഭക്ഷണത്തിന് ശേഷം കഴിക്കുക',
    beforeFood: 'ഭക്ഷണത്തിന് മുൻപ് കഴിക്കുക',
    twiceDaily: 'ദിവസവും 2 നേരം കഴിക്കുക',
    thriceDaily: 'ദിവസവും 3 നേരം കഴിക്കുക',
  },
  ta: {
    title: 'மருந்து மொழிபெயர்ப்பு',
    dosageLabel: 'அளவு (Dosage):',
    timingLabel: 'நேரம் (Schedule):',
    foodLabel: 'உணவு குறிப்பு (Food Note):',
    listenBtn: '🔊 கேட்கவும் (Listen Audio)',
    stopBtn: '⏹️ நிறுத்தவும் (Stop)',
    afterFood: 'உணவுக்குப் பின் எடுத்துக்கொள்ளவும்',
    beforeFood: 'உணவுக்கு முன் எடுத்துக்கொள்ளவும்',
    twiceDaily: 'தினம் 2 வேளை எடுத்துக்கொள்ளவும்',
    thriceDaily: 'தினம் 3 வேளை எடுத்துக்கொள்ளவும்',
  },
  te: {
    title: 'మందుల అనువాదం',
    dosageLabel: 'మోతాదు (Dosage):',
    timingLabel: 'సమయం (Schedule):',
    foodLabel: 'ఆహార సూచన (Food Note):',
    listenBtn: '🔊 వినండి (Listen Audio)',
    stopBtn: '⏹️ ఆపండి (Stop)',
    afterFood: 'భోజనం తర్వాత తీసుకోండి',
    beforeFood: 'భోజనానికి ముందు తీసుకోండి',
    twiceDaily: 'రోజుకు 2 సార్లు తీసుకోండి',
    thriceDaily: 'రోజుకు 3 సార్లు తీసుకోండి',
  },
  en: {
    title: 'Prescription Insights',
    dosageLabel: 'Dosage:',
    timingLabel: 'Schedule:',
    foodLabel: 'Food Instructions:',
    listenBtn: '🔊 Listen Audio',
    stopBtn: '⏹️ Stop Speech',
    afterFood: 'Take after meals',
    beforeFood: 'Take before meals',
    twiceDaily: 'Take 2 times daily',
    thriceDaily: 'Take 3 times daily',
  },
};

const defaultMedications = [
  {
    medicine: 'Amoxicillin Trihydrate',
    dosage: '500mg (1 Capsule)',
    timing: '08:00 AM & 08:00 PM',
    food_instructions: 'Take after breakfast and dinner with water',
  },
  {
    medicine: 'Paracetamol',
    dosage: '650mg (1 Tablet)',
    timing: '02:00 PM (As Needed)',
    food_instructions: 'Take after lunch if fever persists',
  },
];

export default function TranslationScreen({ route, navigation }: Props) {
  const rawData = route.params?.data;
  const medications = Array.isArray(rawData) && rawData.length > 0 ? rawData : defaultMedications;

  const [selectedLangCode, setSelectedLangCode] = useState('hi');
  const [activeSpeakingIdx, setActiveSpeakingIdx] = useState<number | null>(null);

  const currentLangObj = languages.find((l) => l.code === selectedLangCode) || languages[0];
  const dict = translationsDict[selectedLangCode] || translationsDict.en;

  const handleAudioListen = (item: any, index: number) => {
    const textToSpeak = `${item.medicine || 'Medicine'}. ${dict.dosageLabel} ${item.dosage || ''}. ${dict.timingLabel} ${item.timing || ''}. ${dict.foodLabel} ${item.food_instructions || ''}`;

    try {
      if (activeSpeakingIdx === index) {
        Speech.stop();
        setActiveSpeakingIdx(null);
      } else {
        Speech.stop();
        setActiveSpeakingIdx(index);
        Speech.speak(textToSpeak, {
          language: currentLangObj.speechCode,
          onDone: () => setActiveSpeakingIdx(null),
          onError: () => setActiveSpeakingIdx(null),
        });
      }
    } catch (err) {
      Alert.alert('🔊 Audio Playback', textToSpeak);
    }
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
            const isSelected = selectedLangCode === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langPill, isSelected ? styles.langActive : styles.langInactive]}
                onPress={() => {
                  Speech.stop();
                  setActiveSpeakingIdx(null);
                  setSelectedLangCode(lang.code);
                }}
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
        {medications.map((item: any, index: number) => {
          const isSpeakingThis = activeSpeakingIdx === index;

          return (
            <View key={index} style={styles.card}>
              <View style={styles.cardBadgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🌍 {currentLangObj.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.audioBtn}
                  onPress={() => handleAudioListen(item, index)}
                >
                  <Text style={styles.audioBtnText}>
                    {isSpeakingThis ? dict.stopBtn : dict.listenBtn}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Medicine Name:</Text>
              <Text style={styles.valueTitle}>{item.medicine || 'UNKNOWN'}</Text>

              <Text style={styles.label}>{dict.dosageLabel}</Text>
              <Text style={styles.valueText}>{item.dosage || 'As prescribed'}</Text>

              <Text style={styles.label}>{dict.timingLabel}</Text>
              <Text style={styles.valueText}>{item.timing || 'As directed'}</Text>

              {item.food_instructions ? (
                <>
                  <Text style={styles.label}>{dict.foodLabel}</Text>
                  <Text style={styles.valueText}>{item.food_instructions}</Text>
                </>
              ) : null}
            </View>
          );
        })}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Translation Note</Text>
          <Text style={styles.disclaimerText}>
            Translations are rendered in {currentLangObj.name} to assist understanding. Always verify critical prescription details with your doctor or pharmacist.
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
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  valueText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 4,
    lineHeight: 22,
  },
  disclaimerBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginTop: 8,
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
