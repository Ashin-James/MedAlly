import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [simpleLanguage, setSimpleLanguage] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const emergencyCall = () => {
    Alert.alert(
      'Call emergency contact now?',
      'Dialing +911234567890 for emergency medical assistance.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:+911234567890'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AJ</Text>
          </View>
          <Text style={styles.userName}>Ashin James</Text>
          <Text style={styles.userEmail}>ashin.james@medally.app</Text>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>🛡️ Emergency Profile Ready</Text>
          </View>
        </View>

        {/* Accessibility Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>♿ Accessibility Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Large Font Mode</Text>
              <Text style={styles.settingDesc}>Increases text size for easier reading</Text>
            </View>
            <Switch
              value={largeFont}
              onValueChange={setLargeFont}
              trackColor={{ false: '#e2e8f0', true: colors.primaryLight }}
              thumbColor={largeFont ? colors.primary : '#94a3b8'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>High Contrast Mode</Text>
              <Text style={styles.settingDesc}>Enhances text and border readability</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#e2e8f0', true: colors.primaryLight }}
              thumbColor={highContrast ? colors.primary : '#94a3b8'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Voice Guidance Mode</Text>
              <Text style={styles.settingDesc}>Reads prescription results out loud</Text>
            </View>
            <Switch
              value={voiceMode}
              onValueChange={setVoiceMode}
              trackColor={{ false: '#e2e8f0', true: colors.primaryLight }}
              thumbColor={voiceMode ? colors.primary : '#94a3b8'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Simple Language Mode</Text>
              <Text style={styles.settingDesc}>Replaces complex medical terms with plain words</Text>
            </View>
            <Switch
              value={simpleLanguage}
              onValueChange={setSimpleLanguage}
              trackColor={{ false: '#e2e8f0', true: colors.primaryLight }}
              thumbColor={simpleLanguage ? colors.primary : '#94a3b8'}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ App Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Dark Theme</Text>
              <Text style={styles.settingDesc}>Use comfortable dark colors</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e2e8f0', true: colors.secondaryLight }}
              thumbColor={darkMode ? colors.secondary : '#94a3b8'}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <TouchableOpacity style={styles.emergencyCard} onPress={emergencyCall} activeOpacity={0.85}>
          <Text style={styles.emergencyIcon}>🆘</Text>
          <View style={styles.emergencyTextGroup}>
            <Text style={styles.emergencyTitle}>Emergency SOS Contact</Text>
            <Text style={styles.emergencyDesc}>Tap to quickly contact emergency assistance</Text>
          </View>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  emergencyIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  emergencyTextGroup: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.emergency,
  },
  emergencyDesc: {
    fontSize: 13,
    color: '#B71C1C',
    marginTop: 2,
  },
});
