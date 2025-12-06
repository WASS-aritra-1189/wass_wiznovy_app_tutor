import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

export interface SessionUser {
  id: string;
  phoneNumber: string;
  email: string;
  roles: string;
  loginType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userDetail: {
    id: string;
    name: string;
    gender: string;
    englishLevel: string;
    dob: string;
    address: string | null;
    profile: string;
    profileName: string;
    createdAt: string;
    updatedAt: string;
    accountId: string;
    topicId: string;
    goalId: string;
    countryId: string;
    languageId: string | null;
    budgetId: string;
    qualificationId: string | null;
  };
}

export interface TutorSession {
  id: string;
  userId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: string;
  purchaseId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: SessionUser;
}

export interface SessionsResponse {
  result: TutorSession[];
  total: number;
}

export const sessionsService = {
  getTutorSessions: async (
    limit: number = 20,
    offset: number = 0,
    date?: string
  ): Promise<SessionsResponse> => {
    try {
      let url = `${API_BASE_URL}/sessions/tutor-sessions?limit=${limit}&offset=${offset}`;
      if (date) {
        url += `&date=${date}`;
      }

      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tutor sessions:', error);
      throw error;
    }
  },
};