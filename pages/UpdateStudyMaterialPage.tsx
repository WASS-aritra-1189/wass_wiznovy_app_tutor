import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  Alert, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { studyMaterialService, UpdateStudyMaterialData } from '../services/studyMaterialService';

const UpdateStudyMaterialPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { materialId } = route.params as { materialId: string };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadMaterialData();
  }, [materialId]);

  const loadMaterialData = async () => {
    try {
      const result = await studyMaterialService.getStudyMaterialById(materialId);
      if (result.success) {
        setTitle(result.data.title || '');
        setDescription(result.data.description || '');
        setCurrentFileUrl(result.data.fileUrl);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Failed to load material data:', error);
      Alert.alert('Error', 'Failed to load material data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updateData: UpdateStudyMaterialData = {
        title: title.trim(),
        description: description.trim(),
      };
      
      if (selectedFile) {
        updateData.file = {
          uri: selectedFile.uri,
          type: selectedFile.mimeType || 'application/octet-stream',
          name: selectedFile.name,
        };
      }
      
      const result = await studyMaterialService.updateStudyMaterial(materialId, updateData);
      
      if (result.success) {
        Alert.alert('Success', 'Study material updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Failed to update study material:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Failed to pick document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading material...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Update Study Material</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.formContainer}>
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
        
        <Text style={styles.fieldLabel}>File</Text>
        {currentFileUrl && !selectedFile && (
          <View style={styles.currentFileContainer}>
            <MaterialIcons name="attach-file" size={20} color="#16423C" />
            <Text style={styles.currentFileText}>Current file attached</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.fileUpload} onPress={handleFileUpload} disabled={isLoading}>
          {selectedFile ? (
            <>
              <MaterialIcons name="upload-file" size={40} color="#16423C" />
              <Text style={styles.uploadText}>{selectedFile.name}</Text>
            </>
          ) : (
            <>
              <Image source={require('../assets/uploadthumbnail.png')} style={styles.placeholderImage} />
              <Text style={styles.uploadHint}>Tap to {currentFileUrl ? 'replace' : 'select'} file</Text>
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
            <Text style={styles.removeFileText}>Remove new file</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]} 
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Update Material</Text>
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
  currentFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F8F0',
    borderRadius: 6,
    marginBottom: 10,
  },
  currentFileText: {
    marginLeft: 8,
    color: '#16423C',
    fontSize: 14,
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
  placeholderImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
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
});

export default UpdateStudyMaterialPage;