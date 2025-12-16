import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse, fetchCourseDetails } from '../store/courseSlice';
import { fetchSubjects, fetchLanguages } from '../store/onboardingSlice';
import { validateCourseForm, formatCourseData } from '../utils/courseUtils';

export const useUpdateCourse = (courseId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, currentCourse } = useSelector((state: RootState) => state.course);
  
  const [formState, setFormState] = useState({
    courseName: '', duration: '', startDate: '', endDate: '', price: '',
    discountedPrice: '', description: '', totalLectures: '', validityDays: '',
    authorMessage: '', accessType: 'PAID' as 'PAID' | 'FREE', subjectId: '', languageId: ''
  });
  
  const [uiState, setUiState] = useState({
    selectedImage: null as string | null, showStartDatePicker: false, showEndDatePicker: false,
    showSuccessPopup: false, showErrorPopup: false, successMessage: '', errorMessage: ''
  });

  useEffect(() => {
    if (courseId) dispatch(fetchCourseDetails(courseId));
    dispatch(fetchSubjects());
    dispatch(fetchLanguages());
  }, [dispatch, courseId]);

  useEffect(() => {
    if (currentCourse) {
      const durationMatch = currentCourse.totalDuration?.match(/(\d+)/);
      setFormState({
        courseName: currentCourse.name || '',
        description: currentCourse.description || '',
        price: currentCourse.price?.toString() || '',
        discountedPrice: currentCourse.discountPrice?.toString() || '',
        validityDays: currentCourse.validityDays?.toString() || '',
        accessType: currentCourse.accessType || 'PAID',
        totalLectures: currentCourse.totalLectures?.toString() || '',
        authorMessage: currentCourse.authorMessage || '',
        subjectId: currentCourse.subjectId || '',
        languageId: currentCourse.languageId || '',
        duration: durationMatch ? durationMatch[1] : '',
        startDate: currentCourse.startDate ? new Date(currentCourse.startDate).toISOString().split('T')[0] : '',
        endDate: currentCourse.endDate ? new Date(currentCourse.endDate).toISOString().split('T')[0] : ''
      });
      if (currentCourse.thumbnailUrl) {
        setUiState(prev => ({ ...prev, selectedImage: currentCourse.thumbnailUrl }));
      }
    }
  }, [currentCourse]);

  const showError = (message: string) => {
    setUiState(prev => ({ ...prev, errorMessage: message, showErrorPopup: true }));
    setTimeout(() => setUiState(prev => ({ ...prev, showErrorPopup: false })), 3000);
  };

  const showSuccess = (message: string) => {
    setUiState(prev => ({ ...prev, successMessage: message, showSuccessPopup: true }));
  };

  const handleSubmit = async (onSubmit?: (data: any) => void, onBack?: () => void) => {
    if (!courseId) {
      showError('Course ID is missing');
      return;
    }
    
    const validationError = validateCourseForm(
      formState.courseName, formState.description, formState.price, 
      formState.duration, formState.startDate, formState.endDate
    );
    if (validationError) {
      showError(validationError);
      return;
    }
    
    let updateData: any = formatCourseData(
      formState.courseName, formState.description, formState.price, formState.discountedPrice,
      formState.validityDays, formState.accessType, formState.duration, formState.totalLectures,
      formState.authorMessage, formState.startDate, formState.endDate, formState.subjectId, formState.languageId
    );
    
    if (uiState.selectedImage && uiState.selectedImage !== currentCourse?.thumbnailUrl) {
      updateData.thumbnail = { uri: uiState.selectedImage, type: 'image/jpeg', name: 'thumbnail.jpg' };
    }
    
    try {
      const result = await dispatch(updateCourse({ courseId, courseData: updateData }));
      
      if (result.type.endsWith('/fulfilled')) {
        showSuccess('Course updated successfully!');
        setTimeout(() => {
          setUiState(prev => ({ ...prev, showSuccessPopup: false }));
          onSubmit?.(result.payload);
          setTimeout(() => onBack?.(), 100);
        }, 2000);
      } else {
        showError(result.payload?.message || error || 'Failed to update course');
      }
    } catch (err) {
      console.error('UpdateCoursePage: Unexpected error:', err);
      showError('An unexpected error occurred');
    }
  };

  return {
    formState, setFormState, uiState, setUiState, loading, handleSubmit,
    showError, showSuccess, currentCourse
  };
};