import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../store/store';
import { fetchVideosByUnit, fetchStudyMaterialsByUnit } from '../store/courseSlice';

const UnitDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'materials'>('videos');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { unit } = route.params as { unit: any };
  
  const { videoLectures, studyMaterials, loading } = useSelector((state: RootState) => state.course);
  
  useEffect(() => {
    if (unit.id) {
      dispatch(fetchVideosByUnit(unit.id));
      dispatch(fetchStudyMaterialsByUnit(unit.id));
    }
  }, [dispatch, unit.id]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddVideo = () => {
    (navigation as any).navigate('CreateVideoLecture', { unitId: unit.id });
  };

  const handleAddMaterial = () => {
    (navigation as any).navigate('CreateStudyMaterial', { unitId: unit.id });
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.videoThumbnail}>
          {item.thumbnailUrl ? (
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnailImage} />
          ) : (
            <MaterialIcons name="play-circle-outline" size={40} color="#666666" />
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title || 'Untitled Video'}</Text>
          <Text style={styles.itemDescription}>{item.description || 'No description'}</Text>
          <Text style={styles.itemDuration}>{item.duration || 0} minutes</Text>
        </View>
        <TouchableOpacity
          style={styles.editItemButton}
          onPress={() => (navigation as any).navigate('UpdateVideoLecture', { videoId: item.id })}
        >
          <MaterialIcons name="edit" size={16} color="#16423C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMaterialItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.materialIcon}>
          <MaterialIcons name={item.fileUrl ? "attach-file" : "description"} size={40} color="#666666" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title || 'Untitled Material'}</Text>
          <Text style={styles.itemDescription}>{item.description || 'No description'}</Text>
          <Text style={styles.itemType}>
            {item.fileUrl ? item.fileUrl.split('.').pop()?.toUpperCase() || 'FILE' : 'TEXT'} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (navigation as any).navigate('UpdateStudyMaterial', { materialId: item.id })}
          >
            <MaterialIcons name="edit" size={16} color="#16423C" />
          </TouchableOpacity>
          {item.fileUrl && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                console.log('Download file:', item.fileUrl);
              }}
            >
              <MaterialIcons name="download" size={16} color="#16423C" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const videos = videoLectures || [];
  const materials = studyMaterials || [];

  const renderVideosContent = () => {
    if (loading.fetchVideos) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      );
    }
    if (videos.length > 0) {
      return (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="play-circle-outline" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No videos added yet</Text>
        <Text style={styles.emptySubtext}>Add your first video lecture</Text>
      </View>
    );
  };

  const renderMaterialsContent = () => {
    if (loading.fetchStudyMaterials) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading materials...</Text>
        </View>
      );
    }
    if (materials.length > 0) {
      return (
        <FlatList
          data={materials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="description" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No materials added yet</Text>
        <Text style={styles.emptySubtext}>Add your first study material</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>{unit.name}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.unitInfo}>
          {unit.imgUrl && (
            <Image source={{ uri: unit.imgUrl }} style={styles.unitImage} />
          )}
          <Text style={styles.unitDescription}>{unit.description}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <MaterialIcons name="play-circle-outline" size={20} color={activeTab === 'videos' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
              Videos ({videos.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'materials' && styles.activeTab]}
            onPress={() => setActiveTab('materials')}
          >
            <MaterialIcons name="description" size={20} color={activeTab === 'materials' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'materials' && styles.activeTabText]}>
              Materials ({materials.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {activeTab === 'videos' ? 'Video Lectures' : 'Study Materials'}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={activeTab === 'videos' ? handleAddVideo : handleAddMaterial}
            >
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>
                Add {activeTab === 'videos' ? 'Video' : 'Material'}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'videos' ? renderVideosContent() : renderMaterialsContent()}
        </View>
      </View>
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
  content: {
    flex: 1,
  },
  unitInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  unitImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  unitDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#16423C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
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
  itemCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemContent: {
    flexDirection: 'row',
    gap: 12,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 60,
    borderRadius: 6,
  },
  materialIcon: {
    width: 80,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemDuration: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '600',
  },
  itemType: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  editItemButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  downloadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default UnitDetailsPage;