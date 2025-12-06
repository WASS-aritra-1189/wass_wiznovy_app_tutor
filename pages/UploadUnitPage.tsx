import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface UploadUnitPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const UploadUnitPage: React.FC<UploadUnitPageProps> = ({ navigation, route, onBack }) => {
  const courseName = route?.params?.courseName || 'Course';
  const [unitName, setUnitName] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [totalVideos, setTotalVideos] = useState('');
  const [totalMaterials, setTotalMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = () => {
    const unitData = {
      unitName,
      subject,
      duration,
      totalVideos: parseInt(totalVideos) || 0,
      totalMaterials: parseInt(totalMaterials) || 0,
      description,
      courseName
    };
    console.log('New unit created:', unitData);
    navigation?.goBack();
  };

  const handleImageUpload = async () => {
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
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Upload New Unit</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
        <Text style={styles.fieldLabel}>Unit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter unit name"
          value={unitName}
          onChangeText={setUnitName}
        />
        
        <Text style={styles.fieldLabel}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
        />
        
        <Text style={styles.fieldLabel}>Duration</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2.5 hours"
          value={duration}
          onChangeText={setDuration}
        />
        
        <Text style={styles.fieldLabel}>Total Videos</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of video lectures"
          value={totalVideos}
          onChangeText={setTotalVideos}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Total Study Materials</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of study materials"
          value={totalMaterials}
          onChangeText={setTotalMaterials}
          keyboardType="numeric"
        />
        
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter unit description..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <Text style={styles.fieldLabel}>Unit Image</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <>
              <Image 
                source={require('../assets/uploadthumbnail.png')} 
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Upload Unit Image</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Upload Unit</Text>
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
  selectedImage: {
    width: '100%',
    height: 180,
    borderRadius: 6,
  },
});

export default UploadUnitPage;