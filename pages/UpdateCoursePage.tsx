import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse, fetchCourseDetails } from '../store/courseSlice';
import { fetchSubjects, fetchLanguages } from '../store/onboardingSlice';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';

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
  const [subject, setSubject] = useState('');
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
  const [language, setLanguage] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Fetch course details and dropdown data on component mount
  useEffect(() => {
    if (courseId) {
      console.log('🔍 UpdateCoursePage: Fetching course details for ID:', courseId);
      dispatch(fetchCourseDetails(courseId));
    }
    dispatch(fetchSubjects());
    dispatch(fetchLanguages());
  }, [dispatch, courseId]);

  const populateBasicFields = (course: any) => {
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
  };

  const populateDates = (course: any) => {
    if (course.startDate) {
      setStartDate(new Date(course.startDate).toISOString().split('T')[0]);
    }
    if (course.endDate) {
      setEndDate(new Date(course.endDate).toISOString().split('T')[0]);
    }
  };

  const populateSubjectAndLanguage = (course: any) => {
    const foundSubject = subjects.find(s => s.id === course.subjectId);
    if (foundSubject) setSubject(foundSubject.name);
    const foundLanguage = languages.find(l => l.id === course.languageId);
    if (foundLanguage) setLanguage(foundLanguage.name);
  };

  // Populate form when course data is loaded
  useEffect(() => {
    if (!currentCourse) return;
    console.log('📝 UpdateCoursePage: Populating form with course data:', currentCourse);
    populateBasicFields(currentCourse);
    populateDates(currentCourse);
    if (subjects.length > 0 || languages.length > 0) {
      populateSubjectAndLanguage(currentCourse);
    }
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
    
    if (!courseName || !description || !price || !duration || !startDate || !endDate) {
      setErrorMessage('Please fill in all required fields');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    
    let updateData: any = {
      name: courseName,
      description,
      price: price,
      discountPrice: discountedPrice || undefined,
      validityDays: Number.parseInt(validityDays) || 365,
      accessType,
      totalDuration: `${duration} hours`,
      totalLectures: Number.parseInt(totalLectures) || 1,
      authorMessage: authorMessage || 'Welcome to this course',
      startDate: new Date(startDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
      endDate: new Date(endDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
      subjectId: subjectId || undefined,
      languageId: languageId || undefined,
    };
    
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

  const handleThumbnailUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  if (loading.fetchDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16423C" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Update Course</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Update Course</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Course Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Course Name"
          value={courseName}
          onChangeText={setCourseName}
        />
        
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
        
        <Text style={styles.fieldLabel}>Subject</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
          >
            <Text style={[styles.dropdownText, !subject && styles.placeholderText]}>
              {subject || 'Select Subject'}
            </Text>
          </TouchableOpacity>
          {showSubjectDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {subjects.map((subjectItem, index) => (
                  <TouchableOpacity
                    key={`subject-${subjectItem.id || index}`}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSubject(subjectItem.name);
                      setSubjectId(subjectItem.id);
                      setShowSubjectDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{subjectItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <Text style={styles.fieldLabel}>Language</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Text style={[styles.dropdownText, !language && styles.placeholderText]}>
              {language || 'Select Language'}
            </Text>
          </TouchableOpacity>
          {showLanguageDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {languages.map((languageItem, index) => (
                  <TouchableOpacity
                    key={`language-${languageItem.id || index}`}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setLanguage(languageItem.name);
                      setLanguageId(languageItem.id);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{languageItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <Text style={styles.fieldLabel}>Total Duration *</Text>
        <TextInput
          style={styles.input}
          placeholder="Duration (hours)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Total Lectures</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of lectures"
          value={totalLectures}
          onChangeText={setTotalLectures}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Validity Days</Text>
        <TextInput
          style={styles.input}
          placeholder="Course validity in days (default: 365)"
          value={validityDays}
          onChangeText={setValidityDays}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Start Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
          <Text style={startDate ? styles.dateText : styles.placeholderText}>
            {startDate || 'Select Start Date'}
          </Text>
          <MaterialIcons name="calendar-today" size={20} color="#666666" />
        </TouchableOpacity>
        
        <Text style={styles.fieldLabel}>End Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
          <Text style={endDate ? styles.dateText : styles.placeholderText}>
            {endDate || 'Select End Date'}
          </Text>
          <MaterialIcons name="calendar-today" size={20} color="#666666" />
        </TouchableOpacity>
        
        <Text style={styles.fieldLabel}>Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="Price (e.g., 599.00)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Discounted Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Discounted Price (e.g., 399.00)"
          value={discountedPrice}
          onChangeText={setDiscountedPrice}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Course Description *</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter course description..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <Text style={styles.fieldLabel}>Author Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Welcome message for students"
          value={authorMessage}
          onChangeText={setAuthorMessage}
        />
        
        <Text style={styles.fieldLabel}>Thumbnail</Text>
        <TouchableOpacity style={styles.thumbnailUpload} onPress={handleThumbnailUpload}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <>
              <Image 
                source={require('../assets/uploadthumbnail.png')} 
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Thumbnail should be 1280 X 720</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.bottomSpacer} />
        </ScrollView>
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
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
  headerPlaceholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#16423C',
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  thumbnailUpload: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 40,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    minHeight: 120,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#666666',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
    marginBottom: 8,
    marginTop: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    height: 100,
  },
  selectedImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  accessTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  accessTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  accessTypeButtonActive: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  accessTypeText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  accessTypeTextActive: {
    color: '#FFFFFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#999999',
    opacity: 0.7,
  },
  bottomSpacer: {
    height: 100,
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: -8,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
});

export default UpdateCoursePage;