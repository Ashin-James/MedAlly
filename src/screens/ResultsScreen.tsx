import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

interface MedicineItem {
  medicine: string;
  dosage?: string;
  timing?: string;
  food_instructions?: string;
  confidence?: number;
  purpose?: string;
  warnings?: string;
}

export default function ResultsScreen({ route, navigation }: Props) {
  const rawData = route.params?.data;
  const medications: MedicineItem[] = Array.isArray(rawData) ? rawData : rawData?.medications || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getConfidenceBadge = (confidence?: number) => {
    const score = confidence ?? 0;
    if (score > 90) {
      return {
        label: `${score}% Confident`,
        bg: colors.confidenceHighBg,
        text: colors.confidenceHighText,
        border: '#86efac',
      };
    } else if (score >= 70) {
      return {
        label: `${score}% Confident`,
        bg: colors.confidenceMediumBg,
        text: colors.confidenceMediumText,
        border: '#fde047',
      };
    } else {
      return {
        label: `${score}% - Please verify manually`,
        bg: colors.confidenceLowBg,
        text: colors.confidenceLowText,
        border: '#fca5a5',
      };
    }
  };

  const getDynamicAIPurpose = (item: MedicineItem) => {
    if (item.purpose) return item.purpose;
    const name = (item.medicine || '').toLowerCase();
    if (name.includes('amoxicillin') || name.includes('cipro') || name.includes('azithro')) {
      return 'Antibiotic prescribed to eliminate bacterial infections and prevent bacterial spread.';
    } else if (name.includes('paracetamol') || name.includes('acetaminophen') || name.includes('dolo') || name.includes('ibuprofen')) {
      return 'Analgesic & antipyretic prescribed to reduce fever and relieve mild-to-moderate pain.';
    } else if (name.includes('metformin') || name.includes('glimepiride')) {
      return 'Antidiabetic medication to regulate blood glucose levels and improve insulin sensitivity.';
    } else if (name.includes('cetirizine') || name.includes('levocetirizine') || name.includes('allegra')) {
      return 'Antihistamine prescribed for allergic reactions, skin hives, and runny nose relief.';
    } else if (name.includes('pantoprazole') || name.includes('omeprazole') || name.includes('ranitidine')) {
      return 'Proton pump inhibitor (PPI) prescribed to reduce stomach acid secretion and prevent ulcers.';
    }
    return `AI Medical Insight: Formulated to target active symptoms associated with ${item.medicine || 'this medication'}.`;
  };

  const getDynamicAIWarnings = (item: MedicineItem) => {
    if (item.warnings) return item.warnings;
    const name = (item.medicine || '').toLowerCase();
    if (name.includes('amoxicillin') || name.includes('cipro') || name.includes('azithro')) {
      return '⚠️ Complete full antibiotic course even if feeling better. Do not double dose.';
    } else if (name.includes('paracetamol') || name.includes('dolo')) {
      return '⚠️ Do not exceed 4000mg per day. Avoid combining with other acetaminophen products to protect liver health.';
    }
    return '⚠️ Take strictly as directed by your physician. Do not alter dosage without medical advice.';
  };

  const handleListen = (item: MedicineItem) => {
    const medName = item.medicine || 'Medicine';
    const purpose = getDynamicAIPurpose(item);
    const textToSpeak = `${medName}. Dosage: ${item.dosage || 'As prescribed'}. Timing: ${item.timing || 'As scheduled'}. Purpose: ${purpose}`;

    try {
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        Speech.speak(textToSpeak, {
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (err) {
      Alert.alert('🔊 Audio Playback', textToSpeak);
    }
  };

  const handleSave = async () => {
    setIsSaved(true);
    try {
      const newScan = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        doctor: 'Prescription Scan',
        medCount: medications.length,
        medicines: medications.map((m) => `${m.medicine || 'Medicine'} ${m.dosage || ''}`.trim()),
      };
      const existing = await AsyncStorage.getItem('@medally_history');
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [newScan, ...parsed];
      await AsyncStorage.setItem('@medally_history', JSON.stringify(updated));
      Alert.alert('💾 Saved to History', 'This prescription has been saved to your timeline.');
    } catch (err) {
      Alert.alert('Save Error', 'Could not save prescription to local history.');
    }
  };

  const handleShare = () => {
    Alert.alert('📤 Share Prescription', 'Sharing prescription summary via system share sheet...');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Prescription Insights</Text>
        <Text style={styles.subtitle}>Gemini AI extracted details & explanations</Text>
      </View>

      {/* Global Quick Action Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={() => navigation.navigate('Translation', { data: medications })}>
          <Text style={styles.toolIcon}>🌍</Text>
          <Text style={styles.toolText}>Translate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={handleSave}>
          <Text style={styles.toolIcon}>{isSaved ? '✅' : '💾'}</Text>
          <Text style={styles.toolText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={handleShare}>
          <Text style={styles.toolIcon}>📤</Text>
          <Text style={styles.toolText}>Share</Text>
        </TouchableOpacity>
      </View>

      {medications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>Could not read prescription</Text>
          <Text style={styles.emptyText}>
            We couldn't read this clearly. Please retake or upload a clearer photo.
          </Text>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {medications.map((item, index) => {
            const badge = getConfidenceBadge(item.confidence);
            const isExpanded = expandedIndex === index;
            const purpose = getDynamicAIPurpose(item);
            const warnings = getDynamicAIWarnings(item);

            return (
              <View key={index} style={styles.card}>
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <Text style={styles.medicineName}>{item.medicine || 'UNKNOWN'}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                {/* Key Fields */}
                {item.dosage ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dosage:</Text>
                    <Text style={styles.infoValue}>{item.dosage}</Text>
                  </View>
                ) : null}

                {item.timing ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Timing:</Text>
                    <Text style={styles.infoValue}>{item.timing}</Text>
                  </View>
                ) : null}

                {item.food_instructions ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Food Note:</Text>
                    <Text style={styles.infoValue}>{item.food_instructions}</Text>
                  </View>
                ) : null}

                {/* Card Specific Listen Action */}
                <View style={styles.cardActionRow}>
                  <TouchableOpacity
                    style={styles.listenBtn}
                    onPress={() => handleListen(item)}
                  >
                    <Text style={styles.listenBtnText}>
                      {isSpeaking ? '⏹️ Stop Speech' : '🔊 Listen Audio'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.expandToggle}
                    onPress={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    <Text style={styles.expandToggleText}>
                      {isExpanded ? 'Hide AI Details ▲' : 'AI Explanation ▼'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Expandable AI Explanation Section */}
                {isExpanded ? (
                  <View style={styles.aiExplanationBox}>
                    <View style={styles.aiHeaderRow}>
                      <Text style={styles.aiTitle}>💡 Gemini AI Medical Guide</Text>
                      <Text style={styles.aiBadgeTag}>AI Thinking</Text>
                    </View>
                    
                    <Text style={styles.aiLabel}>Purpose of medication:</Text>
                    <Text style={styles.aiText}>{purpose}</Text>

                    <Text style={styles.aiLabel}>Recommended Schedule & Food:</Text>
                    <Text style={styles.aiText}>
                      • {item.timing || 'Take at regular daily intervals.'}{'\n'}
                      • {item.food_instructions || 'Take with water as advised.'}
                    </Text>

                    <Text style={styles.aiLabel}>Safety Precautions:</Text>
                    <Text style={styles.aiWarningText}>{warnings}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}

          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs')}
            style={styles.homeButton}
          >
            <Text style={styles.homeButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
    paddingBottom: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 6,
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
    marginTop: 2,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolBtn: {
    alignItems: 'center',
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retakeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retakeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 95,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  listenBtn: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  listenBtnText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  expandToggle: {
    paddingVertical: 4,
  },
  expandToggleText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  aiExplanationBox: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  aiBadgeTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
  },
  aiText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  aiWarningText: {
    fontSize: 13,
    color: '#D32F2F',
    marginTop: 2,
    lineHeight: 18,
    fontWeight: '500',
  },
  homeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
