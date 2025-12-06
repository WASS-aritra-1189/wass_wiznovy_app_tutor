import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CourseFormBaseProps {
  courseName: string;
  setCourseName: (value: string) => void;
  accessType: 'PAID' | 'FREE';
  setAccessType: (value: 'PAID' | 'FREE') => void;
  duration: string;
  setDuration: (value: string) => void;
  totalLectures: string;
  setTotalLectures: (value: string) => void;
  validityDays: string;
  setValidityDays: (value: string) => void;
  startDate: string;
  setShowStartDatePicker: (value: boolean) => void;
  endDate: string;
  setShowEndDatePicker: (value: boolean) => void;
  price: string;
  setPrice: (value: string) => void;
  discountedPrice: string;
  setDiscountedPrice: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  authorMessage: string;
  setAuthorMessage: (value: string) => void;
  handleThumbnailUpload: () => void;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  onStartDateChange: (event: any, selectedDate?: Date) => void;
  onEndDateChange: (event: any, selectedDate?: Date) => void;
}

export const CourseFormBase: React.FC<CourseFormBaseProps> = ({
  courseName, setCourseName, accessType, setAccessType, duration, setDuration,
  totalLectures, setTotalLectures, validityDays, setValidityDays,
  startDate, setShowStartDatePicker, endDate, setShowEndDatePicker,
  price, setPrice, discountedPrice, setDiscountedPrice,
  description, setDescription, authorMessage, setAuthorMessage,
  handleThumbnailUpload, showStartDatePicker, showEndDatePicker,
  onStartDateChange, onEndDateChange
}) => (
  <>
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.fieldLabel}>Course Name *</Text>
      <TextInput style={styles.input} placeholder="Course Name" value={courseName} onChangeText={setCourseName} />
      
      <Text style={styles.fieldLabel}>Access Type</Text>
      <View style={styles.accessTypeContainer}>
        <TouchableOpacity 
          style={[styles.accessTypeButton, accessType === 'PAID' && styles.accessTypeButtonActive]}
          onPress={() => setAccessType('PAID')}
        >
          <Text style={[styles.accessTypeText, accessType === 'PAID' && styles.accessTypeTextActive]}>PAID</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.accessTypeButton, accessType === 'FREE' && styles.accessTypeButtonActive]}
          onPress={() => setAccessType('FREE')}
        >
          <Text style={[styles.accessTypeText, accessType === 'FREE' && styles.accessTypeTextActive]}>FREE</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.fieldLabel}>Total Duration *</Text>
      <TextInput style={styles.input} placeholder="Duration (hours)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
      
      <Text style={styles.fieldLabel}>Total Lectures</Text>
      <TextInput style={styles.input} placeholder="Number of lectures" value={totalLectures} onChangeText={setTotalLectures} keyboardType="numeric" />
      
      <Text style={styles.fieldLabel}>Validity Days</Text>
      <TextInput style={styles.input} placeholder="Course validity in days (default: 365)" value={validityDays} onChangeText={setValidityDays} keyboardType="numeric" />
      
      <Text style={styles.fieldLabel}>Start Date *</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
        <Text style={startDate ? styles.dateText : styles.placeholderText}>{startDate || 'Select Start Date'}</Text>
        <MaterialIcons name="calendar-today" size={20} color="#666666" />
      </TouchableOpacity>
      
      <Text style={styles.fieldLabel}>End Date *</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
        <Text style={endDate ? styles.dateText : styles.placeholderText}>{endDate || 'Select End Date'}</Text>
        <MaterialIcons name="calendar-today" size={20} color="#666666" />
      </TouchableOpacity>
      
      <Text style={styles.fieldLabel}>Price *</Text>
      <TextInput style={styles.input} placeholder="Price (e.g., 599.00)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      
      <Text style={styles.fieldLabel}>Discounted Price</Text>
      <TextInput style={styles.input} placeholder="Discounted Price (e.g., 399.00)" value={discountedPrice} onChangeText={setDiscountedPrice} keyboardType="numeric" />
      
      <Text style={styles.fieldLabel}>Course Description *</Text>
      <TextInput style={styles.descriptionInput} placeholder="Enter course description..." value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
      
      <Text style={styles.fieldLabel}>Author Message</Text>
      <TextInput style={styles.input} placeholder="Welcome message for students" value={authorMessage} onChangeText={setAuthorMessage} />
      
      <Text style={styles.fieldLabel}>Thumbnail</Text>
      <TouchableOpacity style={styles.thumbnailUpload} onPress={handleThumbnailUpload}>
        <Image source={require('../assets/uploadthumbnail.png')} style={styles.uploadIcon} />
        <Text style={styles.uploadText}>Thumbnail should be 1280 X 720</Text>
      </TouchableOpacity>
    </ScrollView>
    
    {showStartDatePicker && (
      <DateTimePicker value={startDate ? new Date(startDate) : new Date()} mode="date" display="default" onChange={onStartDateChange} />
    )}
    
    {showEndDatePicker && (
      <DateTimePicker value={endDate ? new Date(endDate) : new Date()} mode="date" display="default" onChange={onEndDateChange} />
    )}
  </>
);

export const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, width: '90%', maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
  closeButton: { padding: 5 },
  formContainer: { maxHeight: 400 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 14 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#E0E0E0', marginRight: 10, alignItems: 'center' },
  cancelButtonText: { color: '#333333', fontWeight: 'bold' },
  submitButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#16423C', marginLeft: 10, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  thumbnailUpload: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: 40, marginBottom: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9F9', minHeight: 120 },
  uploadIcon: { width: 60, height: 60, marginBottom: 8 },
  uploadText: { fontSize: 14, color: '#666666' },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#01004C', marginBottom: 8, marginTop: 5 },
  dateInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 14, color: '#333333' },
  placeholderText: { fontSize: 14, color: '#999999' },
  descriptionInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 14, height: 100 },
  accessTypeContainer: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  accessTypeButton: { flex: 1, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  accessTypeButtonActive: { backgroundColor: '#16423C', borderColor: '#16423C' },
  accessTypeText: { fontSize: 14, color: '#333333', fontWeight: '600' },
  accessTypeTextActive: { color: '#FFFFFF' },
  submitButtonDisabled: { backgroundColor: '#999999', opacity: 0.7 },
});
