import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { studyMaterialService, CreateStudyMaterialData } from '../services/studyMaterialService';
import { fetchStudyMaterialsByUnit } from '../store/courseSlice';

interface CreateStudyMaterialPageProps {
  navigation?: any;
  route?: any;
}

const CreateStudyMaterialPage: React.FC<CreateStudyMaterialPageProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { unitId } = route.params as { unitId: string };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    console.log('📝 CreateStudyMaterialPage: Starting form submission');
    console.log('📝 CreateStudyMaterialPage: Form data:', { title, description, unitId, hasFile: !!selectedFile });
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the study material');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for the study material');
      return;
    }
    
    if (!unitId) {
      Alert.alert('Error', 'Unit ID is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const materialData: CreateStudyMaterialData = {
        title: title.trim(),
        description: description.trim(),
        unitId: unitId,
        videoLectureId: null, // No video lecture for unit materials
      };
      
      if (selectedFile) {
        materialData.file = {
          uri: selectedFile.uri,
          type: selectedFile.mimeType || 'application/octet-stream',
          name: selectedFile.name,
        };
      }
      
      console.log('📤 CreateStudyMaterialPage: Sending material data:', materialData);
      
      const result = await studyMaterialService.createStudyMaterial(materialData);
      
      if (result.success) {
        console.log('✅ CreateStudyMaterialPage: Study material created successfully');
        // Refresh the study materials list
        dispatch(fetchStudyMaterialsByUnit(unitId));
        Alert.alert(
          'Success',
          'Study material created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ CreateStudyMaterialPage: Failed to create study material:', result.message);
        Alert.alert('Error', result.message || 'Failed to create study material');
      }
    } catch (error) {
      console.error('❌ CreateStudyMaterialPage: Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    console.log('📁 CreateStudyMaterialPage: Opening document picker');
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'image/*'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('📄 CreateStudyMaterialPage: File selected:', {
          name: file.name,
          size: file.size,
          type: file.mimeType
        });
        setSelectedFile(file);
      } else {
        console.log('📄 CreateStudyMaterialPage: File selection cancelled');
      }
    } catch (error) {
      console.error('❌ CreateStudyMaterialPage: Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Create Study Material</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
        <Text style={styles.fieldLabel}>Material Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter material title"
          value={title}
          onChangeText={setTitle}
          editable={!isLoading}
        />
        
        <Text style={styles.fieldLabel}>Description *</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter material description..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!isLoading}
        />
        
        <Text style={styles.fieldLabel}>Upload File (Optional)</Text>
        <TouchableOpacity 
          style={styles.fileUpload} 
          onPress={handleFileUpload}
          disabled={isLoading}
        >
          {selectedFile ? (
            <>
              <MaterialIcons name="upload-file" size={40} color="#16423C" />
              <Text style={styles.uploadText}>{selectedFile.name}</Text>
              <Text style={styles.fileInfo}>
                {selectedFile.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </Text>
            </>
          ) : (
            <>
              <Image source={require('../assets/uploadthumbnail.png')} style={styles.placeholderImage} />
              <Text style={styles.uploadHint}>Tap to select a file</Text>
            </>
          )}
        </TouchableOpacity>
        
        {selectedFile && (
          <TouchableOpacity 
            style={styles.removeFileButton} 
            onPress={() => setSelectedFile(null)}
            disabled={isLoading}
          >
            <MaterialIcons name="close" size={16} color="#FF6B6B" />
            <Text style={styles.removeFileText}>Remove file</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleBack}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Material</Text>
          )}
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
  uploadText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  fileInfo: {
    fontSize: 12,
    color: '#16423C',
    marginTop: 4,
  },
  removeFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 10,
  },
  removeFileText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 4,
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
  placeholderImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CreateStudyMaterialPage;