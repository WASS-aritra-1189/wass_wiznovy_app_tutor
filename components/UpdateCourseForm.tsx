import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse } from '../store/courseSlice';
import { useCourseForm } from '../hooks/useCourseForm';
import CourseFormBase from './CourseFormBase';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  validityDays: number;
  accessType: 'PAID' | 'FREE';
  totalDuration: string;
  totalLectures: number;
  authorMessage?: string;
  startDate: string;
  endDate: string;
  subjectId?: string;
  languageId?: string;
}

interface UpdateCourseFormProps {
  visible: boolean;
  onClose: () => void;
  course: Course | null;
  onSubmit?: (courseData: any) => void;
}

const headerStyles = {
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: { width: 24 },
};

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({ visible, onClose, course, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.course);
  const form = useCourseForm();

  useEffect(() => {
    if (course) {
      form.setCourseName(course.name || '');
      form.setDescription(course.description || '');
      form.setPrice(course.price?.toString() || '');
      form.setDiscountedPrice(course.discountPrice?.toString() || '');
      form.setValidityDays(course.validityDays?.toString() || '');
      form.setAccessType(course.accessType || 'PAID');
      form.setTotalLectures(course.totalLectures?.toString() || '');
      form.setAuthorMessage(course.authorMessage || '');
      form.setDuration(course.totalDuration ? (/(\d+)/.exec(course.totalDuration)?.[1] || '') : '');
      if (course.startDate) form.setStartDate(new Date(course.startDate).toISOString().split('T')[0]);
      if (course.endDate) form.setEndDate(new Date(course.endDate).toISOString().split('T')[0]);
    }
  }, [course]);

  const handleSubmit = async () => {
    if (!course?.id) {
      form.showError('Course ID is missing');
      return;
    }
    if (!form.validateForm()) return;
    
    try {
      const formattedStartDate = new Date(form.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(form.endDate).toISOString().split('T')[0];
      const updateData = { ...form.prepareCourseData(), startDate: formattedStartDate, endDate: formattedEndDate };
      const result = await dispatch(updateCourse({ courseId: course.id, courseData: updateData }));
      
      if (updateCourse.fulfilled.match(result)) {
        form.showSuccess('Course updated successfully!');
        setTimeout(() => {
          form.setShowSuccessPopup(false);
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        form.showError((result.payload as any)?.message || error || 'Failed to update course');
      }
    } catch (err) {
      console.error('Course update failed:', err);
      form.showError('An unexpected error occurred');
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={headerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={onClose} style={headerStyles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={headerStyles.backText}>Update Course</Text>
        </TouchableOpacity>
        <View style={headerStyles.headerPlaceholder} />
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
            style={[styles.submitButton, loading.update && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading.update}
          >
            <Text style={styles.submitButtonText}>
              {loading.update ? 'Updating...' : 'Update Course'}
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
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  cancelButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#E0E0E0', marginRight: 10, alignItems: 'center' },
  cancelButtonText: { color: '#333333', fontWeight: 'bold' },
  submitButton: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#16423C', marginLeft: 10, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  submitButtonDisabled: { backgroundColor: '#999999', opacity: 0.7 },
});

export default UpdateCourseForm;