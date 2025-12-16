import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { RootState, AppDispatch } from '../store/store';
import { createVideoLecture } from '../store/courseSlice';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';

const CreateVideoLecturePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { unitId } = route.params as { unitId: string };
  
  const { loading } = useSelector((state: RootState) => state.course);

  const handleVideoUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        // Check file size (50MB limit)
        if (file.size && file.size > 50 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a video file smaller than 50MB.');
          return;
        }
        setSelectedVideo(file.uri);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      Alert.alert('Error', 'Failed to select video file');
    }
  };

  const handleThumbnailUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedThumbnail(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !duration.trim()) {
      setErrorMessage('Please fill in all required fields');
      setShowErrorPopup(true);
      return;
    }

    if (!selectedVideo) {
      setErrorMessage('Please select a video file');
      setShowErrorPopup(true);
      return;
    }

    try {
      const videoData: any = {
        title: title.trim(),
        description: description.trim(),
        unitId,
        duration: Number.parseInt(duration),
      };

      if (selectedVideo) {
        videoData.video = {
          uri: selectedVideo,
          type: 'video/mp4',
          name: `video_${Date.now()}.mp4`,
        };
      }

      if (selectedThumbnail) {
        videoData.thumbnail = {
          uri: selectedThumbnail,
          type: 'image/jpeg',
          name: `thumbnail_${Date.now()}.jpg`,
        };
      }

      await dispatch(createVideoLecture(videoData)).unwrap();

      setSuccessMessage('Video lecture created successfully!');
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setErrorMessage(error as string);
      setShowErrorPopup(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Add Video Lecture</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.fieldLabel}>Video Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter video title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Enter video description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>Duration (minutes) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter duration in minutes"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <Text style={styles.fieldLabel}>Video File *</Text>
          <TouchableOpacity style={styles.fileUpload} onPress={handleVideoUpload}>
            {selectedVideo ? (
              <View style={styles.selectedFileContainer}>
                <MaterialIcons name="video-library" size={40} color="#16423C" />
                <Text style={styles.selectedFileText}>Video Selected</Text>
              </View>
            ) : (
              <>
                <MaterialIcons name="video-library" size={60} color="#666666" />
                <Text style={styles.uploadText}>Select Video File</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Thumbnail (Optional)</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={handleThumbnailUpload}>
            {selectedThumbnail ? (
              <Image source={{ uri: selectedThumbnail }} style={styles.selectedImage} />
            ) : (
              <>
                <Image 
                  source={require('../assets/uploadthumbnail.png')} 
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>Upload Thumbnail</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitButton, loading.createVideoLecture && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading.createVideoLecture}
          >
            <Text style={styles.submitButtonText}>
              {loading.createVideoLecture ? 'Creating...' : 'Create Video'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <SuccessPopup
        visible={showSuccessPopup}
        message={successMessage}
        onClose={() => setShowSuccessPopup(false)}
      />

      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  headerPlaceholder: {
    width: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    height: 100,
  },
  fileUpload: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 40,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    minHeight: 120,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 40,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    minHeight: 120,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  selectedFileContainer: {
    alignItems: 'center',
  },
  selectedFileText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '600',
    marginTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#16423C',
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  submitButtonDisabled: {
    backgroundColor: '#999999',
    opacity: 0.7,
  },
});

export default CreateVideoLecturePage;