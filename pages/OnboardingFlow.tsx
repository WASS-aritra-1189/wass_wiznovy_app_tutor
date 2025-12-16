import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import Button from '../components/Button';
import ValidationPopup from '../components/ValidationPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { getCountries, getCities, getQualifications, uploadDocument, uploadProfileImage } from '../services/onboardingService';
import { useNavigationContext } from '../navigation/NavigationContext';
import { getToken } from '../services/storage';

import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';

const OnboardingFlow: React.FC = () => {
  const { onAuthSuccess } = useNavigationContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [formData, setFormData] = useState({
    dateOfBirth: new Date(),
    gender: '',
    country: '',
    city: '',
    education: '',
    proficiency: '',
    bio: '',
    idDocument: null as string | null,
    profilePicture: null as string | null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState({
    gender: false,
    country: false,
    city: false,
    education: false,
    proficiency: false,
  });
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dobError, setDobError] = useState('');
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);


  const [qualifications, setQualifications] = useState<any[]>([]);

  React.useEffect(() => {
    fetchCountries();
    fetchQualifications();
  }, []);

  const fetchCountries = async () => {
    try {
      const result = await getCountries(50, 0);
      if (result.success && result.data) {
        setCountries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };



  const fetchCities = async (countryId: string) => {
    try {
      console.log('Fetching cities for countryId:', countryId);
      const result = await getCities(countryId, 20, 0);
      console.log('Cities API result:', result);
      if (result.success && result.data) {
        console.log('Setting cities:', result.data);
        setCities(result.data);
      } else {
        console.log('Cities API failed or no data:', result.message);
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    }
  };



  const fetchQualifications = async () => {
    try {
      console.log('Fetching qualifications...');
      if (typeof getQualifications !== 'function') {
        console.error('getQualifications function not found');
        return;
      }
      const result = await getQualifications(50, 0);
      console.log('Qualifications API result:', result);
      if (result.success && result.data) {
        const qualificationsData = result.data.result || result.data;
        console.log('Setting qualifications:', qualificationsData);
        setQualifications(qualificationsData);
      } else {
        console.log('Qualifications API failed:', result.message);
      }
    } catch (error) {
      console.error('Failed to fetch qualifications:', error);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Helper to handle profile image upload
  const handleProfileImageUpload = async () => {
    if (!formData.profilePicture) return;
    
    setLoading(true);
    try {
      const result = await uploadProfileImage(formData.profilePicture);
      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.error('Failed to upload profile image:', error);
      setErrorMessage(error?.message || 'Failed to upload profile image');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: {
        if (!formData.dateOfBirth) return false;
        const age = calculateAge(formData.dateOfBirth);
        return age >= 18;
      }
      case 2:
        return formData.gender !== '';
      case 3:
        return formData.country !== '' && formData.city !== '';
      case 4:
        return formData.education !== '' && formData.proficiency !== '';
      case 5:
        return formData.bio.trim().length >= 10;
      case 6:
        return formData.idDocument !== null;
      case 7:
        return formData.profilePicture !== null;
      default:
        return true;
    }
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (!formData.dateOfBirth) return;
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        setDobError('You must be at least 18 years old to continue');
        return;
      }
      setDobError('');
    }
    
    if (!isStepValid()) return;
    
    if (currentStep === 7 && formData.profilePicture) {
      await handleProfileImageUpload();
      return;
    }
    
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      setShowValidationPopup(true);
    } else {
      onAuthSuccess();
    }
  };

  const handleSkip = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowValidationPopup(true);
    }
  };

  const handleValidationConfirm = async () => {
    setShowValidationPopup(false);
    onAuthSuccess();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (field: string) => {
    setShowDropdowns(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const selectOption = (field: string, value: string) => {
    updateFormData(field, value);
    setShowDropdowns(prev => ({ ...prev, [field]: false }));
    
    // Fetch cities when country is selected
    if (field === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      console.log('Selected country:', selectedCountry);
      if (selectedCountry?.id) {
        console.log('Fetching cities for country ID:', selectedCountry.id);
        fetchCities(selectedCountry.id);
        // Clear city selection when country changes
        updateFormData('city', '');
      } else {
        console.log('No country ID found for:', value);
        setCities([]);
      }
    }
  };

  const getFieldIcon = (field: string) => {
    const iconMap: { [key: string]: any } = {
      gender: require('../assets/gender.png'),
      country: require('../assets/country.png'),
      education: require('../assets/english.png'),
      proficiency: require('../assets/english level.png')
    };
    return iconMap[field] || require('../assets/gender.png');
  };

  const getStepDescription = (step: number) => {
    const descriptions = {
      1: 'Please provide your date of birth to help us personalize your experience and ensure age-appropriate content.',
      2: 'Select your gender identity to help us customize recommendations and create a more personalized learning environment.',
      3: 'Tell us your location to provide localized content and connect you with tutors in your area.',
      4: 'Share your educational background and proficiency level to match you with appropriate learning opportunities.',
      5: 'Write a brief bio about yourself to help tutors and students get to know you better.',
      6: 'Upload a valid ID document for verification purposes to ensure a safe learning environment.',
      7: 'Upload a profile picture to personalize your account and help others recognize you in the learning community.'
    };
    return descriptions[step as keyof typeof descriptions] || '';
  };

  const getBackButtonText = (step: number) => {
    const backTexts = {
      1: 'Overview Details',
      2: 'Date of Birth',
      3: 'Gender',
      4: 'Location',
      5: 'Education',
      6: 'Bio',
      7: 'ID Document'
    };
    return backTexts[step as keyof typeof backTexts] || 'Back';
  };

  const renderDropdown = (field: string, options: string[], placeholder: string) => {
    const isOpen = showDropdowns[field as keyof typeof showDropdowns];
    const selectedValue = formData[field as keyof typeof formData] as string;
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => toggleDropdown(field)}
        >
          <Image source={getFieldIcon(field)} style={styles.dropdownIconImage} />
          <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
            {selectedValue || placeholder}
          </Text>
          <MaterialIcons 
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#999" 
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView 
              style={styles.dropdownScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`${field}-${option}-${index}`}
                  style={styles.dropdownItem}
                  onPress={() => selectOption(field, option)}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateFormData('dateOfBirth', selectedDate);
      const age = calculateAge(selectedDate);
      if (age < 18) {
        setDobError('You must be at least 18 years old to continue');
      } else {
        setDobError('');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      console.log('Selected document file:', fileUri);
      updateFormData('idDocument', fileUri);
      
      // Upload document immediately with proper error handling
      try {
        console.log('Starting document upload...');
        const token = await getToken();
        console.log('Token available for upload:', token ? 'Yes' : 'No');
        
        if (!token) {
          console.error('No token available for document upload');
          setErrorMessage('Authentication required. Please try again.');
          setShowErrorPopup(true);
          return;
        }
        
        const uploadResult = await uploadDocument(fileUri);
        console.log('Document upload result:', uploadResult);
        
        if (uploadResult.success) {
          console.log('Document uploaded successfully');
        } else {
          console.error('Document upload failed:', uploadResult.message);
          setErrorMessage(uploadResult.message || 'Failed to upload document');
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error('Document upload error:', error);
        setErrorMessage('Failed to upload document. Please try again.');
        setShowErrorPopup(true);
      }
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      console.log('Selected profile image file:', fileUri);
      updateFormData('profilePicture', fileUri);
      
      // Upload profile image immediately with proper error handling
      try {
        console.log('Starting profile image upload...');
        const token = await getToken();
        console.log('Token available for upload:', token ? 'Yes' : 'No');
        
        if (!token) {
          console.error('No token available for profile image upload');
          setErrorMessage('Authentication required. Please try again.');
          setShowErrorPopup(true);
          return;
        }
        
        const uploadResult = await uploadProfileImage(fileUri);
        console.log('Profile image upload result:', uploadResult);
        
        if (uploadResult.success) {
          console.log('Profile image uploaded successfully');
        } else {
          console.error('Profile image upload failed:', uploadResult.message);
          setErrorMessage(uploadResult.message || 'Failed to upload profile image');
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error('Profile image upload error:', error);
        setErrorMessage('Failed to upload profile image. Please try again.');
        setShowErrorPopup(true);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(1)}</Text>
            <Text style={styles.fieldLabel}>Enter your date of birth</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Image source={require('../assets/calendar.png')} style={styles.dateIconImage} />
              <Text style={styles.dateText}>{formatDate(formData.dateOfBirth)}</Text>
            </TouchableOpacity>
            {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(2)}</Text>
            <Text style={styles.fieldLabel}>Enter your gender</Text>
            {renderDropdown('gender', ['MALE', 'FEMALE', 'OTHER'], 'Select your gender')}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(3)}</Text>
            <Text style={styles.fieldLabel}>Select country</Text>
            {renderDropdown('country', countries.length > 0 ? countries.map(c => c.name) : ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Other'], 'Select your country')}
            <Text style={styles.fieldLabel}>Select city</Text>
            {renderDropdown('city', cities.length > 0 ? cities.map(c => c.name) : ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore'], 'Select your citY')}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(4)}</Text>
            <Text style={styles.fieldLabel}>Education level</Text>
            
            {renderDropdown('education', qualifications.length > 0 ? qualifications.map(q => q.name) : ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Certificate'], 'Select education level')}
            <Text style={styles.fieldLabel}>Proficiency in education</Text>
            {renderDropdown('proficiency', ['Beginner', 'Intermediate', 'Exparts', 'Pro_Master'], 'Select proficiency level')}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(5)}</Text>
            <Text style={styles.fieldLabel}>Write your bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
              placeholderTextColor="#999"
              value={formData.bio}
              onChangeText={(text) => updateFormData('bio', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{formData.bio.length} characters</Text>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(6)}</Text>
            <Text style={styles.fieldLabel}>Upload valid ID document</Text>
            <View style={styles.uploadOuterContainer}>
              <View style={styles.topRightBorderH} />
              <View style={styles.topRightBorderV} />
              <View style={styles.bottomLeftBorderH} />
              <View style={styles.bottomLeftBorderV} />
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickImage}
              >
                <MaterialIcons name="cloud-upload" size={40} color="#16423C" />
                <Text style={styles.uploadText}>Tap to upload ID document</Text>
                <TouchableOpacity 
                  style={styles.chooseFileButton}
                  onPress={pickImage}
                >
                  <MaterialIcons name="folder" size={20} color="#16423C" style={styles.fileIcon} />
                  <Text style={styles.chooseFileText}>Choose File</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            {formData.idDocument && (
              <View style={styles.uploadedFileContainer}>
                <MaterialIcons name="check-circle" size={20} color="#0AAD2D" />
                <Text style={styles.uploadedFileText}>ID document uploaded successfully</Text>
              </View>
            )}
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(7)}</Text>
            <Text style={styles.fieldLabel}>Upload profile picture</Text>
            <View style={styles.uploadOuterContainer}>
              <View style={styles.topRightBorderH} />
              <View style={styles.topRightBorderV} />
              <View style={styles.bottomLeftBorderH} />
              <View style={styles.bottomLeftBorderV} />
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickProfileImage}
              >
                <MaterialIcons name="cloud-upload" size={40} color="#16423C" />
                <Text style={styles.uploadText}>Tap to upload profile picture</Text>
                <TouchableOpacity 
                  style={styles.chooseFileButton}
                  onPress={pickProfileImage}
                >
                  <MaterialIcons name="folder" size={20} color="#16423C" style={styles.fileIcon} />
                  <Text style={styles.chooseFileText}>Choose File</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            {formData.profilePicture && (
              <View style={styles.profilePreviewContainer}>
                <View style={styles.profileOuterBorder}>
                  <View style={styles.profileImageContainer}>
                    <Image 
                      source={{ uri: formData.profilePicture }} 
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text style={styles.backText}>{getBackButtonText(currentStep)}</Text>
          </TouchableOpacity>
        )}
        {/* <Text style={styles.headerTitle}>Step {currentStep} of {currentStep === 10 ? '10' : '9'}</Text> */}
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.backText}>Skip</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#01004C" style={{marginLeft: -4}} />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(completedSteps.size / 7) * 100}%` }]} />
        <Text style={styles.progressText}>
          {Math.round((completedSteps.size / 7) * 100)}%
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStep()}
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={(() => {
              if (loading) return "Uploading...";
              if (currentStep === 7) return "Complete";
              return "Continue";
            })()}
            onPress={handleContinue}
            variant="primary"
            style={StyleSheet.flatten([styles.continueButton, (!isStepValid() || loading) && styles.disabledButton])}
            disabled={!isStepValid() || loading}
          />
        </View>
      </ScrollView>
      
      <ValidationPopup
        visible={showValidationPopup}
        onConfirm={handleValidationConfirm}
        loading={loading}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Profile picture uploaded successfully!"
        onClose={() => {
          setShowSuccessPopup(false);
          setShowValidationPopup(true);
        }}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
      </SafeAreaView>
    </SafeAreaWrapper>
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
    paddingTop: 40,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 0,
  },
  skipText: {
    fontSize: 16,
    color: '#01004C',
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E5E5',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 2,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16423C',
    borderRadius: 2,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
    minHeight: 300,
  },
  stepDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 40,
    lineHeight: 24,
  },
  fieldLabel: {
    fontSize: 18,
    color: '#01004C',
    textAlign: 'left',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  uploadOuterContainer: {
    position: 'relative',
    padding: 15,
  },
  topRightBorderH: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  topRightBorderV: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  bottomLeftBorderH: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#D0D0D0',
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  bottomLeftBorderV: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#D0D0D0',
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  uploadButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  uploadText: {
    fontSize: 16,
    color: '#16423C',
    fontWeight: '500',
  },
  chooseFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#16423C',
  },
  fileIcon: {
    marginRight: 8,
  },
  chooseFileText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '500',
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.3,
  },
  dateIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.3,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  profilePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profileOuterBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },

  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: -4,
  },

  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  bioInput: {
    height: 400,
    paddingTop: 12,
  },

  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },

  uploadedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
  },

  uploadedFileText: {
    fontSize: 14,
    color: '#0AAD2D',
    marginLeft: 8,
    fontWeight: '500',
  },

});

export default OnboardingFlow;