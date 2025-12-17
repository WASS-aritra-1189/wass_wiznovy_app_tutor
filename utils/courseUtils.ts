export const validateCourseForm = (
  courseName: string,
  description: string,
  price: string,
  duration: string,
  startDate: string,
  endDate: string
): string | null => {
  if (!courseName || !description || !price || !duration || !startDate || !endDate) {
    return 'Please fill in all required fields';
  }
  return null;
};

interface CourseFormData {
  courseName: string;
  description: string;
  price: string;
  discountedPrice: string;
  validityDays: string;
  accessType: 'PAID' | 'FREE';
  duration: string;
  totalLectures: string;
  authorMessage: string;
  startDate: string;
  endDate: string;
  subjectId?: string;
  languageId?: string;
}

export const formatCourseData = (data: CourseFormData) => ({
  name: data.courseName,
  description: data.description,
  price: data.price,
  discountPrice: data.discountedPrice || undefined,
  validityDays: Number.parseInt(data.validityDays, 10) || 365,
  accessType: data.accessType,
  totalDuration: `${data.duration} hours`,
  totalLectures: Number.parseInt(data.totalLectures, 10) || 1,
  authorMessage: data.authorMessage || 'Welcome to this course',
  startDate: new Date(data.startDate).toISOString().split('T')[0],
  endDate: new Date(data.endDate).toISOString().split('T')[0],
  subjectId: data.subjectId || undefined,
  languageId: data.languageId || undefined,
});

export const handleDateChange = (
  setShowPicker: (show: boolean) => void,
  setDate: (date: string) => void
) => (event: any, selectedDate?: Date) => {
  setShowPicker(false);
  if (selectedDate) {
    setDate(selectedDate.toISOString().split('T')[0]);
  }
};