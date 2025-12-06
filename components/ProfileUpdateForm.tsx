import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import AlertComponent from './AlertComponent';
import TimePickerModal from './TimePickerModal';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';
import { RootState, AppDispatch } from '../store/store';
import { uploadImage, updateProfile, fetchProfile } from '../store/profileSlice';
import { saveAvailability } from '../store/availabilitySlice';
import { fetchSubjects, fetchCountries, fetchCities, fetchLanguages, fetchMyAvailability, clearCities } from '../store/onboardingSlice';
import { updateAvailability } from '../services/availabilityService';

interface TimeSlot {
  from: string;
  to: string;
  from24?: string;
  to24?: string;
}

interface ProfileUpdateFormProps {
  onUpdate?: React.RefObject<(() => void) | null>;
  onBackToProfile?: () => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ onUpdate, onBackToProfile }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [feesPerHour, setFeesPerHour] = useState('');
  const [language, setLanguage] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [document, setDocument] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayTimeSlots, setDayTimeSlots] = useState<{[key: string]: TimeSlot[]}>({});
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempFromHour, setTempFromHour] = useState('');
  const [tempFromMinute, setTempFromMinute] = useState('');
  const [tempToHour, setTempToHour] = useState('');
  const [tempToMinute, setTempToMinute] = useState('');
  const [tempFromAmPm, setTempFromAmPm] = useState('AM');
  const [tempToAmPm, setTempToAmPm] = useState('AM');
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedDayAvailability, setSelectedDayAvailability] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showEditAvailabilityModal, setShowEditAvailabilityModal] = useState(false);
  const [editingAvailabilityDay, setEditingAvailabilityDay] = useState<string>('');
  const [editingAvailabilityId, setEditingAvailabilityId] = useState<string | null>(null);
  
  const { subjects, countries, cities, languages, savedAvailability } = useSelector((state: RootState) => state.onboarding);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchCountries());
    dispatch(fetchLanguages());
    dispatch(fetchMyAvailability());
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (countryId) {
      dispatch(fetchCities(countryId));
    } else {
      dispatch(clearCities());
    }
  }, [countryId, dispatch]);

  const setLocationData = (city: any, country: any) => {
    if (city) {
      setCity(city.name || '');
      setCityId(city.id || '');
    } else {
      setCity('');
      setCityId('');
    }
    
    if (country) {
      setCountry(country.name || '');
      setCountryId(country.id || '');
    } else {
      setCountry('');
      setCountryId('');
    }
  };

  const setSubjectData = (subject: any) => {
    if (subject) {
      setSubject(subject.name || '');
      setSubjectId(subject.id || '');
    } else {
      setSubject('');
      setSubjectId('');
    }
  };

  const setLanguageData = (language: any) => {
    if (language) {
      if (typeof language === 'object') {
        setLanguage(language.name || '');
        setLanguageId(language.id || '');
      } else {
        setLanguage(language);
        setLanguageId('');
      }
    } else {
      setLanguage('');
      setLanguageId('');
    }
  };

  useEffect(() => {
    if (!profile) return;
    
    setName(profile.tutorDetail?.name || '');
    setEmail(profile.email || '');
    setLocationData(profile.tutorDetail?.city, profile.tutorDetail?.country);
    setSubjectData(profile.tutorDetail?.subject);
    setFeesPerHour(profile.tutorDetail?.hourlyRate || '');
    setLanguageData(profile.tutorDetail?.language);
    setAboutMe(profile.tutorDetail?.bio || '');
    setProfileImageUri(profile.tutorDetail?.profileImage || null);
  }, [profile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setProfileImageUri(selectedImageUri);
      try {
        const result = await dispatch(uploadImage({
          file: {
            uri: selectedImageUri,
            type: 'image/jpeg',
            name: 'profile.jpg'
          }
        }));
        
        if (result.type.endsWith('/fulfilled')) {
          await dispatch(fetchProfile());
          setSuccessMessage('Profile image updated successfully!');
          setShowSuccessPopup(true);
          setTimeout(() => setShowSuccessPopup(false), 2000);
        } else {
          setErrorMessage('Failed to upload image');
          setShowErrorPopup(true);
          setTimeout(() => setShowErrorPopup(false), 3000);
        }
      } catch (error) {
        setErrorMessage('Failed to upload image. Please try again.');
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    }
  };

  const showDayAvailability = async (day: string) => {
    setLoadingAvailability(true);
    setShowAvailabilityModal(true);
    
    try {
      // Refresh availability data first
      await dispatch(fetchMyAvailability());
      
      const dayMapping: { [key: string]: string } = {
        'Mon': 'MONDAY',
        'Tue': 'TUESDAY', 
        'Wed': 'WEDNESDAY',
        'Thu': 'THURSDAY',
        'Fri': 'FRIDAY',
        'Sat': 'SATURDAY',
        'Sun': 'SUNDAY'
      };
      
      const dayOfWeek = dayMapping[day];
      const dayAvailability = savedAvailability.filter(item => item.dayOfWeek === dayOfWeek);
      setSelectedDayAvailability(dayAvailability);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const showEditAvailability = async (day: string) => {
    const fetchResult = await dispatch(fetchMyAvailability());
    
    const dayMapping: { [key: string]: string } = {
      'Mon': 'MONDAY',
      'Tue': 'TUESDAY', 
      'Wed': 'WEDNESDAY',
      'Thu': 'THURSDAY',
      'Fri': 'FRIDAY',
      'Sat': 'SATURDAY',
      'Sun': 'SUNDAY'
    };
    
    const dayOfWeek = dayMapping[day];
    const availabilityData = fetchResult.payload || savedAvailability;
    const dayAvailability = availabilityData.filter((item: any) => item.dayOfWeek === dayOfWeek);
    
    if (dayAvailability.length > 0) {
      const firstAvailability = dayAvailability[0];
      const [fromHour24, fromMinute] = firstAvailability.startTime.split(':');
      const [toHour24, toMinute] = firstAvailability.endTime.split(':');
      
      const fromHour12 = convertTo12Hour(Number.parseInt(fromHour24));
      const toHour12 = convertTo12Hour(Number.parseInt(toHour24));
      
      const fromAmPm = Number.parseInt(fromHour24) >= 12 ? 'PM' : 'AM';
      const toAmPm = Number.parseInt(toHour24) >= 12 ? 'PM' : 'AM';
      
      setTempFromHour(fromHour12.toString());
      setTempFromMinute(fromMinute);
      setTempToHour(toHour12.toString());
      setTempToMinute(toMinute);
      setTempFromAmPm(fromAmPm);
      setTempToAmPm(toAmPm);
      setEditingSlotIndex(0);
      setEditingAvailabilityId(firstAvailability.id);
    } else {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const hour12 = convertTo12Hour(currentHour);
      const amPm = currentHour >= 12 ? 'PM' : 'AM';
      
      setTempFromHour(hour12.toString());
      setTempFromMinute(currentMinute.toString().padStart(2, '0'));
      setTempToHour(hour12.toString());
      setTempToMinute(currentMinute.toString().padStart(2, '0'));
      setTempFromAmPm(amPm);
      setTempToAmPm(amPm);
      setEditingSlotIndex(null);
      setEditingAvailabilityId(null);
    }
    
    setSelectedDay(day);
    setShowTimeModal(true);
  };

  const convertTo12Hour = (hour24: number) => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  };

  const handleDayPress = (day: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const hour12 = convertTo12Hour(currentHour);
    const amPm = currentHour >= 12 ? 'PM' : 'AM';
    
    setSelectedDay(day);
    setTempFromHour(hour12.toString());
    setTempFromMinute(currentMinute.toString().padStart(2, '0'));
    setTempToHour(hour12.toString());
    setTempToMinute(currentMinute.toString().padStart(2, '0'));
    setTempFromAmPm(amPm);
    setTempToAmPm(amPm);
    setEditingSlotIndex(null);
    setShowTimeModal(true);
  };

  const handleEditSlot = (day: string, slotIndex: number) => {
    const slot = dayTimeSlots[day][slotIndex];
    const [fromHour24, fromMinute] = slot.from.split(':');
    const [toHour24, toMinute] = slot.to.split(':');
    
    const fromHour12 = convertTo12Hour(Number.parseInt(fromHour24));
    const toHour12 = convertTo12Hour(Number.parseInt(toHour24));
    
    const fromAmPm = Number.parseInt(fromHour24) >= 12 ? 'PM' : 'AM';
    const toAmPm = Number.parseInt(toHour24) >= 12 ? 'PM' : 'AM';
    
    setSelectedDay(day);
    setTempFromHour(fromHour12.toString());
    setTempFromMinute(fromMinute);
    setTempToHour(toHour12.toString());
    setTempToMinute(toMinute);
    setTempFromAmPm(fromAmPm);
    setTempToAmPm(toAmPm);
    setEditingSlotIndex(slotIndex);
    setShowTimeModal(true);
  };

  const convertTo24Hour = (time: string, amPm: string) => {
    const formattedTime = /^\d{1,2}$/.test(time) ? time + ':00' : time;
    const [hours, minutes] = formattedTime.split(':');
    let hour24 = Number.parseInt(hours);
    
    if (amPm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (amPm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  const displayAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetTimeModal = () => {
    setShowTimeModal(false);
    setSelectedDay(null);
    setTempFromHour('');
    setTempFromMinute('');
    setTempToHour('');
    setTempToMinute('');
    setTempFromAmPm('AM');
    setTempToAmPm('AM');
    setEditingSlotIndex(null);
    setEditingAvailabilityId(null);
  };

  const updateLocalTimeSlots = (selectedDay: string, newSlot: TimeSlot) => {
    setDayTimeSlots(prev => {
      const currentSlots = prev[selectedDay] || [];
      if (editingSlotIndex !== null) {
        const updatedSlots = [...currentSlots];
        updatedSlots[editingSlotIndex] = newSlot;
        return { ...prev, [selectedDay]: updatedSlots };
      }
      return { ...prev, [selectedDay]: [...currentSlots, newSlot] };
    });
  };

  const saveTimeSlot = async () => {
    if (!selectedDay || !tempFromHour || !tempToHour) {
      resetTimeModal();
      return;
    }

    const fromMinute = tempFromMinute || '00';
    const toMinute = tempToMinute || '00';
    const fromTime = `${tempFromHour}:${fromMinute.padStart(2, '0')}`;
    const toTime = `${tempToHour}:${toMinute.padStart(2, '0')}`;
    const from24 = convertTo24Hour(fromTime, tempFromAmPm);
    const to24 = convertTo24Hour(toTime, tempToAmPm);

    if (from24 === to24) {
      displayAlert('From and To times cannot be the same');
      return;
    }

    const dayMapping: { [key: string]: string } = {
      'Mon': 'MONDAY', 'Tue': 'TUESDAY', 'Wed': 'WEDNESDAY',
      'Thu': 'THURSDAY', 'Fri': 'FRIDAY', 'Sat': 'SATURDAY', 'Sun': 'SUNDAY'
    };

    try {
      if (editingAvailabilityId) {
        // Update existing availability
        const result = await updateAvailability(editingAvailabilityId, {
          dayOfWeek: dayMapping[selectedDay],
          startTime: from24,
          endTime: to24
        });
        
        if (result.success) {
          displayAlert('Availability updated successfully!');
          await dispatch(fetchMyAvailability());
        } else {
          displayAlert('Failed to update availability');
        }
      } else {
        // Create new availability
        const result = await dispatch(saveAvailability({
          dayOfWeek: dayMapping[selectedDay],
          startTime: from24,
          endTime: to24
        }));

        if (result.type.endsWith('/fulfilled')) {
          displayAlert('Availability saved successfully!');
          updateLocalTimeSlots(selectedDay, { from: from24, to: to24, from24, to24 });
        } else {
          displayAlert('Failed to save availability');
        }
      }
    } catch (error) {
      console.error('Save availability error:', error);
      displayAlert('Failed to save availability. Please try again.');
    }

    resetTimeModal();
  };

  const removeTimeSlot = (day: string, index: number) => {
    setDayTimeSlots(prev => ({
      ...prev,
      [day]: prev[day]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleUpdate = async () => {
    if (loading.update) {
      return;
    }
    
    try {
      const updateData: any = {};
      
      const shouldIncludeField = (newValue: any, originalValue: any) => {
        return newValue !== undefined && 
               newValue !== null && 
               newValue !== '' && 
               newValue !== originalValue;
      };

      if (shouldIncludeField(name, profile?.tutorDetail?.name)) {
        updateData.name = name;
      }
      
      if (shouldIncludeField(cityId, profile?.tutorDetail?.city?.id?.toString())) {
        updateData.cityId = cityId;
      }
      
      if (shouldIncludeField(countryId, profile?.tutorDetail?.country?.id?.toString())) {
        updateData.countryId = countryId;
      }
      
      if (shouldIncludeField(subjectId, profile?.tutorDetail?.subject?.id?.toString())) {
        updateData.subjectId = subjectId;
      }
      
      if (shouldIncludeField(feesPerHour, profile?.tutorDetail?.hourlyRate)) {
        updateData.hourlyRate = feesPerHour;
      }
      
      if (shouldIncludeField(languageId, profile?.tutorDetail?.language?.id?.toString())) {
        updateData.languageId = languageId;
      }
      
      if (shouldIncludeField(aboutMe, profile?.tutorDetail?.bio)) {
        updateData.bio = aboutMe;
      }

      if (Object.keys(updateData).length === 0) {
        setErrorMessage('No changes detected');
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
        return;
      }

      const result = await dispatch(updateProfile(updateData));
      
      if (result.type.endsWith('/fulfilled')) {
        await dispatch(fetchProfile());
        
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          onBackToProfile?.();
        }, 1500);
      } else {
        const errorMsg = result.payload?.message || 'Failed to update profile';
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  // Expose handleUpdate to parent component
  useEffect(() => {
    if (onUpdate) {
      onUpdate.current = () => {
        handleUpdate();
      };
    }
  }, [
    onUpdate, 
    name, 
    cityId, 
    countryId, 
    subjectId, 
    feesPerHour, 
    languageId, 
    aboutMe,
    profile // Add profile to dependencies
  ]);

  return (
    <View style={styles.container}>
      {/* Section 1: Personal Info */}
      <View style={styles.section}>
        <View style={styles.imageContainer}>
          <Image 
            source={profileImageUri ? { uri: profileImageUri } : require('../assets/walkthrough2.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Image 
              source={require('../assets/camera.png')}
              style={styles.cameraIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
         <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name}
          onChangeText={(text) => {
            const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
            setName(filteredText);
          }}
        />
        <TextInput 
          style={[styles.input, styles.disabledInput]} 
          placeholder="Email" 
          value={email}
          editable={false}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Address" 
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowCountryDropdown(!showCountryDropdown)}
          >
            <Text style={[styles.dropdownText, !country && styles.placeholderText]}>
              {country || 'Select Country'}
            </Text>
          </TouchableOpacity>
          {showCountryDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {countries.map((countryItem, index) => (
                  <TouchableOpacity
                    key={`country-${countryItem.id || index}`}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCountry(countryItem.name);
                      setCountryId(countryItem.id);
                      setShowCountryDropdown(false);
                      setCity('');
                      setCityId('');
                      dispatch(clearCities());
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{countryItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowCityDropdown(!showCityDropdown)}
          >
            <Text style={[styles.dropdownText, !city && styles.placeholderText]}>
              {city || 'Select City'}
            </Text>
          </TouchableOpacity>
          {showCityDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {cities.map((cityItem, index) => (
                  <TouchableOpacity
                    key={`city-${cityItem.id || index}`}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCity(cityItem.name);
                      setCityId(cityItem.id);
                      setShowCityDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{cityItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="Pin Code" 
          value={pinCode}
          onChangeText={setPinCode}
        />
      </View>

      {/* Section 2: Subject Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose the Subject</Text>
        <View style={styles.row}>
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
                <ScrollView 
                  style={styles.dropdownScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {subjects.length > 0 ? subjects.map((subjectItem, index) => (
                    <TouchableOpacity
                      key={`subject-${subjectItem.id || index}`}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSubject(subjectItem.name);
                        setSubjectId(subjectItem.id);
                        setShowSubjectDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{subjectItem.name}</Text>
                    </TouchableOpacity>
                  )) : (
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownItemText}>Loading subjects...</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
          <TextInput 
            style={styles.halfInput} 
            placeholder="Fees per hour" 
            value={feesPerHour}
            onChangeText={setFeesPerHour}
          />
        </View>
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
                {languages.length > 0 ? languages.map((languageItem, index) => (
                  <TouchableOpacity
                    key={`language-${languageItem.id || index}`}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setLanguage(languageItem.name);
                      setLanguageId(languageItem.id);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{languageItem.name}</Text>
                  </TouchableOpacity>
                )) : (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>Loading languages...</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="Document" 
          value={document}
          onChangeText={setDocument}
        />
      </View>

      {/* Days Selection */}
      <View style={styles.daysSection}>
        <Text style={styles.sectionTitle}>Available Days</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daysContainer}
          contentContainerStyle={styles.daysContentContainer}
        >
          {days.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <TouchableOpacity 
                style={[
                  styles.dayCard,
                  dayTimeSlots[day]?.length > 0 && styles.selectedDayCard
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[
                  styles.dayText,
                  dayTimeSlots[day]?.length > 0 && styles.selectedDayText
                ]}>{day}</Text>
                {dayTimeSlots[day]?.length > 0 && (
                  <Text style={styles.slotCount}>
                    {dayTimeSlots[day].length} slot{dayTimeSlots[day].length > 1 ? 's' : ''}
                  </Text>
                )}
              </TouchableOpacity>
              
              {dayTimeSlots[day]?.map((slot, slotIndex) => (
                <View key={`${day}-${slot.from}-${slot.to}`} style={styles.timeSlotItem}>
                  <TouchableOpacity 
                    style={styles.timeSlotTextContainer}
                    onPress={() => handleEditSlot(day, slotIndex)}
                  >
                    <Text style={styles.timeSlotText}>
                      {slot.from}-{slot.to}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeTimeSlot(day, slotIndex)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.viewAvailabilityButton}
                onPress={() => showDayAvailability(day)}
              >
                <Text style={styles.viewAvailabilityText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editAvailabilityButton}
                onPress={() => showEditAvailability(day)}
              >
                <Text style={styles.editAvailabilityText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Section 3: About Me */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <TextInput 
          style={styles.textArea} 
          placeholder="Tell us about yourself..."
          value={aboutMe}
          onChangeText={(text) => {
            const filteredText = text.replace(/[^a-zA-Z0-9\s]/g, '');
            setAboutMe(filteredText);
          }}
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Bottom spacing for floating button */}
      <View style={{ height: 80 }} />
      
      <TimePickerModal
        visible={showTimeModal}
        selectedDay={selectedDay}
        tempFromHour={tempFromHour}
        tempFromMinute={tempFromMinute}
        tempToHour={tempToHour}
        tempToMinute={tempToMinute}
        tempFromAmPm={tempFromAmPm}
        tempToAmPm={tempToAmPm}
        editingSlotIndex={editingSlotIndex}
        showAlert={showAlert}
        alertMessage={alertMessage}
        onFromHourChange={(text) => {
          const num = Number.parseInt(text);
          if (text === '' || (num >= 0 && num <= 11)) {
            setTempFromHour(text);
          } else {
            setAlertMessage('Hour should be between 0 to 11');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
          }
        }}
        onFromMinuteChange={(text) => {
          const num = Number.parseInt(text);
          if (text === '' || (num >= 0 && num <= 59)) {
            setTempFromMinute(text);
          }
        }}
        onToHourChange={(text) => {
          const num = Number.parseInt(text);
          if (text === '' || (num >= 0 && num <= 11)) {
            setTempToHour(text);
          } else {
            setAlertMessage('Hour should be between 0 to 11');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
          }
        }}
        onToMinuteChange={(text) => {
          const num = Number.parseInt(text);
          if (text === '' || (num >= 0 && num <= 59)) {
            setTempToMinute(text);
          }
        }}
        onFromAmPmToggle={() => setTempFromAmPm(tempFromAmPm === 'AM' ? 'PM' : 'AM')}
        onToAmPmToggle={() => setTempToAmPm(tempToAmPm === 'AM' ? 'PM' : 'AM')}
        onCancel={() => setShowTimeModal(false)}
        onSave={saveTimeSlot}
      />
      
      {/* Availability Modal */}
      <Modal visible={showAvailabilityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Saved Availability</Text>
            <ScrollView style={styles.availabilityList}>
              {loadingAvailability ? (
                <Text style={styles.noAvailabilityText}>Loading...</Text>
              ) : selectedDayAvailability.length > 0 ? (
                selectedDayAvailability.map((item) => (
                  <View key={item.id || `${item.startTime}-${item.endTime}`} style={styles.availabilityItem}>
                    <Text style={styles.availabilityText}>
                      {item.startTime} - {item.endTime}
                    </Text>
                    <Text style={styles.availabilityStatus}>{item.status}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailabilityText}>No availability found</Text>
              )}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAvailabilityModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#16423C',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#999999',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    height: 400,
  },
  daysSection: {
    marginTop: 10,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  daysContainer: {
    flexGrow: 0,
  },
  daysContentContainer: {
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: 'center',
    width: 80,
    marginHorizontal: 8,
  },
  dayCard: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#DBDBDB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginBottom: 5,
  },
  selectedDayCard: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  dayText: {
    fontSize: 10,
    color: '#333333',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  slotCount: {
    fontSize: 8,
    color: '#FFFFFF',
    marginTop: 2,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 4,
    marginBottom: 2,
    width: '100%',
  },
  timeSlotTextContainer: {
    flex: 1,
  },
  timeSlotText: {
    fontSize: 8,
    color: '#333333',
    textAlign: 'center',
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 16,
    width: 50,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  timeBlock: {
    width: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333333',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#16423C',
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  amPmButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  amPmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    marginRight: 5,
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
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
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
  viewAvailabilityButton: {
    backgroundColor: '#16423C',
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 4,
    width: '100%',
  },
  viewAvailabilityText: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  availabilityList: {
    maxHeight: 200,
    marginVertical: 10,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#333333',
  },
  availabilityStatus: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: 'bold',
  },
  noAvailabilityText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#16423C',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  editAvailabilityButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 4,
    width: '100%',
  },
  editAvailabilityText: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  editAvailabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 8,
  },
  deleteAvailabilityButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteAvailabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProfileUpdateForm;