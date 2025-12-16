import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCourse } from '../store/courseSlice';
import { useCourseForm } from '../hooks/useCourseForm';
import CourseFormWrapper from './CourseFormWrapper';

interface CreateCourseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (courseData: unknown) => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.course);
  const form = useCourseForm();

  const handleSubmit = async () => {
    if (!form.validateForm()) return;
    
    try {
      const result = await dispatch(createCourse(form.prepareCourseData()));
      
      if (createCourse.fulfilled.match(result)) {
        form.showSuccess('Course created successfully!');
        setTimeout(() => {
          form.setShowSuccessPopup(false);
          form.resetForm();
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        form.showError((result.payload as any)?.message || error || 'Failed to create course');
      }
    } catch (err) {
      console.error('Course creation failed:', err);
      form.showError('An unexpected error occurred');
    }
  };

  if (!visible) return null;

  return (
    <CourseFormWrapper
      title="Create New Course"
      onClose={onClose}
      onSubmit={handleSubmit}
      form={form}
      loading={loading.create}
      submitText="Create Course"
      loadingText="Creating..."
    />
  );
};



export default CreateCourseForm;