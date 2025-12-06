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

export const createAvailability = async (availabilityData: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-availability`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(availabilityData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Availability created successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create availability',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getAvailability = async (): Promise<AvailabilityResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-availability`, {
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
        message: 'Availability fetched successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch availability',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getMyAvailability = async (limit: number = 10, offset: number = 0): Promise<AvailabilityResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-availability/my-availability?limit=${limit}&offset=${offset}`, {
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
        message: 'My availability fetched successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch my availability',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const updateAvailability = async (id: string, availabilityData: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-availability/${id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(availabilityData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Availability updated successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update availability',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};