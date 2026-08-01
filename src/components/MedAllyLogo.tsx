import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MedAllyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
  variant?: 'light' | 'dark';
}

export default function MedAllyLogo({
  size = 'medium',
  showText = true,
  variant = 'light',
}: MedAllyLogoProps) {
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { shieldWidth: 40, shieldHeight: 46, fontSize: 20, iconSize: 18 };
      case 'large':
        return { shieldWidth: 100, shieldHeight: 115, fontSize: 42, iconSize: 46 };
      default:
        return { shieldWidth: 64, shieldHeight: 74, fontSize: 32, iconSize: 30 };
    }
  };

  const { shieldWidth, shieldHeight, fontSize, iconSize } = getDimensions();

  return (
    <View style={styles.container}>
      {/* MedAlly Shield Badge */}
      <View
        style={[
          styles.shieldOuter,
          {
            width: shieldWidth,
            height: shieldHeight,
            borderRadius: shieldWidth * 0.35,
          },
        ]}
      >
        <View style={styles.shieldInner}>
          <Text style={[styles.shieldIconText, { fontSize: iconSize }]}>🛡️</Text>
          <View style={styles.circuitOverlay}>
            <Text style={[styles.pillOverlayText, { fontSize: iconSize * 0.7 }]}>💊</Text>
            <Text style={styles.sparkleText}>✨</Text>
          </View>
        </View>
      </View>

      {/* MedAlly Dual-Color Wordmark */}
      {showText ? (
        <View style={styles.wordmarkRow}>
          <Text style={[styles.wordMed, { fontSize }]}>Med</Text>
          <Text style={[styles.wordAlly, { fontSize }]}>Ally</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldOuter: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#2563EB', // Blue shield border matching logo
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 12,
  },
  shieldInner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  shieldIconText: {
    color: '#2563EB',
  },
  circuitOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOverlayText: {
    transform: [{ rotate: '-30deg' }],
  },
  sparkleText: {
    fontSize: 10,
    position: 'absolute',
    top: -6,
    right: -8,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordMed: {
    fontWeight: '900',
    color: '#2563EB', // Blue
    letterSpacing: -0.5,
  },
  wordAlly: {
    fontWeight: '900',
    color: '#0D9488', // Teal Green matching logo
    letterSpacing: -0.5,
  },
});
