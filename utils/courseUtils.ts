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

export const formatCourseData = (
  courseName: string,
  description: string,
  price: string,
  discountedPrice: string,
  validityDays: string,
  accessType: 'PAID' | 'FREE',
  duration: string,
  totalLectures: string,
  authorMessage: string,
  startDate: string,
  endDate: string,
  subjectId?: string,
  languageId?: string
) => ({
  name: courseName,
  description,
  price,
  discountPrice: discountedPrice || undefined,
  validityDays: Number.parseInt(validityDays, 10) || 365,
  accessType,
  totalDuration: `${duration} hours`,
  totalLectures: Number.parseInt(totalLectures, 10) || 1,
  authorMessage: authorMessage || 'Welcome to this course',
  startDate: new Date(startDate).toISOString(),
  endDate: new Date(endDate).toISOString(),
  subjectId: subjectId || undefined,
  languageId: languageId || undefined,
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