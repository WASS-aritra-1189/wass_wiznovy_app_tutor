import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../store/store';
import { fetchCourseDetails, fetchUnitsByCourse } from '../store/courseSlice';

const CourseDetailsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId, course } = route.params as { courseId?: string; course?: any };
  const actualCourseId = courseId || course?.id;
  
  const { currentCourse, units, loading } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    if (actualCourseId) {
      console.log('CourseDetailsPage: Fetching course details for courseId:', actualCourseId);
      dispatch(fetchCourseDetails(actualCourseId));
      dispatch(fetchUnitsByCourse(actualCourseId));
    }
  }, [dispatch, actualCourseId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateUnit = () => {
    navigation.navigate('CreateUnit', { courseId: actualCourseId });
  };

  const renderUnit = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.unitCard}
      onPress={() => navigation.navigate('UnitDetails', { unit: item })}
      activeOpacity={0.7}
    >
      <View style={styles.unitContent}>
        {item.imgUrl && (
          <Image source={{ uri: item.imgUrl }} style={styles.unitImage} />
        )}
        <View style={styles.unitInfo}>
          <View style={styles.unitHeader}>
            <Text style={styles.unitName}>{item.name}</Text>
            <View style={[styles.statusBadge, item.status === 'PENDING' ? styles.pendingBadge : styles.activeBadge]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.unitDescription}>{item.description}</Text>
          <View style={styles.unitStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="play-circle-outline" size={16} color="#666666" />
              <Text style={styles.statText}>{item.videoLectures?.length || 0} Videos</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="description" size={16} color="#666666" />
              <Text style={styles.statText}>{item.studyMaterials?.length || 0} Materials</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading.fetchDetails || loading.fetchUnits) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Course Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Course Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('UpdateCourse', { courseId: actualCourseId })}
        >
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentCourse && (
          <>
            <View style={styles.courseHeader}>
              {currentCourse.thumbnailUrl && (
                <Image source={{ uri: currentCourse.thumbnailUrl }} style={styles.courseThumbnail} />
              )}
              <Text style={styles.courseName}>{currentCourse.name}</Text>
              <Text style={styles.courseDescription}>{currentCourse.description}</Text>
              
              <View style={styles.courseStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Price:</Text>
                  <Text style={styles.statValue}>${currentCourse.price}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Duration:</Text>
                  <Text style={styles.statValue}>{currentCourse.totalDuration}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Lectures:</Text>
                  <Text style={styles.statValue}>{currentCourse.totalLectures}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Rating:</Text>
                  <Text style={styles.statValue}>{currentCourse.averageRating}/5</Text>
                </View>
              </View>
            </View>

            <View style={styles.unitsSection}>
              <View style={styles.unitsSectionHeader}>
                <Text style={styles.sectionTitle}>Units ({units.length})</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleCreateUnit}>
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add Unit</Text>
                </TouchableOpacity>
              </View>

              {units.length > 0 ? (
                <FlatList
                  data={units}
                  renderItem={renderUnit}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <MaterialIcons name="folder-open" size={48} color="#CCCCCC" />
                  <Text style={styles.emptyText}>No units created yet</Text>
                  <Text style={styles.emptySubtext}>Add your first unit to get started</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
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
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  courseHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  courseThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 22,
  },
  courseStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
  },
  unitsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 120,
  },
  unitsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16423C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  unitCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unitContent: {
    flexDirection: 'row',
    gap: 12,
  },
  unitImage: {
    width: 80,
    height: 60,
    borderRadius: 6,
  },
  unitInfo: {
    flex: 1,
  },

  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FFA500',
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unitDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 18,
  },
  unitStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
});

export default CourseDetailsPage;