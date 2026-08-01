import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
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
}

export default function ResultsScreen({ route, navigation }: Props) {
  const rawData = route.params?.data;
  const medications: MedicineItem[] = Array.isArray(rawData) ? rawData : rawData?.medications || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleListen = (medName: string) => {
    Alert.alert('🔊 Audio Playback', `Reading audio explanation for ${medName}...`);
  };

  const handleSave = () => {
    setIsSaved(true);
    Alert.alert('💾 Saved to History', 'This prescription has been saved to your timeline.');
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
                    onPress={() => handleListen(item.medicine || 'Medicine')}
                  >
                    <Text style={styles.listenBtnText}>🔊 Listen Audio</Text>
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

                {/* Expandable Explanation Section */}
                {isExpanded ? (
                  <View style={styles.aiExplanationBox}>
                    <Text style={styles.aiTitle}>💡 Gemini Medical Guide</Text>
                    
                    <Text style={styles.aiLabel}>Purpose of medicine:</Text>
                    <Text style={styles.aiText}>
                      Commonly prescribed for bacterial infections or inflammation. Relieves active symptoms.
                    </Text>

                    <Text style={styles.aiLabel}>How to take it:</Text>
                    <Text style={styles.aiText}>
                      • Take with a full glass of water.{'\n'}
                      • Maintain equal intervals between doses.
                    </Text>

                    <Text style={styles.aiLabel}>Warnings & Precautions:</Text>
                    <Text style={styles.aiWarningText}>
                      ⚠️ Complete full course even if feeling better. Do not double dose.
                    </Text>
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
  aiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
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
