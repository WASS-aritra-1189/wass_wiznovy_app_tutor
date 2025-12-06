import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface UploadVideoPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const UploadVideoPage: React.FC<UploadVideoPageProps> = ({ navigation, route, onBack }) => {
  const unitData = route?.params?.unit || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  const handleSubmit = () => {
    const videoData = {
      title,
      description,
      duration,
      video: selectedVideo,
      thumbnail: selectedThumbnail,
      unitId: unitData.id
    };
    console.log('New video uploaded:', videoData);
    navigation?.goBack();
  };

  const handleVideoUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedVideo(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
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
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedThumbnail(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Upload Video</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
        <Text style={styles.fieldLabel}>Video Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter video title"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter video description..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <Text style={styles.fieldLabel}>Duration</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 15:30"
          value={duration}
          onChangeText={setDuration}
        />
        
        <Text style={styles.fieldLabel}>Upload Video</Text>
        <TouchableOpacity style={styles.fileUpload} onPress={handleVideoUpload}>
          {selectedVideo ? (
            <>
              <MaterialIcons name="video-call" size={40} color="#16423C" />
              <Text style={styles.uploadText}>{selectedVideo.name}</Text>
              <Text style={styles.fileInfo}>
                {selectedVideo.size ? `${(selectedVideo.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </Text>
            </>
          ) : (
            <Image source={require('../assets/videoupload.png')} style={styles.placeholderImage} />
          )}
        </TouchableOpacity>
        
        <Text style={styles.fieldLabel}>Video Thumbnail</Text>
        <TouchableOpacity style={styles.thumbnailUpload} onPress={handleThumbnailUpload}>
          {selectedThumbnail ? (
            <Image source={{ uri: selectedThumbnail }} style={styles.selectedImage} />
          ) : (
            <Image source={require('../assets/uploadthumbnail.png')} style={styles.placeholderImage} />
          )}
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Upload Video</Text>
        </TouchableOpacity>
      </View>
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
  thumbnailUpload: {
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
  uploadText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  fileInfo: {
    fontSize: 12,
    color: '#16423C',
    marginTop: 4,
  },
  selectedImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 60,
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
  formContent: {
    paddingBottom: 40,
  },
});

export default UploadVideoPage;