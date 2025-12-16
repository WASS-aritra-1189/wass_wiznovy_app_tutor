import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse, fetchCourseDetails } from '../store/courseSlice';
import { fetchSubjects, fetchLanguages } from '../store/onboardingSlice';
import CourseFormBase from '../components/CourseFormBase';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { validateCourseForm, formatCourseData, handleDateChange } from '../utils/courseUtils';
import { courseStyles } from '../styles/courseStyles';

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
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, currentCourse } = useSelector((state: RootState) => state.course);
  const { subjects, languages } = useSelector((state: RootState) => state.onboarding);
  
  const courseId = route?.params?.courseId;
  
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [languageId, setLanguageId] = useState('');

  

  
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }
    dispatch(fetchSubjects());
    dispatch(fetchLanguages());
  }, [dispatch, courseId]);

  const populateFormFields = (course: any) => {
    setCourseName(course.name || '');
    setDescription(course.description || '');
    setPrice(course.price?.toString() || '');
    setDiscountedPrice(course.discountPrice?.toString() || '');
    setValidityDays(course.validityDays?.toString() || '');
    setAccessType(course.accessType || 'PAID');
    setTotalLectures(course.totalLectures?.toString() || '');
    setAuthorMessage(course.authorMessage || '');
    setSubjectId(course.subjectId || '');
    setLanguageId(course.languageId || '');
    const durationMatch = course.totalDuration?.match(/(\d+)/);
    setDuration(durationMatch ? durationMatch[1] : '');
    
    if (course.startDate) {
      setStartDate(new Date(course.startDate).toISOString().split('T')[0]);
    }
    if (course.endDate) {
      setEndDate(new Date(course.endDate).toISOString().split('T')[0]);
    }
  };



  useEffect(() => {
    if (!currentCourse) return;
    console.log('📝 UpdateCoursePage: Populating form with course data:', currentCourse);
    populateFormFields(currentCourse);
    if (currentCourse.thumbnailUrl) {
      setSelectedImage(currentCourse.thumbnailUrl);
    }
  }, [currentCourse, subjects, languages]);

  const handleSubmit = async () => {
    console.log('🎯 UpdateCoursePage: Starting course update process');
    console.log('📦 UpdateCoursePage: Course ID:', courseId);
    
    if (!courseId) {
      setErrorMessage('Course ID is missing');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    
    const validationError = validateCourseForm(courseName, description, price, duration, startDate, endDate);
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    
    let updateData: any = formatCourseData(
      courseName, description, price, discountedPrice, validityDays,
      accessType, duration, totalLectures, authorMessage, startDate, endDate,
      subjectId, languageId
    );
    
    // Add thumbnail if a new one was selected
    if (selectedImage && selectedImage !== currentCourse?.thumbnailUrl) {
      updateData.thumbnail = {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'thumbnail.jpg'
      };
    }
    
    console.log('📦 UpdateCoursePage: Update data prepared:', updateData);
    
    try {
      const result = await dispatch(updateCourse({ 
        courseId, 
        courseData: updateData 
      }));
      
      if (result.type.endsWith('/fulfilled')) {
        console.log('✅ UpdateCoursePage: Course updated successfully');
        setSuccessMessage('Course updated successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          onSubmit?.(result.payload);
          // Navigate after onSubmit callback
          setTimeout(() => {
            handleBack();
          }, 100);
        }, 2000);
      } else {
        console.log('❌ UpdateCoursePage: Course update failed');
        const errorMsg = result.payload?.message || error || 'Failed to update course';
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (err) {
      console.log('❌ UpdateCoursePage: Unexpected error:', err);
      setErrorMessage('An unexpected error occurred');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };
  
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



  const onStartDateChange = handleDateChange(setShowStartDatePicker, setStartDate);
  const onEndDateChange = handleDateChange(setShowEndDatePicker, setEndDate);

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
          style={[courseStyles.submitButton, loading.update && courseStyles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading.update}
        >
          <Text style={courseStyles.submitButtonText}>
            {loading.update ? 'Updating...' : 'Update Course'}
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      
      <SuccessPopup
        visible={showSuccessPopup}
        message={successMessage}
        onClose={() => setShowSuccessPopup(false)}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
    </SafeAreaView>
  );
};



export default UpdateCoursePage;