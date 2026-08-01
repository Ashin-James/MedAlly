import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import MedAllyLogo from '../components/MedAllyLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('medally_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setEmail(user.email || '');
        }
      } catch (err) {
        console.warn('Failed to load user:', err);
      }
    })();
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email address and password.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Demo login check
        const storedUser = await AsyncStorage.getItem('medally_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.password !== password) {
            setLoading(false);
            Alert.alert('Authentication Failed', 'Incorrect password. Try again or register.');
            return;
          }
        }
        // Save session
        await AsyncStorage.setItem('medally_session', JSON.stringify({ email, loggedIn: true }));
        setLoading(false);
        navigation.replace('MainTabs');
      } else {
        // Register demo user
        const newUser = { email, password };
        await AsyncStorage.setItem('medally_user', JSON.stringify(newUser));
        await AsyncStorage.setItem('medally_session', JSON.stringify({ email, loggedIn: true }));
        setLoading(false);
        Alert.alert('Account Created', 'Welcome to MedAlly!', [
          { text: 'Continue', onPress: () => navigation.replace('MainTabs') },
        ]);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Failed to complete authentication. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <MedAllyLogo size="medium" showText={true} />
          </View>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'Sign in to access your prescription history & AI tools'
              : 'Register to manage medical reminders & AI analysis'}
          </Text>
        </View>

        {/* Auth Mode Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="patient@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'Authenticating...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Bypass */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.guestBtnText}>Continue as Guest Demo →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoWrap: {
    marginBottom: 16,
  },
  iconText: {
    fontSize: 34,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestBtnText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
