import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import UnitCard from '../components/UnitCard';

interface CourseUnitsPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const CourseUnitsPage: React.FC<CourseUnitsPageProps> = ({ navigation, route, onBack }) => {
  const courseName = route?.params?.courseName || 'Advanced Mathematics';
  
  // Sample units data
  const units = [
    {
      id: 1,
      courseName: courseName,
      unitName: 'Introduction to Algebra',
      totalVideos: 12,
      totalMaterials: 8,
      subject: 'Mathematics',
      duration: '2.5 hours',
      unitImage: require('../assets/coursefinalimage.png'),
    },
    {
      id: 2,
      courseName: courseName,
      unitName: 'Linear Equations',
      totalVideos: 15,
      totalMaterials: 10,
      subject: 'Mathematics',
      duration: '3 hours',
      unitImage: require('../assets/coursefinalimage.png'),
    },
    {
      id: 3,
      courseName: courseName,
      unitName: 'Quadratic Functions',
      totalVideos: 18,
      totalMaterials: 12,
      subject: 'Mathematics',
      duration: '4 hours',
      unitImage: require('../assets/coursefinalimage.png'),
    },
    {
      id: 4,
      courseName: courseName,
      unitName: 'Polynomials',
      totalVideos: 20,
      totalMaterials: 15,
      subject: 'Mathematics',
      duration: '4.5 hours',
      unitImage: require('../assets/coursefinalimage.png'),
    },
    {
      id: 5,
      courseName: courseName,
      unitName: 'Exponential Functions',
      totalVideos: 14,
      totalMaterials: 9,
      subject: 'Mathematics',
      duration: '3.5 hours',
      unitImage: require('../assets/coursefinalimage.png'),
    },
  ];

  const handleUnitPress = (unit: any) => {
    navigation?.navigate('UnitDetails', { unit });
  };

  const handleEditUnit = (unit: any) => {
    console.log('✏️ CourseUnitsPage: Editing unit:', unit.unitName);
    navigation?.navigate('UpdateUnit', { unitId: unit.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Course Units</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{courseName}</Text>
          <Text style={styles.unitsCount}>{units.length} Units Available</Text>
        </View>
        
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            courseName={unit.courseName}
            unitName={unit.unitName}
            totalVideos={unit.totalVideos}
            totalMaterials={unit.totalMaterials}
            subject={unit.subject}
            duration={unit.duration}
            unitImage={unit.unitImage}
            onPress={() => handleUnitPress(unit)}
            onEdit={() => handleEditUnit(unit)}
            unitId={unit.id.toString()}
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={() => navigation?.navigate('UploadUnit', { courseName })}
      >
        <Text style={styles.uploadButtonText}>Upload New Unit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  courseInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  unitsCount: {
    fontSize: 14,
    color: '#666666',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 90,
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
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseUnitsPage;