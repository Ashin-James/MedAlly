import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceAI'>;

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function VoiceAIScreen({ navigation }: Props) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const askGemini = async (promptText: string) => {
    if (!promptText.trim()) return;

    setLoading(true);
    setAnswer(null);
    Speech.stop();

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are MedAlly AI, a friendly healthcare assistant. Answer this medicine question in 2 simple, easy-to-understand sentences for a patient: "${promptText}"`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your question. Please try again.';
      setAnswer(text);
      setLoading(false);

      // Read answer aloud with expo-speech
      speakAnswer(text);
    } catch (error) {
      setLoading(false);
      setAnswer('AI Assistant is temporarily offline. Please check your network connection.');
    }
  };

  const speakAnswer = (text: string) => {
    Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Speech.stop(); navigation.goBack(); }}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ask AI Voice Assistant</Text>
        <Text style={styles.subtitle}>Ask any medical or prescription question in plain language</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Quick Sample Prompts */}
        <Text style={styles.sectionLabel}>Quick Questions:</Text>
        <View style={styles.sampleContainer}>
          {[
            'What is Amoxicillin used for?',
            'Can I take Paracetamol after meals?',
            'What to do if I miss a dose?',
          ].map((sample, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sampleChip}
              onPress={() => {
                setQuestion(sample);
                askGemini(sample);
              }}
            >
              <Text style={styles.sampleText}>💬 {sample}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Box */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Type or speak your medicine question..."
            placeholderTextColor="#94a3b8"
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitBtn, !question.trim() && styles.disabledBtn]}
            disabled={!question.trim() || loading}
            onPress={() => askGemini(question)}
          >
            <Text style={styles.submitBtnText}>Ask AI 🎤</Text>
          </TouchableOpacity>
        </View>

        {/* Output & Speech Player */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Gemini AI is thinking...</Text>
          </View>
        ) : answer ? (
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <Text style={styles.answerTitle}>🤖 MedAlly Response</Text>
              <TouchableOpacity style={styles.speechControlBtn} onPress={() => (speaking ? stopSpeaking() : speakAnswer(answer))}>
                <Text style={styles.speechControlText}>{speaking ? '⏹️ Stop' : '🔊 Replay Speech'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.answerBody}>{answer}</Text>
          </View>
        ) : null}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  sampleContainer: {
    marginBottom: 20,
    gap: 8,
  },
  sampleChip: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sampleText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  answerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  speechControlBtn: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  speechControlText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  answerBody: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});
