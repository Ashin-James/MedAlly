import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

interface HistoryItem {
  id: string;
  date: string;
  doctor: string;
  medCount: number;
  medicines: string[];
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    date: 'Today, 10:30 AM',
    doctor: 'Dr. Sarah Sharma',
    medCount: 2,
    medicines: ['Amoxicillin 500mg', 'Paracetamol 650mg'],
  },
  {
    id: '2',
    date: '28 Jul 2026',
    doctor: 'Dr. Rajesh Kumar',
    medCount: 3,
    medicines: ['Metformin 500mg', 'Atorvastatin 10mg', 'Aspirin 75mg'],
  },
  {
    id: '3',
    date: '15 Jul 2026',
    doctor: 'Dr. Anita Roy',
    medCount: 1,
    medicines: ['Cetirizine 10mg'],
  },
];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@medally_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistory([...parsed, ...mockHistory]);
          }
        }
      } catch (err) {
        console.warn('Failed to load history:', err);
      }
    })();
  }, []);

  const filtered = history.filter(
    (item) =>
      item.doctor.toLowerCase().includes(search.toLowerCase()) ||
      item.medicines.some((m) => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prescription History</Text>
        <Text style={styles.headerSubtitle}>Timeline of your scanned prescriptions</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by doctor or medicine name..."
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📄</Text>
            <Text style={styles.emptyTitle}>No matching scans found</Text>
            <Text style={styles.emptySubtitle}>Try searching with a different doctor or medicine name.</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>📄 Preserved</Text>
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <Text style={styles.doctorName}>{item.doctor}</Text>
                <Text style={styles.medSummary}>
                  {item.medCount} Medicine{item.medCount > 1 ? 's' : ''} Identified
                </Text>

                {isExpanded ? (
                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedTitle}>Medicines Included:</Text>
                    {item.medicines.map((med, idx) => (
                      <View key={idx} style={styles.medRow}>
                        <Text style={styles.medBullet}>💊</Text>
                        <Text style={styles.medText}>{med}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
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
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
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
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  medSummary: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  expandedSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medBullet: {
    fontSize: 14,
    marginRight: 8,
  },
  medText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
