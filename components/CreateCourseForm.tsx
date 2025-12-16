import React from 'react';
import { View, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Text } from 'react-native';
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
import { courseStyles } from '../styles/courseStyles';

interface CreateCourseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (courseData: unknown) => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.course);
  const form = useCourseForm();

  const handleSubmit = async () => {
    if (!form.validateForm()) return;
    
    try {
      const result = await dispatch(createCourse(form.prepareCourseData()));
      
      if (createCourse.fulfilled.match(result)) {
        form.showSuccess('Course created successfully!');
        setTimeout(() => {
          form.setShowSuccessPopup(false);
          form.resetForm();
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        form.showError((result.payload as any)?.message || error || 'Failed to create course');
      }
    } catch (err) {
      console.error('Course creation failed:', err);
      form.showError('An unexpected error occurred');
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={courseStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={courseStyles.header}>
        <TouchableOpacity onPress={onClose} style={courseStyles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={courseStyles.backText}>Create New Course</Text>
        </TouchableOpacity>
        <View style={courseStyles.headerPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={courseStyles.keyboardAvoidingView}
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
        
        <View style={courseStyles.buttonContainer}>
          <TouchableOpacity style={courseStyles.cancelButton} onPress={onClose}>
            <Text style={courseStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[courseStyles.submitButton, loading.create && courseStyles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading.create}
          >
            <Text style={courseStyles.submitButtonText}>
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



export default CreateCourseForm;