import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface ScheduleItem {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeText: string;
  medicine: string;
  dosage: string;
  instructions: string;
  status: 'pending' | 'taken' | 'skipped';
}

const initialSchedule: ScheduleItem[] = [
  {
    id: '1',
    timeSlot: 'Morning',
    timeText: '08:00 AM',
    medicine: 'Amoxicillin',
    dosage: '500mg (1 Capsule)',
    instructions: 'Take after breakfast',
    status: 'taken',
  },
  {
    id: '2',
    timeSlot: 'Afternoon',
    timeText: '02:00 PM',
    medicine: 'Paracetamol',
    dosage: '650mg (1 Tablet)',
    instructions: 'Take after lunch if fever persists',
    status: 'pending',
  },
  {
    id: '3',
    timeSlot: 'Evening',
    timeText: '08:00 PM',
    medicine: 'Amoxicillin',
    dosage: '500mg (1 Capsule)',
    instructions: 'Take after dinner',
    status: 'pending',
  },
];

export default function RemindersScreen() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);

  const toggleStatus = (id: string, newStatus: 'taken' | 'skipped') => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === newStatus ? 'pending' : newStatus;
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const takenCount = schedule.filter((s) => s.status === 'taken').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicine Schedule</Text>
        <Text style={styles.headerSubtitle}>Track your daily dosages & medicine reminders</Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressCount}>
            {takenCount} of {schedule.length} Taken
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(takenCount / schedule.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {schedule.map((item) => {
          const isTaken = item.status === 'taken';
          const isSkipped = item.status === 'skipped';

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.timeSlotBadge}>
                  <Text style={styles.timeSlotText}>⏰ {item.timeText} ({item.timeSlot})</Text>
                </View>
                <Text style={styles.instructionsText}>{item.instructions}</Text>
              </View>

              <Text style={styles.medName}>{item.medicine}</Text>
              <Text style={styles.dosageText}>Dosage: {item.dosage}</Text>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isTaken ? styles.btnTakenActive : styles.btnTakenInactive,
                  ]}
                  onPress={() => toggleStatus(item.id, 'taken')}
                >
                  <Text style={[styles.btnText, isTaken ? styles.textWhite : styles.textGreen]}>
                    {isTaken ? '✓ Taken' : 'Mark Taken'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isSkipped ? styles.btnSkipActive : styles.btnSkipInactive,
                  ]}
                  onPress={() => toggleStatus(item.id, 'skipped')}
                >
                  <Text style={[styles.btnText, isSkipped ? styles.textWhite : styles.textGray]}>
                    {isSkipped ? '✕ Skipped' : 'Skip'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  progressCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressCount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
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
    marginBottom: 8,
  },
  timeSlotBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  timeSlotText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  instructionsText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  medName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  dosageText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnTakenInactive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  btnTakenActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  btnSkipInactive: {
    backgroundColor: '#F5F5F5',
    borderColor: colors.border,
  },
  btnSkipActive: {
    backgroundColor: '#757575',
    borderColor: '#757575',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textWhite: {
    color: '#ffffff',
  },
  textGreen: {
    color: colors.primary,
  },
  textGray: {
    color: colors.textSecondary,
  },
});
