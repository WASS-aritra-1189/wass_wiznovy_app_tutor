import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AllCoursesComponent from '../components/AllCoursesComponent';

interface AllCoursesPageProps {
  navigation?: any;
  onBack?: () => void;
}

const AllCoursesPage: React.FC<AllCoursesPageProps> = ({ navigation, onBack }) => {
  const handleCoursePress = (course: any) => {
    navigation?.navigate('CourseDetails', { courseId: course.id });
  };
  
  const handleCreateCourse = () => {
    navigation?.navigate('CreateCourse');
  };

  const handleEditCourse = (course: any) => {
    console.log('✏️ AllCoursesPage: Editing course:', course.courseName);
    navigation?.navigate('UpdateCourse', { courseId: course.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>All Courses</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <AllCoursesComponent 
        onCoursePress={handleCoursePress} 
        onCreateCourse={handleCreateCourse}
        onEditCourse={handleEditCourse}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
});

export default AllCoursesPage;