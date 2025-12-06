import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

const makeAuthRequest = async (url: string, method: string, body?: any, headers?: any): Promise<Response> => {
  const token = await getToken();
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...headers,
  };
  return fetch(url, { method, headers: defaultHeaders, ...(body && { body }) });
};

const handleResponse = async (response: Response, successMsg: string, failMsg: string): Promise<any> => {
  const data = await response.json();
  if (response.ok) {
    return { success: true, message: successMsg, data };
  }
  return { success: false, message: data.message || failMsg };
};

const prepareFormData = (data: any, fileFields: string[]): FormData => {
  const formData = new FormData();
  for (const key of Object.keys(data)) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

const prepareRequestBody = (data: any, fileField?: string) => {
  if (fileField && data[fileField]) {
    return { body: prepareFormData(data, [fileField]), headers: {} };
  }
  const { [fileField as string]: _, ...cleanData } = data;
  return { body: JSON.stringify(cleanData), headers: { 'Content-Type': 'application/json' } };
};

export interface CreateCourseData {
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  validityDays: number;
  accessType: 'PAID' | 'FREE';
  totalDuration: string;
  totalLectures: number;
  authorMessage?: string;
  startDate: string;
  endDate: string;
  subjectId?: string;
  languageId?: string;
  thumbnail?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  price?: string;
  discountPrice?: string;
  validityDays?: number;
  accessType?: 'PAID' | 'FREE';
  totalDuration?: string;
  totalLectures?: number;
  authorMessage?: string;
  startDate?: string;
  endDate?: string;
  subjectId?: string;
  languageId?: string;
  thumbnail?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreateUnitData {
  name: string;
  description: string;
  courseId: string;
  imgUrl?: string;
  image?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface UnitResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreateVideoLectureData {
  title: string;
  description: string;
  unitId: string;
  duration: number;
  video?: {
    uri: string;
    type: string;
    name: string;
  };
  thumbnail?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface VideoLectureResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const courseService = {
  getMyCourses: async (): Promise<CourseResponse> => {
    try {
      const response = await makeAuthRequest(`${API_BASE_URL}/course/my-courses`, 'GET');
      return handleResponse(response, 'Courses fetched successfully', 'Failed to fetch courses');
    } catch (error) {
      return { success: false, message: `Network error: ${error}` };
    }
  },

  createCourse: async (courseData: CreateCourseData): Promise<CourseResponse> => {
    console.log('🚀 courseService: Starting course creation');
    try {
      const { body, headers } = prepareRequestBody(courseData, 'thumbnail');
      const response = await makeAuthRequest(`${API_BASE_URL}/course`, 'POST', body, headers);
      console.log('📡 courseService: Response status:', response.status);
      const result = await handleResponse(response, 'Course created successfully', 'Failed to create course');
      console.log(result.success ? '✅ courseService: Course created successfully' : '❌ courseService: Course creation failed');
      return result;
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return { success: false, message: `Network error: ${error}` };
    }
  },

  getCourseDetails: async (courseId: string): Promise<CourseResponse> => {
    try {
      const response = await makeAuthRequest(`${API_BASE_URL}/course/${courseId}/full`, 'GET');
      return handleResponse(response, 'Course details fetched successfully', 'Failed to fetch course details');
    } catch (error) {
      return { success: false, message: `Network error: ${error}` };
    }
  },

  getUnitsByCourse: async (courseId: string): Promise<UnitResponse> => {
    try {
      const response = await makeAuthRequest(`${API_BASE_URL}/unit/by-course?courseId=${courseId}`, 'GET');
      return handleResponse(response, 'Units fetched successfully', 'Failed to fetch units');
    } catch (error) {
      return { success: false, message: `Network error: ${error}` };
    }
  },

  createUnit: async (unitData: CreateUnitData): Promise<UnitResponse> => {
    console.log('🚀 courseService: Starting unit creation');
    try {
      const { body, headers } = prepareRequestBody(unitData, 'image');
      const response = await makeAuthRequest(`${API_BASE_URL}/unit`, 'POST', body, headers);
      console.log('📡 courseService: Response status:', response.status);
      const result = await handleResponse(response, 'Unit created successfully', 'Failed to create unit');
      console.log(result.success ? '✅ courseService: Unit created successfully' : '❌ courseService: Unit creation failed');
      return result;
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return { success: false, message: `Network error: ${error}` };
    }
  },

  getVideosByUnit: async (unitId: string): Promise<VideoLectureResponse> => {
    try {
      const response = await makeAuthRequest(`${API_BASE_URL}/video-lecture/tutor/unit/${unitId}`, 'GET');
      return handleResponse(response, 'Videos fetched successfully', 'Failed to fetch videos');
    } catch (error) {
      return { success: false, message: `Network error: ${error}` };
    }
  },

  createVideoLecture: async (videoData: CreateVideoLectureData): Promise<VideoLectureResponse> => {
    console.log('🚀 courseService: Starting video lecture creation');
    try {
      const formData = prepareFormData(videoData, ['video', 'thumbnail']);
      const response = await makeAuthRequest(`${API_BASE_URL}/video-lecture`, 'POST', formData);
      console.log('📡 courseService: Response status:', response.status);
      
      try {
        const result = await handleResponse(response, 'Video lecture created successfully', 'Failed to create video lecture');
        console.log(result.success ? '✅ courseService: Video lecture created successfully' : '❌ courseService: Video lecture creation failed');
        return result;
      } catch (parseError) {
        console.log('❌ courseService: Failed to parse response as JSON:', parseError);
        if (response.status === 413) return { success: false, message: 'Video file is too large. Please select a smaller file (max 50MB).' };
        return { success: false, message: `Server error (${response.status}). Please try again.` };
      }
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  },

  updateCourse: async (courseId: string, courseData: UpdateCourseData): Promise<CourseResponse> => {
    console.log('🚀 courseService: Starting course update');
    try {
      const { body, headers } = prepareRequestBody(courseData, 'thumbnail');
      const response = await makeAuthRequest(`${API_BASE_URL}/course/${courseId}`, 'PATCH', body, headers);
      console.log('📡 courseService: Response status:', response.status);
      const result = await handleResponse(response, 'Course updated successfully', 'Failed to update course');
      console.log(result.success ? '✅ courseService: Course updated successfully' : '❌ courseService: Course update failed');
      return result;
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return { success: false, message: `Network error: ${error}` };
    }
  },
};