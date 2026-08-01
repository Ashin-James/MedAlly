import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface MedAllyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export default function MedAllyLogo({
  size = 'medium',
}: MedAllyLogoProps) {
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 50 };
      case 'large':
        return { width: 240, height: 110 };
      default:
        return { width: 170, height: 75 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/medally_logo.png')}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
