import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchMyCourses, createCourse, updateCourse } from '../store/courseSlice';
import CreateCourseForm from './CreateCourseForm';
import UpdateCourseForm from './UpdateCourseForm';

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
  status: string;
  thumbnailUrl?: string;
}

const CourseManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.course);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    console.log('📚 CourseManagement: Fetching courses on component mount');
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const handleCreateCourse = () => {
    console.log('➕ CourseManagement: Opening create course form');
    setShowCreateForm(true);
  };

  const handleUpdateCourse = (course: Course) => {
    console.log('✏️ CourseManagement: Opening update course form for:', course.name);
    setSelectedCourse(course);
    setShowUpdateForm(true);
  };

  const handleCreateSuccess = (courseData: any) => {
    console.log('✅ CourseManagement: Course created successfully:', courseData);
    // Refresh the courses list
    dispatch(fetchMyCourses());
    Alert.alert('Success', 'Course created successfully!');
  };

  const handleUpdateSuccess = (courseData: any) => {
    console.log('✅ CourseManagement: Course updated successfully:', courseData);
    // Refresh the courses list
    dispatch(fetchMyCourses());
    Alert.alert('Success', 'Course updated successfully!');
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={styles.courseItem}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.courseDetails}>
          <Text style={styles.coursePrice}>${item.price}</Text>
          <Text style={styles.courseStatus}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleUpdateCourse(item)}
      >
        <MaterialIcons name="edit" size={20} color="#16423C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCourse}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Course</Text>
        </TouchableOpacity>
      </View>

      {loading.fetch ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchMyCourses())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No courses found</Text>
              <Text style={styles.emptySubtext}>Create your first course to get started</Text>
            </View>
          }
        />
      )}

      <CreateCourseForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateSuccess}
      />

      <UpdateCourseForm
        visible={showUpdateForm}
        onClose={() => {
          setShowUpdateForm(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSubmit={handleUpdateSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16423C',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  courseItem: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
  },
  courseStatus: {
    fontSize: 12,
    color: '#999999',
    textTransform: 'uppercase',
  },
  editButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CourseManagement;