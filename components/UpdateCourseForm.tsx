import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateCourse } from '../store/courseSlice';
import { useCourseForm } from '../hooks/useCourseForm';
import CourseFormWrapper from './CourseFormWrapper';

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
  const form = useCourseForm();

  useEffect(() => {
    if (course) {
      form.setCourseName(course.name || '');
      form.setDescription(course.description || '');
      form.setPrice(course.price?.toString() || '');
      form.setDiscountedPrice(course.discountPrice?.toString() || '');
      form.setValidityDays(course.validityDays?.toString() || '');
      form.setAccessType(course.accessType || 'PAID');
      form.setTotalLectures(course.totalLectures?.toString() || '');
      form.setAuthorMessage(course.authorMessage || '');
      form.setDuration(course.totalDuration ? (/(\d+)/.exec(course.totalDuration)?.[1] || '') : '');
      if (course.startDate) form.setStartDate(new Date(course.startDate).toISOString().split('T')[0]);
      if (course.endDate) form.setEndDate(new Date(course.endDate).toISOString().split('T')[0]);
    }
  }, [course]);

  const handleSubmit = async () => {
    if (!course?.id) {
      form.showError('Course ID is missing');
      return;
    }
    if (!form.validateForm()) return;
    
    try {
      const formattedStartDate = new Date(form.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(form.endDate).toISOString().split('T')[0];
      const updateData = { ...form.prepareCourseData(), startDate: formattedStartDate, endDate: formattedEndDate };
      const result = await dispatch(updateCourse({ courseId: course.id, courseData: updateData }));
      
      if (updateCourse.fulfilled.match(result)) {
        form.showSuccess('Course updated successfully!');
        setTimeout(() => {
          form.setShowSuccessPopup(false);
          onClose();
          onSubmit?.(result.payload);
        }, 2000);
      } else {
        form.showError((result.payload as any)?.message || error || 'Failed to update course');
      }
    } catch (err) {
      console.error('Course update failed:', err);
      form.showError('An unexpected error occurred');
    }
  };

  if (!visible) return null;

  return (
    <CourseFormWrapper
      title="Update Course"
      onClose={onClose}
      onSubmit={handleSubmit}
      form={form}
      loading={loading.update}
      submitText="Update Course"
      loadingText="Updating..."
    />
  );
};



export default UpdateCourseForm;