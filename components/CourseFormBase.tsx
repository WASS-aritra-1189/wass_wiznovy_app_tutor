import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchSubjects, fetchLanguages } from '../store/onboardingSlice';

interface CourseFormBaseProps {
  courseName: string;
  setCourseName: (value: string) => void;
  accessType: 'PAID' | 'FREE';
  setAccessType: (value: 'PAID' | 'FREE') => void;
  duration: string;
  setDuration: (value: string) => void;
  totalLectures: string;
  setTotalLectures: (value: string) => void;
  validityDays: string;
  setValidityDays: (value: string) => void;
  startDate: string;
  setShowStartDatePicker: (value: boolean) => void;
  endDate: string;
  setShowEndDatePicker: (value: boolean) => void;
  price: string;
  setPrice: (value: string) => void;
  discountedPrice: string;
  setDiscountedPrice: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  authorMessage: string;
  setAuthorMessage: (value: string) => void;
}

const CourseFormBase: React.FC<CourseFormBaseProps> = ({
  courseName, setCourseName, accessType, setAccessType, duration, setDuration,
  totalLectures, setTotalLectures, validityDays, setValidityDays,
  startDate, setShowStartDatePicker, endDate, setShowEndDatePicker,
  price, setPrice, discountedPrice, setDiscountedPrice,
  description, setDescription, authorMessage, setAuthorMessage
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subjects, languages } = useSelector((state: RootState) => state.onboarding);
  
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('');

  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchLanguages());
  }, [dispatch]);

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
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.fieldLabel}>Course Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Course Name"
        value={courseName}
        onChangeText={setCourseName}
      />
      
      <Text style={styles.fieldLabel}>Access Type</Text>
      <View style={styles.accessTypeContainer}>
        <TouchableOpacity 
          style={[styles.accessTypeButton, accessType === 'PAID' && styles.accessTypeButtonActive]}
          onPress={() => setAccessType('PAID')}
        >
          <Text style={[styles.accessTypeText, accessType === 'PAID' && styles.accessTypeTextActive]}>PAID</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.accessTypeButton, accessType === 'FREE' && styles.accessTypeButtonActive]}
          onPress={() => setAccessType('FREE')}
        >
          <Text style={[styles.accessTypeText, accessType === 'FREE' && styles.accessTypeTextActive]}>FREE</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.fieldLabel}>Subject</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
        >
          <Text style={[styles.dropdownText, !subject && styles.placeholderText]}>
            {subject || 'Select Subject'}
          </Text>
        </TouchableOpacity>
        {showSubjectDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
              {subjects.map((subjectItem, index) => (
                <TouchableOpacity
                  key={`subject-${subjectItem.id || index}`}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSubject(subjectItem.name);

                    setShowSubjectDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{subjectItem.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      
      <Text style={styles.fieldLabel}>Language</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
        >
          <Text style={[styles.dropdownText, !language && styles.placeholderText]}>
            {language || 'Select Language'}
          </Text>
        </TouchableOpacity>
        {showLanguageDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
              {languages.map((languageItem, index) => (
                <TouchableOpacity
                  key={`language-${languageItem.id || index}`}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setLanguage(languageItem.name);

                    setShowLanguageDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{languageItem.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      
      <Text style={styles.fieldLabel}>Total Duration *</Text>
      <TextInput
        style={styles.input}
        placeholder="Duration (hours)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      
      <Text style={styles.fieldLabel}>Total Lectures</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of lectures"
        value={totalLectures}
        onChangeText={setTotalLectures}
        keyboardType="numeric"
      />
      
      <Text style={styles.fieldLabel}>Validity Days</Text>
      <TextInput
        style={styles.input}
        placeholder="Course validity in days (default: 365)"
        value={validityDays}
        onChangeText={setValidityDays}
        keyboardType="numeric"
      />
      
      <Text style={styles.fieldLabel}>Start Date *</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
        <Text style={startDate ? styles.dateText : styles.placeholderText}>
          {startDate || 'Select Start Date'}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color="#666666" />
      </TouchableOpacity>
      
      <Text style={styles.fieldLabel}>End Date *</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
        <Text style={endDate ? styles.dateText : styles.placeholderText}>
          {endDate || 'Select End Date'}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color="#666666" />
      </TouchableOpacity>
      
      <Text style={styles.fieldLabel}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="Price (e.g., 599.00)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      
      <Text style={styles.fieldLabel}>Discounted Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Discounted Price (e.g., 399.00)"
        value={discountedPrice}
        onChangeText={setDiscountedPrice}
        keyboardType="numeric"
      />
      
      <Text style={styles.fieldLabel}>Course Description *</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Enter course description..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      <Text style={styles.fieldLabel}>Author Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Welcome message for students"
        value={authorMessage}
        onChangeText={setAuthorMessage}
      />
      
      <Text style={styles.fieldLabel}>Thumbnail</Text>
      <TouchableOpacity style={styles.thumbnailUpload} onPress={handleThumbnailUpload}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <>
            <Image 
              source={require('../assets/uploadthumbnail.png')} 
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Thumbnail should be 1280 X 720</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
    marginBottom: 8,
    marginTop: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
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
  accessTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  accessTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  accessTypeButtonActive: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  accessTypeText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  accessTypeTextActive: {
    color: '#FFFFFF',
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
  bottomSpacer: {
    height: 100,
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: -8,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
});

export default CourseFormBase;