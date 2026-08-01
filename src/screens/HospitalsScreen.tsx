import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Hospitals'>;

interface PlaceItem {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy';
  lat: number;
  lng: number;
  distance: string;
  address: string;
  phone: string;
  isOpen: boolean;
}

const initialPlaces: PlaceItem[] = [
  {
    id: '1',
    name: 'City Care General Hospital',
    type: 'Hospital',
    lat: 12.9716,
    lng: 77.5946,
    distance: '0.8 km',
    address: '45 Healthcare Ave, Block B',
    phone: '+1 800 555 0199',
    isOpen: true,
  },
  {
    id: '2',
    name: 'LifeLine Pharmacy & Surgical',
    type: 'Pharmacy',
    lat: 12.9750,
    lng: 77.5980,
    distance: '1.2 km',
    address: '12 Main Street, Market Plaza',
    phone: '+1 800 555 0144',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Apex Super Specialty Clinic',
    type: 'Clinic',
    lat: 12.9800,
    lng: 77.6000,
    distance: '2.5 km',
    address: '88 Wellness Boulevard',
    phone: '+1 800 555 0177',
    isOpen: false,
  },
];

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function HospitalsScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hospital' | 'Clinic' | 'Pharmacy'>('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<PlaceItem[]>(initialPlaces);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const lat = loc.coords.latitude;
          const lng = loc.coords.longitude;
          setUserLocation({ lat, lng });

          // Update places distances based on real coordinates
          const updated = initialPlaces.map((p) => {
            const dist = calculateDistanceKm(lat, lng, p.lat, p.lng);
            return {
              ...p,
              distance: `${dist} km from you`,
            };
          });
          setPlaces(updated);
        }
      } catch (err) {
        console.warn('Location request failed:', err);
      }
    })();
  }, []);

  const filteredPlaces = places.filter(
    (p) => selectedCategory === 'All' || p.type === selectedCategory
  );

  const handleCall = (phone: string, name: string) => {
    Alert.alert('Calling Place', `Dialing ${name} (${phone})...`);
  };

  const handleNavigate = (name: string) => {
    Alert.alert('Navigation Started', `Opening turn-by-turn directions to ${name}...`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Healthcare</Text>
        <Text style={styles.subtitle}>Find hospitals, clinics, & 24/7 pharmacies near you</Text>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {(['All', 'Hospital', 'Clinic', 'Pharmacy'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterPill, isActive ? styles.pillActive : styles.pillInactive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Map View Indicator Placeholder */}
      <View style={styles.mapBanner}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>
          {userLocation
            ? `Centered at Lat ${userLocation.lat.toFixed(2)}, Lon ${userLocation.lng.toFixed(2)}`
            : 'Interactive Hospital Map Ready (Requesting Location...)'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredPlaces.map((place) => (
          <View key={place.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {place.type === 'Hospital' ? '🏥' : place.type === 'Pharmacy' ? '💊' : '🩺'} {place.type}
                </Text>
              </View>
              <Text style={styles.distanceText}>📍 {place.distance}</Text>
            </View>

            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.addressText}>{place.address}</Text>

            <View style={styles.statusRow}>
              <Text style={[styles.statusDot, place.isOpen ? styles.dotOpen : styles.dotClosed]}>●</Text>
              <Text style={styles.statusText}>{place.isOpen ? 'Open Now (24 Hours)' : 'Closed'}</Text>
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => handleCall(place.phone, place.name)}
              >
                <Text style={styles.callBtnText}>📞 Call Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => handleNavigate(place.name)}
              >
                <Text style={styles.navBtnText}>🚗 Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  pillTextInactive: {
    color: colors.textSecondary,
  },
  mapBanner: {
    backgroundColor: colors.secondaryLight,
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  mapIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  mapText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    fontSize: 12,
    marginRight: 6,
  },
  dotOpen: {
    color: '#2E7D32',
  },
  dotClosed: {
    color: '#D32F2F',
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callBtn: {
    flex: 1,
    backgroundColor: colors.secondaryLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  callBtnText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  navBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  navBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
