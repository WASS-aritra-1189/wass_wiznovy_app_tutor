import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface AvailabilityResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface AvailabilityData {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

const makeAuthRequest = async (
  url: string,
  method: string,
  body?: any
): Promise<Response> => {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  if (body) headers['Content-Type'] = 'application/json';
  
  return fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
};

const handleApiResponse = async (
  response: Response,
  successMsg: string,
  failMsg: string
): Promise<AvailabilityResponse> => {
  try {
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: successMsg, data };
    }
    return { success: false, message: data.message || failMsg };
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const createAvailability = async (availabilityData: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const response = await makeAuthRequest(`${API_BASE_URL}/tutor-availability`, 'POST', availabilityData);
    return handleApiResponse(response, 'Availability created successfully', 'Failed to create availability');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getAvailability = async (): Promise<AvailabilityResponse> => {
  try {
    const response = await makeAuthRequest(`${API_BASE_URL}/tutor-availability`, 'GET');
    return handleApiResponse(response, 'Availability fetched successfully', 'Failed to fetch availability');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const getMyAvailability = async (limit: number = 10, offset: number = 0): Promise<AvailabilityResponse> => {
  try {
    const response = await makeAuthRequest(`${API_BASE_URL}/tutor-availability/my-availability?limit=${limit}&offset=${offset}`, 'GET');
    return handleApiResponse(response, 'My availability fetched successfully', 'Failed to fetch my availability');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};

export const updateAvailability = async (id: string, availabilityData: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const response = await makeAuthRequest(`${API_BASE_URL}/tutor-availability/${id}`, 'PATCH', availabilityData);
    return handleApiResponse(response, 'Availability updated successfully', 'Failed to update availability');
  } catch (error) {
    return { success: false, message: `Network error: ${error}` };
  }
};