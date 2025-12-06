import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse } from '../store/courseSlice';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';
import { CourseFormBase, styles } from './CourseFormBase';

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

  const handleThumbnailUpload = () => {};

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate.toISOString().split('T')[0]);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate.toISOString().split('T')[0]);
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
          
          <CourseFormBase
            courseName={courseName} setCourseName={setCourseName}
            accessType={accessType} setAccessType={setAccessType}
            duration={duration} setDuration={setDuration}
            totalLectures={totalLectures} setTotalLectures={setTotalLectures}
            validityDays={validityDays} setValidityDays={setValidityDays}
            startDate={startDate} setShowStartDatePicker={setShowStartDatePicker}
            endDate={endDate} setShowEndDatePicker={setShowEndDatePicker}
            price={price} setPrice={setPrice}
            discountedPrice={discountedPrice} setDiscountedPrice={setDiscountedPrice}
            description={description} setDescription={setDescription}
            authorMessage={authorMessage} setAuthorMessage={setAuthorMessage}
            handleThumbnailUpload={handleThumbnailUpload}
            showStartDatePicker={showStartDatePicker}
            showEndDatePicker={showEndDatePicker}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />
          
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
          
          <SuccessPopup visible={showSuccessPopup} message={successMessage} onClose={() => setShowSuccessPopup(false)} />
          <ErrorPopup visible={showErrorPopup} message={errorMessage} onClose={() => setShowErrorPopup(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateCourseForm;