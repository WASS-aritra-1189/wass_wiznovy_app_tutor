import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface OnboardingData {
  dateOfBirth: Date;
  gender: string;
  country: string;
  city: string;
  education: string;
  proficiency: string;
  bio: string;
  idDocument: string | null;
  profilePicture: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitOnboardingData = async (onboardingData: OnboardingData): Promise<ApiResponse> => {
  try {
    const token = await getToken();
    
    const formData = new FormData();
    
    // Add basic information
    formData.append('dateOfBirth', onboardingData.dateOfBirth.toISOString().split('T')[0]);
    formData.append('gender', onboardingData.gender);
    formData.append('country', onboardingData.country);
    formData.append('city', onboardingData.city);
    formData.append('education', onboardingData.education);
    formData.append('proficiency', onboardingData.proficiency);
    formData.append('bio', onboardingData.bio);
    
    // Add ID document if exists
    if (onboardingData.idDocument) {
      formData.append('idDocument', {
        uri: onboardingData.idDocument,
        type: 'image/jpeg',
        name: 'id_document.jpg',
      } as any);
    }
    
    // Add profile picture if exists
    if (onboardingData.profilePicture) {
      formData.append('profilePicture', {
        uri: onboardingData.profilePicture,
        type: 'image/jpeg',
        name: 'profile_picture.jpg',
      } as any);
    }
    
    const response = await fetch(`${API_BASE_URL}/tutor/onboarding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Onboarding completed successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to complete onboarding',
      };
    }
  } catch (error) {
    console.error('Onboarding API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const uploadProfileImage = async (imageUri: string): Promise<ApiResponse> => {
  try {
    console.log('=== Profile Image Upload Started ===');
    
    const token = await getToken();
    console.log('Token retrieved:', token ? 'Token exists' : 'No token found');
    
    const formData = new FormData();
    
    // Append file with correct field name
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    } as any);
    
    console.log('FormData prepared with file:', imageUri);
    console.log('API URL:', `${API_BASE_URL}/tutor-details/profileImage`);
    
    const response = await fetch(`${API_BASE_URL}/tutor-details/profileImage`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Profile image upload successful');
      return {
        success: true,
        message: data.message || 'Profile image uploaded successfully',
        data: data,
      };
    } else {
      console.log('❌ Profile image upload failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to upload profile image',
      };
    }
  } catch (error) {
    console.error('❌ Profile Image Upload Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};