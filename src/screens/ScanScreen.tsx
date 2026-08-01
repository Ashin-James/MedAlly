import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { scanPrescription } from '../services/geminiVision';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastBase64, setLastBase64] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

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
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>🧠 Gemini is reading your prescription...</Text>
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
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef}>
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
            </View>
          </View>
        </CameraView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
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
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
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
