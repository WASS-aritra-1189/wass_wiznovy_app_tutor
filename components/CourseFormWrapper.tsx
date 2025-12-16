import React from 'react';
import { View, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CourseFormBase from './CourseFormBase';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';
import { courseStyles } from '../styles/courseStyles';

interface CourseFormWrapperProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  form: any;
  loading: boolean;
  submitText: string;
  loadingText: string;
}

const CourseFormWrapper: React.FC<CourseFormWrapperProps> = ({
  title,
  onClose,
  onSubmit,
  form,
  loading,
  submitText,
  loadingText
}) => (
  <SafeAreaView style={courseStyles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#16423C" />
    
    <View style={courseStyles.header}>
      <TouchableOpacity onPress={onClose} style={courseStyles.backButton}>
        <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
        <Text style={courseStyles.backText}>{title}</Text>
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
          style={[courseStyles.submitButton, loading && courseStyles.submitButtonDisabled]} 
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={courseStyles.submitButtonText}>
            {loading ? loadingText : submitText}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    
    <SuccessPopup visible={form.showSuccessPopup} message={form.successMessage} onClose={() => form.setShowSuccessPopup(false)} />
    <ErrorPopup visible={form.showErrorPopup} message={form.errorMessage} onClose={() => form.setShowErrorPopup(false)} />
  </SafeAreaView>
);

export default CourseFormWrapper;