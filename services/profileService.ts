import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface UploadProfileImageData {
  file: {
    uri: string;
    type: string;
    name: string;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const uploadProfileImage = async (imageData: UploadProfileImageData): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const formData = new FormData();
    formData.append('file', {
      uri: imageData.file.uri,
      type: imageData.file.type,
      name: imageData.file.name,
    } as any);
    
    console.log('FormData created with file:', {
      uri: imageData.file.uri,
      type: imageData.file.type,
      name: imageData.file.name
    });
    const response = await fetch(`${API_BASE_URL}/tutor-details/profileImage`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Profile image upload successful');
      return {
        success: true,
        message: 'Profile image uploaded successfully',
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
    console.log('❌ Profile image upload error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getWalkthrough = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/walk-through/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Walkthrough data fetched successfully',
        data: data.result,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch walkthrough data',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const updateTutorDetails = async (updateData: any): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-details/update`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Profile updated successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update profile',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/account/tutor/profile`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Profile fetched successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch profile',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};