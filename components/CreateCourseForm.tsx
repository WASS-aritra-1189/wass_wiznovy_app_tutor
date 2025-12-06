import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCourse } from '../store/courseSlice';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';
import { CourseFormBase, styles } from './CourseFormBase';

interface CreateCourseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (courseData: any) => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ visible, onClose, onSubmit }) => {
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
    console.log('🎯 CreateCourseForm: Starting course creation process');
    
    if (!courseName || !description || !price || !duration || !startDate || !endDate) {
      setErrorMessage('Please fill in all required fields');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }
    
    const courseData = {
      name: courseName,
      description,
      price: price,
      discountPrice: discountedPrice || undefined,
      validityDays: Number.parseInt(validityDays) || 365,
      accessType,
      totalDuration: `${duration} hours`,
      totalLectures: Number.parseInt(totalLectures) || 1,
      authorMessage: authorMessage || 'Welcome to this course',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
    
    console.log('📦 CreateCourseForm: Course data prepared:', courseData);
    
    try {
      const result = await dispatch(createCourse(courseData));
      
      if (result.type.endsWith('/fulfilled')) {
        console.log('✅ CreateCourseForm: Course created successfully');
        setSuccessMessage('Course created successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          resetForm();
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        console.log('❌ CreateCourseForm: Course creation failed');
        const errorMsg = result.payload?.message || error || 'Failed to create course';
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (err) {
      console.log('❌ CreateCourseForm: Unexpected error:', err);
      setErrorMessage('An unexpected error occurred');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  const resetForm = () => {
    setCourseName(''); setDuration(''); setStartDate(''); setEndDate('');
    setPrice(''); setDiscountedPrice(''); setDescription('');
    setTotalLectures(''); setValidityDays(''); setAuthorMessage(''); setAccessType('PAID');
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
            <Text style={styles.title}>Create New Course</Text>
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
              style={[styles.submitButton, loading.create && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading.create}
            >
              <Text style={styles.submitButtonText}>
                {loading.create ? 'Creating...' : 'Create Course'}
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

export default CreateCourseForm;