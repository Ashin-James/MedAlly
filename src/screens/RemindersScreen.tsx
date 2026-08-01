import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newInstructions, setNewInstructions] = useState('Take with water');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@medally_reminders');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSchedule(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load reminders:', err);
      }
    })();
  }, []);

  const saveReminders = async (updated: ScheduleItem[]) => {
    setSchedule(updated);
    try {
      await AsyncStorage.setItem('@medally_reminders', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save reminders:', err);
    }
  };

  const toggleStatus = (id: string, newStatus: 'taken' | 'skipped') => {
    const updated: ScheduleItem[] = schedule.map((item) => {
      if (item.id === id) {
        const nextStatus = (item.status === newStatus ? 'pending' : newStatus) as 'pending' | 'taken' | 'skipped';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    saveReminders(updated);
  };

  const handleAddReminder = () => {
    if (!newMedName.trim()) {
      Alert.alert('Required', 'Please enter medicine name.');
      return;
    }

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      timeSlot: 'Morning',
      timeText: newTime || '09:00 AM',
      medicine: newMedName.trim(),
      dosage: newDosage.trim() || '1 Tablet',
      instructions: newInstructions.trim() || 'Take after meals',
      status: 'pending',
    };

    const updated = [newItem, ...schedule];
    saveReminders(updated);
    setNewMedName('');
    setNewDosage('');
    setIsModalOpen(false);
    Alert.alert('Reminder Added', `Added ${newItem.medicine} to daily schedule.`);
  };

  const takenCount = schedule.filter((s) => s.status === 'taken').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Medicine Schedule</Text>
            <Text style={styles.headerSubtitle}>Track your daily dosages & medicine reminders</Text>
          </View>
          <TouchableOpacity style={styles.addBtnHeader} onPress={() => setIsModalOpen(true)}>
            <Text style={styles.addBtnHeaderText}>+ Add</Text>
          </TouchableOpacity>
        </View>
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
              { width: `${schedule.length > 0 ? (takenCount / schedule.length) * 100 : 0}%` },
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

      {/* Add Reminder Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Medicine Reminder</Text>
            
            <Text style={styles.inputLabel}>Medicine Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Amoxicillin 500mg"
              value={newMedName}
              onChangeText={setNewMedName}
            />

            <Text style={styles.inputLabel}>Dosage</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 1 Tablet"
              value={newDosage}
              onChangeText={setNewDosage}
            />

            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 08:00 AM"
              value={newTime}
              onChangeText={setNewTime}
            />

            <Text style={styles.inputLabel}>Instructions</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Take after meals with water"
              value={newInstructions}
              onChangeText={setNewInstructions}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddReminder}>
                <Text style={styles.modalSubmitText}>Save Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtnHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnHeaderText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
