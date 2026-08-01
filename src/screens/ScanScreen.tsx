import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { scanPrescription } from '../services/geminiVision';
import MedAllyLogo from '../components/MedAllyLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

const loadingMessages = [
  "🧠 Reading your prescription...",
  "💊 Identifying medicines & dosages...",
  "✨ Preparing AI safety insights..."
];

export default function ScanScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastBase64, setLastBase64] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const processImage = async (base64: string | undefined | null) => {
    if (!base64) {
      setErrorMessage("Unreadable image data. Please capture or pick another photo.");
      return;
    }

    setLastBase64(base64);
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await scanPrescription(base64);
      setLoading(false);
      navigation.navigate('Results', { data: result });
    } catch (error: any) {
      setLoading(false);
      const msg = error?.message || '';
      if (msg.includes('Network') || msg.includes('Failed to fetch')) {
        setErrorMessage("No Internet Connection. Please check your network and try again.");
      } else {
        setErrorMessage(msg || "Gemini AI is temporarily unavailable. Please try again.");
      }
    }
  };

  const retryScan = () => {
    if (lastBase64) {
      processImage(lastBase64);
    } else {
      setErrorMessage(null);
    }
  };

  const takePicture = async () => {
    setErrorMessage(null);
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
        if (photo?.base64) {
          await processImage(photo.base64);
        } else {
          setErrorMessage("Unreadable image captured. Please try again.");
        }
      } catch (err) {
        setErrorMessage("Failed to capture image. Please try again.");
      }
    }
  };

  const pickImage = async () => {
    setErrorMessage(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        await processImage(result.assets[0].base64);
      }
    } catch (err) {
      setErrorMessage("Failed to pick image from gallery.");
    }
  };

  const pickDocument = async () => {
    setErrorMessage(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await processImage(base64);
      }
    } catch (err) {
      setErrorMessage("Failed to pick document or report.");
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to access the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* Logo Brand Loading Card */}
          <View style={styles.loadingCard}>
            <View style={styles.loadingLogoWrap}>
              <MedAllyLogo size="medium" showText={true} />
            </View>
            <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />
            <Text style={styles.loadingText}>{loadingMessages[loadingMsgIndex]}</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>⚡ Powered by Gemini 2.5 AI</Text>
            </View>
          </View>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Scan Error</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <View style={styles.errorButtonRow}>
              {lastBase64 ? (
                <TouchableOpacity style={styles.retryButton} onPress={retryScan}>
                  <Text style={styles.retryButtonText}>Retry Scan</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={() => setErrorMessage(null)}
              >
                <Text style={styles.dismissButtonText}>Take New Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
          <View style={styles.overlay}>
            <View style={styles.viewfinderBox}>
              <Text style={styles.guideText}>Position prescription in box</Text>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={pickDocument}>
                <Text style={styles.secondaryButtonText}>Upload PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingLogoWrap: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  loadingText: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    minHeight: 48,
  },
  aiBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  aiBadgeText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0f172a',
    width: '100%',
  },
  errorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f87171',
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#cbd5e1',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  dismissButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  viewfinderBox: {
    width: '85%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderStyle: 'dashed',
  },
  guideText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
  },
});
