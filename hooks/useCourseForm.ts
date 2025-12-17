import { useState } from 'react';
import { validateCourseForm, formatCourseData, handleDateChange } from '../utils/courseUtils';

export const useCourseForm = () => {
  const [courseName, setCourseName] = useState('');
  const setCourseNameWithValidation = (text: string) => {
    setCourseName(text.replaceAll(/[^a-zA-Z0-9\s]/g, ''));
  };
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

  const handleThumbnailUpload = () => {};

  const onStartDateChange = handleDateChange(setShowStartDatePicker, setStartDate);
  const onEndDateChange = handleDateChange(setShowEndDatePicker, setEndDate);

  const validateForm = () => {
    const error = validateCourseForm(courseName, description, price, duration, startDate, endDate);
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const prepareCourseData = () => formatCourseData(
    courseName, description, price, discountedPrice, validityDays,
    accessType, duration, totalLectures, authorMessage, startDate, endDate
  );

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccessPopup(true);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setShowErrorPopup(true);
    setTimeout(() => setShowErrorPopup(false), 3000);
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

  return {
    courseName, setCourseName: setCourseNameWithValidation, duration, setDuration, startDate, setStartDate, endDate, setEndDate,
    price, setPrice, discountedPrice, setDiscountedPrice, description, setDescription,
    totalLectures, setTotalLectures, validityDays, setValidityDays,
    authorMessage, setAuthorMessage, accessType, setAccessType,
    showStartDatePicker, setShowStartDatePicker, showEndDatePicker, setShowEndDatePicker,
    showSuccessPopup, setShowSuccessPopup, showErrorPopup, setShowErrorPopup,
    successMessage, errorMessage, handleThumbnailUpload,
    onStartDateChange, onEndDateChange, validateForm, prepareCourseData,
    showSuccess, showError, resetForm
  };
};
