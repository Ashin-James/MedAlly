import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import MedAllyLogo from '../components/MedAllyLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadgeContainer}>
            <MedAllyLogo size="large" showText={true} variant="dark" />
          </View>
          <Text style={styles.tagline}>Your Intelligent AI Healthcare Companion</Text>
          <Text style={styles.description}>
            Instantly translate prescriptions, understand dosage guidelines, and manage dosage reminders with medical precision.
          </Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📸</Text>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>Gemini AI Vision Scan</Text>
              <Text style={styles.featureDesc}>Extract medicines & timings from handwritten prescriptions</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎤</Text>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>Voice AI & Text-to-Speech</Text>
              <Text style={styles.featureDesc}>Ask questions and listen to clear dosage explanations out loud</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📍</Text>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>Nearby Hospitals & Emergency SOS</Text>
              <Text style={styles.featureDesc}>Locate healthcare centers & call/SMS emergency contacts instantly</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          onPress={() => navigation.replace('Auth')}
          style={styles.primaryButton}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryButtonText}>Get Started →</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>🔒 Secure & Private • Powered by Gemini AI</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Premium dark slate background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  logoBadgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 24,
    paddingHorizontal: 36,
    borderRadius: 32,
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  tagline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  featureTextGroup: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38BDF8',
  },
  featureDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
