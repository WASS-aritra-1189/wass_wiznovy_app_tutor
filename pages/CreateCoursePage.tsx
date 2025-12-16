import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCourse } from '../store/courseSlice';
import CourseFormBase from '../components/CourseFormBase';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { validateCourseForm, formatCourseData, handleDateChange } from '../utils/courseUtils';
import { courseStyles } from '../styles/courseStyles';

interface CreateCoursePageProps {
  onSubmit?: (courseData: any) => void;
  onBack?: () => void;
  navigation?: any;
}

const CreateCoursePage: React.FC<CreateCoursePageProps> = ({ onSubmit, onBack, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.course);
  
  const [courseName, setCourseName] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [totalLectures, setTotalLectures] = useState('');
  const [validityDays, setValidityDays] = useState('');
  const [authorMessage, setAuthorMessage] = useState('');
  const [accessType, setAccessType] = useState<'PAID' | 'FREE'>('PAID');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    const validationError = validateCourseForm(courseName, description, price, duration, startDate, endDate);
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    
    const courseData: any = {
      ...formatCourseData(
        courseName, description, price, discountedPrice, validityDays,
        accessType, duration, totalLectures, authorMessage, startDate, endDate
      ),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
    
    try {
      const result = await dispatch(createCourse(courseData));
      
      if (result.type.endsWith('/fulfilled')) {
        setSuccessMessage('Course created successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          resetForm();
          onSubmit?.(result.payload);
          setTimeout(() => {
            handleBack();
          }, 100);
        }, 2000);
      } else {
        const errorMsg = result.payload?.message || error || 'Failed to create course';
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (err) {
      console.error('Course creation error:', err);
      setErrorMessage('An unexpected error occurred');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  const resetForm = () => {
    setCourseName('');
    setDuration('');
    setStartDate('');
    setEndDate('');
    setPrice('');
    setDiscountedPrice('');
    setDescription('');
    setTotalLectures('');
    setValidityDays('');
    setAuthorMessage('');
    setAccessType('PAID');
  };
  
  const handleBack = () => {
    try {
      if (onBack) {
        onBack();
      } else if (navigation?.navigate) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const onStartDateChange = handleDateChange(setShowStartDatePicker, setStartDate);
  const onEndDateChange = handleDateChange(setShowEndDatePicker, setEndDate);

  return (
    <SafeAreaView style={courseStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={courseStyles.header}>
        <TouchableOpacity onPress={handleBack} style={courseStyles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={courseStyles.backText}>Create New Course</Text>
        </TouchableOpacity>
        <View style={courseStyles.headerPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={courseStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <CourseFormBase
          courseName={courseName}
          setCourseName={setCourseName}
          accessType={accessType}
          setAccessType={setAccessType}
          duration={duration}
          setDuration={setDuration}
          totalLectures={totalLectures}
          setTotalLectures={setTotalLectures}
          validityDays={validityDays}
          setValidityDays={setValidityDays}
          startDate={startDate}
          setShowStartDatePicker={setShowStartDatePicker}
          endDate={endDate}
          setShowEndDatePicker={setShowEndDatePicker}
          price={price}
          setPrice={setPrice}
          discountedPrice={discountedPrice}
          setDiscountedPrice={setDiscountedPrice}
          description={description}
          setDescription={setDescription}
          authorMessage={authorMessage}
          setAuthorMessage={setAuthorMessage}
        />
        
        <View style={courseStyles.buttonContainer}>
        <TouchableOpacity style={courseStyles.cancelButton} onPress={handleBack}>
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
      
      {showStartDatePicker && (
        <DateTimePicker
          value={(() => {
            try {
              return startDate ? new Date(startDate) : new Date();
            } catch (error) {
              console.error('Error parsing start date:', error);
              return new Date();
            }
          })()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={(() => {
            try {
              return endDate ? new Date(endDate) : new Date();
            } catch (error) {
              console.error('Error parsing end date:', error);
              return new Date();
            }
          })()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      
      <SuccessPopup
        visible={showSuccessPopup}
        message={successMessage}
        onClose={() => {
          try {
            setShowSuccessPopup(false);
          } catch (error) {
            console.error('Error closing success popup:', error);
          }
        }}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => {
          try {
            setShowErrorPopup(false);
          } catch (error) {
            console.error('Error closing error popup:', error);
          }
        }}
      />
    </SafeAreaView>
  );
};



export default CreateCoursePage;