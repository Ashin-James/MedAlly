import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { useAccessibility } from '../context/AccessibilityContext';

export default function ProfileScreen() {
  const {
    largeFont,
    highContrast,
    voiceMode,
    simpleLanguage,
    darkMode,
    setLargeFont,
    setHighContrast,
    setVoiceMode,
    setSimpleLanguage,
    setDarkMode,
    backgroundColor,
    textColor,
    cardColor,
    fontSizeMultiplier,
  } = useAccessibility();

  const emergencyCall = () => {
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
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: cardColor }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AJ</Text>
          </View>
          <Text style={[styles.userName, { color: textColor, fontSize: 22 * fontSizeMultiplier }]}>Ashin James</Text>
          <Text style={styles.userEmail}>ashin.james@medally.app</Text>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>🛡️ Emergency Profile Ready</Text>
          </View>
        </View>

        {/* Accessibility Features Section */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontSizeMultiplier }]}>♿ Accessibility Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontSizeMultiplier }]}>Large Font Mode</Text>
              <Text style={styles.settingDesc}>Increases text size app-wide</Text>
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
              <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontSizeMultiplier }]}>High Contrast Mode</Text>
              <Text style={styles.settingDesc}>Enhances background & text contrast app-wide</Text>
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
              <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontSizeMultiplier }]}>Voice Guidance Mode</Text>
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
              <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontSizeMultiplier }]}>Simple Language Mode</Text>
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
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontSizeMultiplier }]}>⚙️ App Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontSizeMultiplier }]}>Dark Theme</Text>
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
            <Text style={styles.emergencyDesc}>Tap to quickly contact emergency assistance (+911234567890)</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
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
    fontWeight: 'bold',
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontWeight: 'bold',
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
    fontWeight: '600',
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
