import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

const fetchData = async (url: string, token?: string): Promise<Response> => {
  const headers: Record<string, string> = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, { method: 'GET', headers });
};

const handleFetchResponse = async (response: Response, successMsg: string, failMsg: string): Promise<OnboardingResponse> => {
  try {
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: successMsg, data: data.result || data };
    }
    return { success: false, message: data.message || failMsg };
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

const uploadFile = async (url: string, fileUri: string, fileName: string, successMsg: string, failMsg: string): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    const formData = new FormData();
    formData.append('file', { uri: fileUri, type: 'image/jpeg', name: fileName } as any);
    
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
      return { success: true, message: successMsg, data };
    }
    return { success: false, message: data.message || failMsg };
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getCountries = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/country/all?limit=${limit}&offset=${offset}`);
    return handleFetchResponse(response, 'Countries fetched successfully', 'Failed to fetch countries');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getCities = async (countryId: string, limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/city/list/${countryId}?limit=${limit}&offset=${offset}&keyword=`);
    return handleFetchResponse(response, 'Cities fetched successfully', 'Failed to fetch cities');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getGoals = async (limit: number = 10, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/goal/all?limit=${limit}&offset=${offset}&status=ACTIVE`);
    return handleFetchResponse(response, 'Goals fetched successfully', 'Failed to fetch goals');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getTopics = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/topic/all?limit=${limit}&offset=${offset}&status=ACTIVE`);
    return handleFetchResponse(response, 'Topics fetched successfully', 'Failed to fetch topics');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getSubjects = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    const response = await fetchData(`${API_BASE_URL}/subjects/all?limit=${limit}&offset=${offset}&status=ACTIVE`, token);
    return handleFetchResponse(response, 'Subjects fetched successfully', 'Failed to fetch subjects');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
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
  return uploadFile(`${API_BASE_URL}/tutor-details/document`, fileUri, 'document.jpg', 'Document uploaded successfully', 'Failed to upload document');
};

export const getQualifications = async (limit: number = 50, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/qualification/all?limit=${limit}&offset=${offset}`);
    return handleFetchResponse(response, 'Qualifications fetched successfully', 'Failed to fetch qualifications');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getLanguages = async (limit: number = 50, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetchData(`${API_BASE_URL}/languages/all?limit=${limit}&offset=${offset}`);
    return handleFetchResponse(response, 'Languages fetched successfully', 'Failed to fetch languages');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const uploadProfileImage = async (fileUri: string): Promise<OnboardingResponse> => {
  return uploadFile(`${API_BASE_URL}/tutor-details/profileImage`, fileUri, 'profile.jpg', 'Profile image uploaded successfully', 'Failed to upload profile image');
};