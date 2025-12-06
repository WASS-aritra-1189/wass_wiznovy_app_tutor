import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse } from '../store/courseSlice';
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

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({ visible, onClose, course, onSubmit }) => {
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

  // Populate form with course data when course prop changes
  useEffect(() => {
    if (course) {
      console.log('📝 UpdateCourseForm: Populating form with course data:', course);
      setCourseName(course.name || '');
      setDescription(course.description || '');
      setPrice(course.price?.toString() || '');
      setDiscountedPrice(course.discountPrice?.toString() || '');
      setValidityDays(course.validityDays?.toString() || '');
      setAccessType(course.accessType || 'PAID');
      setTotalLectures(course.totalLectures?.toString() || '');
      setAuthorMessage(course.authorMessage || '');
      
      // Extract duration number from string like "70 min" or "40 hours"
      const durationRegex = /(\d+)/;
      const durationMatch = course.totalDuration ? durationRegex.exec(course.totalDuration) : null;
      setDuration(durationMatch ? durationMatch[1] : '');
      
      // Format dates for input fields
      if (course.startDate) {
        const startDateFormatted = new Date(course.startDate).toISOString().split('T')[0];
        setStartDate(startDateFormatted);
      }
      if (course.endDate) {
        const endDateFormatted = new Date(course.endDate).toISOString().split('T')[0];
        setEndDate(endDateFormatted);
      }
    }
  }, [course]);

  const handleSubmit = async () => {
    console.log('🎯 UpdateCourseForm: Starting course update process');
    console.log('📦 UpdateCourseForm: Course ID:', course?.id);
    
    if (!course?.id) {
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
    
    const updateData = {
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
    };
    
    console.log('📦 UpdateCourseForm: Update data prepared:', updateData);
    
    try {
      const result = await dispatch(updateCourse({ 
        courseId: course.id, 
        courseData: updateData 
      }));
      
      if (result.type.endsWith('/fulfilled')) {
        console.log('✅ UpdateCourseForm: Course updated successfully');
        setSuccessMessage('Course updated successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        console.log('❌ UpdateCourseForm: Course update failed');
        const errorMsg = result.payload?.message || error || 'Failed to update course';
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (err) {
      console.log('❌ UpdateCourseForm: Unexpected error:', err);
      setErrorMessage('An unexpected error occurred');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  const handleThumbnailUpload = () => {
    console.log('📸 UpdateCourseForm: Thumbnail upload pressed');
    // TODO: Implement image picker functionality
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log('📅 UpdateCourseForm: Start date selected:', dateStr);
      setStartDate(dateStr);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log('📅 UpdateCourseForm: End date selected:', dateStr);
      setEndDate(dateStr);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Course</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          
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
            
            <Text style={styles.fieldLabel}>Start Date *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
              <Text style={startDate ? styles.dateText : styles.placeholderText}>
                {startDate || 'Select Start Date'}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#666666" />
            </TouchableOpacity>
            
            <Text style={styles.fieldLabel}>End Date *</Text>
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
              <Image 
                source={require('../assets/uploadthumbnail.png')} 
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Thumbnail should be 1280 X 720</Text>
            </TouchableOpacity>
          </ScrollView>
          
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
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    maxHeight: 400,
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
    marginTop: 20,
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
});

export default UpdateCourseForm;