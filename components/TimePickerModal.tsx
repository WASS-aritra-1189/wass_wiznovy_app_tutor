import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AlertComponent from './AlertComponent';

interface TimePickerModalProps {
  visible: boolean;
  selectedDay: string | null;
  tempFromHour: string;
  tempFromMinute: string;
  tempToHour: string;
  tempToMinute: string;
  tempFromAmPm: string;
  tempToAmPm: string;
  editingSlotIndex: number | null;
  showAlert: boolean;
  alertMessage: string;
  onFromHourChange: (text: string) => void;
  onFromMinuteChange: (text: string) => void;
  onToHourChange: (text: string) => void;
  onToMinuteChange: (text: string) => void;
  onFromAmPmToggle: () => void;
  onToAmPmToggle: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  selectedDay,
  tempFromHour,
  tempFromMinute,
  tempToHour,
  tempToMinute,
  tempFromAmPm,
  tempToAmPm,
  editingSlotIndex,
  showAlert,
  alertMessage,
  onFromHourChange,
  onFromMinuteChange,
  onToHourChange,
  onToMinuteChange,
  onFromAmPmToggle,
  onToAmPmToggle,
  onCancel,
  onSave,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <AlertComponent visible={showAlert} message={alertMessage} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingSlotIndex === null ? 'Add' : 'Edit'} Time Slot for {selectedDay}
          </Text>
          
          <View style={styles.timeInputRow}>
            <Text style={styles.timeLabel}>From:</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeBlock}
                placeholder="09"
                value={tempFromHour}
                onChangeText={onFromHourChange}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                style={styles.timeBlock}
                placeholder="00"
                value={tempFromMinute}
                onChangeText={onFromMinuteChange}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <TouchableOpacity style={styles.amPmButton} onPress={onFromAmPmToggle}>
              <Text style={styles.amPmText}>{tempFromAmPm}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeInputRow}>
            <Text style={styles.timeLabel}>To:</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeBlock}
                placeholder="05"
                value={tempToHour}
                onChangeText={onToHourChange}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                style={styles.timeBlock}
                placeholder="00"
                value={tempToMinute}
                onChangeText={onToMinuteChange}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <TouchableOpacity style={styles.amPmButton} onPress={onToAmPmToggle}>
              <Text style={styles.amPmText}>{tempToAmPm}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 16,
    width: 50,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  timeBlock: {
    width: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333333',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#16423C',
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  amPmButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  amPmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TimePickerModal;