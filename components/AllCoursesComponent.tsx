import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchMyCourses } from '../store/courseSlice';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  courseName: string;
  schedule: string; // This will be duration like "25 hours"
  classBookedFor: string;
  studentImage?: any;
  startDate: string;
  endDate: string;
  price?: string;
}

interface AllCoursesComponentProps {
  onCoursePress?: (course: any) => void;
  onCreateCourse?: () => void;
  onEditCourse?: (course: any) => void;
}

const AllCoursesComponent: React.FC<AllCoursesComponentProps> = ({ 
  onCoursePress,
  onCreateCourse,
  onEditCourse 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.course);
  
  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);
  const getStatus = (startDate: string, endDate: string): string => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return 'Next';
    if (today > end) return 'Ended';
    return 'Ongoing';
  };
  
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    const formatDate = (date: Date) => {
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };
    
    if (start.toDateString() === today.toDateString()) {
      return `Today - ${formatDate(end)}`;
    } else if (end.toDateString() === today.toDateString()) {
      return `${formatDate(start)} - Today`;
    } else {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  };
 

  const apiCourses = courses.map(course => ({
    id: course.id || '',
    courseName: course.name || 'Untitled Course',
    schedule: course.totalDuration || '0 hours',
    classBookedFor: course.description || 'No description',
    startDate: course.startDate || new Date().toISOString(),
    endDate: course.endDate || new Date().toISOString(),
    price: `$${course.price || '0'}`,
    status: course.status || 'PENDING',
    accessType: course.accessType || 'FREE',
    language: course.language?.name || 'English',
    totalLectures: String(course.totalLectures || '0'),
    rating: String(course.averageRating || '0'),
    studentImage: course.thumbnailUrl ? { uri: course.thumbnailUrl } : null
  }));
  
  const coursesToShow = apiCourses.length > 0 ? apiCourses : [];

  const renderCourse = ({ item }: { item: any }) => (
    <View style={styles.courseItemWrapper}>
      <TouchableOpacity onPress={() => onCoursePress?.(item)} activeOpacity={0.7}>
        <CourseCard
          image={item.studentImage || require('../assets/studentimageforbooking.png')}
          title={item.courseName}
          description={item.classBookedFor}
          duration={item.schedule}
          language={item.language || 'English'}
          price={item.price}
          totalVideos={item.totalLectures || '0'}
          rating={item.rating || '4.5'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editCourseButton}
        onPress={() => onEditCourse?.(item)}
      >
        <MaterialIcons name="edit" size={16} color="#16423C" />
        <Text style={styles.editCourseText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading.fetch) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#16423C" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={coursesToShow}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.createButton} onPress={onCreateCourse}>
        <Text style={styles.createButtonText}>Create New Course</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },

  listContainer: {
    paddingBottom: 100,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#16423C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  courseItemWrapper: {
    position: 'relative',
  },
  editCourseButton: {
    position: 'absolute',
    top: 10,
    right: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    gap: 2,
  },
  editCourseText: {
    fontSize: 10,
    color: '#16423C',
    fontWeight: 'bold',
  },
});

export default AllCoursesComponent;