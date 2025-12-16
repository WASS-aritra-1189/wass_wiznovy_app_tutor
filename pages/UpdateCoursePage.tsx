import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CourseFormBase from '../components/CourseFormBase';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { handleDateChange } from '../utils/courseUtils';
import { courseStyles } from '../styles/courseStyles';
import { useUpdateCourse } from '../hooks/useUpdateCourse';

interface UpdateCoursePageProps {
  route?: {
    params: {
      courseId: string;
    };
  };
  onSubmit?: (courseData: any) => void;
  onBack?: () => void;
  navigation?: any;
}

const UpdateCoursePage: React.FC<UpdateCoursePageProps> = ({ route, onSubmit, onBack, navigation }) => {
  const courseId = route?.params?.courseId;
  const { formState, setFormState, uiState, setUiState, loading, handleSubmit: submitCourse } = useUpdateCourse(courseId);
  
  const handleBack = () => {
    try {
      if (onBack) {
        onBack();
      } else if (navigation?.navigate) {
        navigation.goBack();
      }
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };



  const onStartDateChange = handleDateChange(
    (show) => setUiState(prev => ({ ...prev, showStartDatePicker: show })),
    (date) => setFormState(prev => ({ ...prev, startDate: date }))
  );
  const onEndDateChange = handleDateChange(
    (show) => setUiState(prev => ({ ...prev, showEndDatePicker: show })),
    (date) => setFormState(prev => ({ ...prev, endDate: date }))
  );

  if (loading.fetchDetails) {
    return (
      <SafeAreaView style={courseStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16423C" />
        <View style={courseStyles.header}>
          <TouchableOpacity onPress={handleBack} style={courseStyles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={courseStyles.backText}>Update Course</Text>
          </TouchableOpacity>
        </View>
        <View style={courseStyles.loadingContainer}>
          <Text style={courseStyles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={courseStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={courseStyles.header}>
        <TouchableOpacity onPress={handleBack} style={courseStyles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={courseStyles.backText}>Update Course</Text>
        </TouchableOpacity>
        <View style={courseStyles.headerPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={courseStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <CourseFormBase
          courseName={formState.courseName}
          setCourseName={(value) => setFormState(prev => ({ ...prev, courseName: value }))}
          accessType={formState.accessType}
          setAccessType={(value) => setFormState(prev => ({ ...prev, accessType: value }))}
          duration={formState.duration}
          setDuration={(value) => setFormState(prev => ({ ...prev, duration: value }))}
          totalLectures={formState.totalLectures}
          setTotalLectures={(value) => setFormState(prev => ({ ...prev, totalLectures: value }))}
          validityDays={formState.validityDays}
          setValidityDays={(value) => setFormState(prev => ({ ...prev, validityDays: value }))}
          startDate={formState.startDate}
          setShowStartDatePicker={(show) => setUiState(prev => ({ ...prev, showStartDatePicker: show }))}
          endDate={formState.endDate}
          setShowEndDatePicker={(show) => setUiState(prev => ({ ...prev, showEndDatePicker: show }))}
          price={formState.price}
          setPrice={(value) => setFormState(prev => ({ ...prev, price: value }))}
          discountedPrice={formState.discountedPrice}
          setDiscountedPrice={(value) => setFormState(prev => ({ ...prev, discountedPrice: value }))}
          description={formState.description}
          setDescription={(value) => setFormState(prev => ({ ...prev, description: value }))}
          authorMessage={formState.authorMessage}
          setAuthorMessage={(value) => setFormState(prev => ({ ...prev, authorMessage: value }))}
        />
        
        <View style={courseStyles.buttonContainer}>
        <TouchableOpacity style={courseStyles.cancelButton} onPress={handleBack}>
          <Text style={courseStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[courseStyles.submitButton, loading.update && courseStyles.submitButtonDisabled]} 
          onPress={() => submitCourse(onSubmit, handleBack)}
          disabled={loading.update}
        >
          <Text style={courseStyles.submitButtonText}>
            {loading.update ? 'Updating...' : 'Update Course'}
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {uiState.showStartDatePicker && (
        <DateTimePicker
          value={formState.startDate ? new Date(formState.startDate) : new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      
      {uiState.showEndDatePicker && (
        <DateTimePicker
          value={formState.endDate ? new Date(formState.endDate) : new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      
      <SuccessPopup
        visible={uiState.showSuccessPopup}
        message={uiState.successMessage}
        onClose={() => setUiState(prev => ({ ...prev, showSuccessPopup: false }))}
      />
      
      <ErrorPopup
        visible={uiState.showErrorPopup}
        message={uiState.errorMessage}
        onClose={() => setUiState(prev => ({ ...prev, showErrorPopup: false }))}
      />
    </SafeAreaView>
  );
};



export default UpdateCoursePage;