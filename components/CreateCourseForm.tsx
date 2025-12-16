import React from 'react';
import { View, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCourse } from '../store/courseSlice';
import { useCourseForm } from '../hooks/useCourseForm';
import CourseFormBase from './CourseFormBase';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';

interface CreateCourseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (courseData: any) => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.course);
  const form = useCourseForm();

  const handleSubmit = async () => {
    if (!form.validateForm()) return;
    
    try {
      const result = await dispatch(createCourse(form.prepareCourseData()));
      
      if (result.type.endsWith('/fulfilled')) {
        form.showSuccess('Course created successfully!');
        setTimeout(() => {
          form.setShowSuccessPopup(false);
          form.resetForm();
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        form.showError(result.payload?.message || error || 'Failed to create course');
      }
    } catch (err) {
      form.showError('An unexpected error occurred');
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Create New Course</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <CourseFormBase
          courseName={form.courseName}
          setCourseName={form.setCourseName}
          accessType={form.accessType}
          setAccessType={form.setAccessType}
          duration={form.duration}
          setDuration={form.setDuration}
          totalLectures={form.totalLectures}
          setTotalLectures={form.setTotalLectures}
          validityDays={form.validityDays}
          setValidityDays={form.setValidityDays}
          startDate={form.startDate}
          setShowStartDatePicker={form.setShowStartDatePicker}
          endDate={form.endDate}
          setShowEndDatePicker={form.setShowEndDatePicker}
          price={form.price}
          setPrice={form.setPrice}
          discountedPrice={form.discountedPrice}
          setDiscountedPrice={form.setDiscountedPrice}
          description={form.description}
          setDescription={form.setDescription}
          authorMessage={form.authorMessage}
          setAuthorMessage={form.setAuthorMessage}
        />
        
        {form.showStartDatePicker && (
          <DateTimePicker value={form.startDate ? new Date(form.startDate) : new Date()} mode="date" display="default" onChange={form.onStartDateChange} />
        )}
        
        {form.showEndDatePicker && (
          <DateTimePicker value={form.endDate ? new Date(form.endDate) : new Date()} mode="date" display="default" onChange={form.onEndDateChange} />
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.submitButton, loading.create && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading.create}
          >
            <Text style={styles.submitButtonText}>
              {loading.create ? 'Creating...' : 'Create Course'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      <SuccessPopup visible={form.showSuccessPopup} message={form.successMessage} onClose={() => form.setShowSuccessPopup(false)} />
      <ErrorPopup visible={form.showErrorPopup} message={form.errorMessage} onClose={() => form.setShowErrorPopup(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: { width: 24 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  cancelButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#E0E0E0', marginRight: 10, alignItems: 'center' },
  cancelButtonText: { color: '#333333', fontWeight: 'bold' },
  submitButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#16423C', marginLeft: 10, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  submitButtonDisabled: { backgroundColor: '#999999', opacity: 0.7 },
});

export default CreateCourseForm;