import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

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
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/course/my-courses`, {
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
          message: 'Courses fetched successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch courses',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  createCourse: async (courseData: CreateCourseData): Promise<CourseResponse> => {
    console.log('🚀 courseService: Starting course creation');
    console.log('📦 courseService: Request payload:', JSON.stringify(courseData, null, 2));
    
    try {
      const token = await getToken();
      console.log('🔑 courseService: Token retrieved:', token ? 'Present' : 'Missing');
      
      const requestUrl = `${API_BASE_URL}/course`;
      console.log('🌐 courseService: Request URL:', requestUrl);
      
      let body: any;
      let headers: any = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      // Check if thumbnail is included
      if (courseData.thumbnail) {
        console.log('📸 courseService: Creating FormData with thumbnail');
        const formData = new FormData();
        
        // Add all course data fields
        Object.keys(courseData).forEach(key => {
          if (key !== 'thumbnail') {
            formData.append(key, (courseData as any)[key]);
          }
        });
        
        // Add thumbnail file
        formData.append('thumbnail', {
          uri: courseData.thumbnail.uri,
          type: courseData.thumbnail.type,
          name: courseData.thumbnail.name,
        } as any);
        
        body = formData;
        // Don't set Content-Type for FormData, let fetch set it
      } else {
        console.log('📝 courseService: Using JSON payload (no thumbnail)');
        headers['Content-Type'] = 'application/json';
        const { thumbnail, ...courseDataWithoutThumbnail } = courseData;
        body = JSON.stringify(courseDataWithoutThumbnail);
      }
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers,
        body,
      });

      console.log('📡 courseService: Response status:', response.status);
      console.log('📡 courseService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📨 courseService: Response data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ courseService: Course created successfully');
        return {
          success: true,
          message: 'Course created successfully',
          data: data,
        };
      } else {
        console.log('❌ courseService: Course creation failed with status:', response.status);
        console.log('❌ courseService: Error message:', data.message);
        return {
          success: false,
          message: data.message || 'Failed to create course',
        };
      }
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  getCourseDetails: async (courseId: string): Promise<CourseResponse> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/course/${courseId}/full`, {
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
          message: 'Course details fetched successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch course details',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  getUnitsByCourse: async (courseId: string): Promise<UnitResponse> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/unit/by-course?courseId=${courseId}`, {
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
          message: 'Units fetched successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch units',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  createUnit: async (unitData: CreateUnitData): Promise<UnitResponse> => {
    console.log('🚀 courseService: Starting unit creation');
    console.log('📦 courseService: Unit data:', JSON.stringify(unitData, null, 2));
    
    try {
      const token = await getToken();
      console.log('🔑 courseService: Token retrieved:', token ? 'Present' : 'Missing');
      
      let body: any;
      let headers: any = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      if (unitData.image) {
        console.log('📸 courseService: Creating FormData with image');
        const formData = new FormData();
        formData.append('name', unitData.name);
        formData.append('description', unitData.description);
        formData.append('courseId', unitData.courseId);
        formData.append('image', {
          uri: unitData.image.uri,
          type: unitData.image.type,
          name: unitData.image.name,
        } as any);
        body = formData;
      } else {
        console.log('📝 courseService: Using JSON payload (no image)');
        headers['Content-Type'] = 'application/json';
        const { image, ...unitDataWithoutImage } = unitData;
        body = JSON.stringify(unitDataWithoutImage);
      }
      
      const requestUrl = `${API_BASE_URL}/unit`;
      console.log('🌐 courseService: Request URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers,
        body,
      });

      console.log('📡 courseService: Response status:', response.status);
      const data = await response.json();
      console.log('📨 courseService: Response data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ courseService: Unit created successfully');
        return {
          success: true,
          message: 'Unit created successfully',
          data: data,
        };
      } else {
        console.log('❌ courseService: Unit creation failed with status:', response.status);
        return {
          success: false,
          message: data.message || 'Failed to create unit',
        };
      }
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  getVideosByUnit: async (unitId: string): Promise<VideoLectureResponse> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/video-lecture/tutor/unit/${unitId}`, {
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
          message: 'Videos fetched successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch videos',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },

  createVideoLecture: async (videoData: CreateVideoLectureData): Promise<VideoLectureResponse> => {
    console.log('🚀 courseService: Starting video lecture creation');
    console.log('📦 courseService: Video data:', JSON.stringify(videoData, null, 2));
    
    try {
      const token = await getToken();
      console.log('🔑 courseService: Token retrieved:', token ? 'Present' : 'Missing');
      
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('unitId', videoData.unitId);
      formData.append('duration', videoData.duration.toString());
      
      if (videoData.video) {
        formData.append('video', {
          uri: videoData.video.uri,
          type: videoData.video.type,
          name: videoData.video.name,
        } as any);
      }
      
      if (videoData.thumbnail) {
        formData.append('thumbnail', {
          uri: videoData.thumbnail.uri,
          type: videoData.thumbnail.type,
          name: videoData.thumbnail.name,
        } as any);
      }
      
      const requestUrl = `${API_BASE_URL}/video-lecture`;
      console.log('🌐 courseService: Request URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📡 courseService: Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('📨 courseService: Response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log('❌ courseService: Failed to parse response as JSON:', parseError);
        if (response.status === 413) {
          return {
            success: false,
            message: 'Video file is too large. Please select a smaller file (max 50MB).',
          };
        }
        return {
          success: false,
          message: `Server error (${response.status}). Please try again.`,
        };
      }

      if (response.ok) {
        console.log('✅ courseService: Video lecture created successfully');
        return {
          success: true,
          message: 'Video lecture created successfully',
          data: data,
        };
      } else {
        console.log('❌ courseService: Video lecture creation failed with status:', response.status);
        return {
          success: false,
          message: data.message || 'Failed to create video lecture',
        };
      }
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  updateCourse: async (courseId: string, courseData: UpdateCourseData): Promise<CourseResponse> => {
    console.log('🚀 courseService: Starting course update');
    console.log('📦 courseService: Course ID:', courseId);
    console.log('📦 courseService: Update payload:', JSON.stringify(courseData, null, 2));
    
    try {
      const token = await getToken();
      console.log('🔑 courseService: Token retrieved:', token ? 'Present' : 'Missing');
      
      const requestUrl = `${API_BASE_URL}/course/${courseId}`;
      console.log('🌐 courseService: Request URL:', requestUrl);
      
      let body: any;
      let headers: any = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      // Check if thumbnail is included
      if (courseData.thumbnail) {
        console.log('📸 courseService: Creating FormData with thumbnail');
        const formData = new FormData();
        
        // Add all course data fields
        Object.keys(courseData).forEach(key => {
          if (key !== 'thumbnail') {
            formData.append(key, (courseData as any)[key]);
          }
        });
        
        // Add thumbnail file
        formData.append('thumbnail', {
          uri: courseData.thumbnail.uri,
          type: courseData.thumbnail.type,
          name: courseData.thumbnail.name,
        } as any);
        
        body = formData;
        // Don't set Content-Type for FormData, let fetch set it
      } else {
        console.log('📝 courseService: Using JSON payload (no thumbnail)');
        headers['Content-Type'] = 'application/json';
        const { thumbnail, ...courseDataWithoutThumbnail } = courseData;
        body = JSON.stringify(courseDataWithoutThumbnail);
      }
      
      const response = await fetch(requestUrl, {
        method: 'PATCH',
        headers,
        body,
      });

      console.log('📡 courseService: Response status:', response.status);
      console.log('📡 courseService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📨 courseService: Response data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ courseService: Course updated successfully');
        return {
          success: true,
          message: 'Course updated successfully',
          data: data,
        };
      } else {
        console.log('❌ courseService: Course update failed with status:', response.status);
        console.log('❌ courseService: Error message:', data.message);
        return {
          success: false,
          message: data.message || 'Failed to update course',
        };
      }
    } catch (error) {
      console.log('❌ courseService: Network/Parse error:', error);
      return {
        success: false,
        message: `Network error: ${error}`,
      };
    }
  },
};