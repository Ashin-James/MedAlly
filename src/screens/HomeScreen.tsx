import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  const triggerSOS = () => {
    Alert.alert(
      'Emergency SOS Options',
      'Choose how to contact emergency assistance (+911234567890):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '💬 Send SMS',
          onPress: () =>
            Linking.openURL(
              'sms:+911234567890?body=I%20need%20help%2C%20please%20contact%20me.'
            ),
        },
        {
          text: '📞 Phone Call',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:+911234567890'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>MediGuide AI / MedAlly</Text>
            <Text style={styles.greeting}>Hello, Ashin 👋</Text>
            <Text style={styles.subtitle}>Your AI Medical Companion</Text>
          </View>
          <TouchableOpacity style={styles.sosButton} onPress={triggerSOS} activeOpacity={0.8}>
            <Text style={styles.sosText}>🆘 SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Scan Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroBadge}>✨ Powered by Gemini Vision</Text>
            <Text style={styles.heroTitle}>Scan Prescription</Text>
            <Text style={styles.heroSubtitle}>
              Photograph any medical prescription to extract dosage, timing, and AI explanations instantly.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heroScanBtn}
            onPress={() => navigation.navigate('Scan')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroScanBtnText}>📷 Start Camera Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action Grid */}
        <Text style={styles.sectionHeading}>Quick Services</Text>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => navigation.navigate('Scan')}
          >
            <View style={[styles.tileIconBg, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.tileIcon}>📄</Text>
            </View>
            <Text style={styles.tileLabel}>Upload Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => navigation.navigate('VoiceAI')}
          >
            <View style={[styles.tileIconBg, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.tileIcon}>🎤</Text>
            </View>
            <Text style={styles.tileLabel}>Ask AI Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => navigation.navigate('Hospitals')}
          >
            <View style={[styles.tileIconBg, { backgroundColor: '#E0F2F1' }]}>
              <Text style={styles.tileIcon}>🏥</Text>
            </View>
            <Text style={styles.tileLabel}>Hospitals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          >
            <View style={[styles.tileIconBg, { backgroundColor: colors.accentLight }]}>
              <Text style={styles.tileIcon}>⚙️</Text>
            </View>
            <Text style={styles.tileLabel}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Schedule Widget */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>💊 Today's Medicine Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'RemindersTab' })}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleDot} />
            <View style={styles.scheduleDetails}>
              <Text style={styles.medName}>Amoxicillin 500mg</Text>
              <Text style={styles.medTime}>08:00 AM • After Breakfast</Text>
            </View>
            <View style={styles.statusBadgeCompleted}>
              <Text style={styles.statusTextCompleted}>✓ Taken</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={[styles.scheduleDot, styles.dotPending]} />
            <View style={styles.scheduleDetails}>
              <Text style={styles.medName}>Paracetamol 650mg</Text>
              <Text style={styles.medTime}>02:00 PM • After Lunch</Text>
            </View>
            <View style={styles.statusBadgePending}>
              <Text style={styles.statusTextPending}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Safety Disclaimer Banner */}
        <View style={styles.disclaimerBanner}>
          <Text style={styles.disclaimerIcon}>🛡️</Text>
          <Text style={styles.disclaimerText}>
            MedAlly uses AI for educational guidance. Always verify dosages with your doctor or pharmacist.
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sosButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.emergency,
  },
  sosText: {
    color: colors.emergency,
    fontWeight: 'bold',
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  heroHeader: {
    marginBottom: 16,
  },
  heroBadge: {
    color: '#A5D6A7',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  heroScanBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  heroScanBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionTile: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    width: '23%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tileIcon: {
    fontSize: 20,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  widgetCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  dotPending: {
    backgroundColor: colors.accent,
  },
  scheduleDetails: {
    flex: 1,
  },
  medName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  medTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadgeCompleted: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextCompleted: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgePending: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextPending: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disclaimerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
