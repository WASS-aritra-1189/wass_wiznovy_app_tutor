import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const getCountries = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/country/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Countries fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch countries',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getCities = async (countryId: string, limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const url = `${API_BASE_URL}/city/list/${countryId}?limit=${limit}&offset=${offset}&keyword=`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Cities fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch cities',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getGoals = async (limit: number = 10, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/goal/all?limit=${limit}&offset=${offset}&status=ACTIVE`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Goals fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch goals',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getTopics = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic/all?limit=${limit}&offset=${offset}&status=ACTIVE`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Topics fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch topics',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getSubjects = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  const token=await getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/all?limit=${limit}&offset=${offset}&status=ACTIVE`, {
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
        message: 'Subjects fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch subjects',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};



export const updateUserDetails = async (userData: any): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    const formData = new URLSearchParams();
    
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/user-details/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'User details updated successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update user details',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const uploadDocument = async (fileUri: string): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'document.jpg',
    } as any);
    
    const url = `${API_BASE_URL}/tutor-details/document`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Document uploaded successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to upload document',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getQualifications = async (limit: number = 50, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/qualification/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Qualifications fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch qualifications',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getLanguages = async (limit: number = 50, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Languages fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch languages',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const uploadProfileImage = async (fileUri: string): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    
    const url = `${API_BASE_URL}/tutor-details/profileImage`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Profile image uploaded successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to upload profile image',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};