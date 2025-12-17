import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

export interface CreateStudyMaterialData {
  title: string;
  description: string;
  unitId: string;
  videoLectureId?: string | null;
  file?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface UpdateStudyMaterialData {
  title?: string;
  description?: string;
  file?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface StudyMaterialResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const studyMaterialService = {
  createStudyMaterial: async (materialData: CreateStudyMaterialData): Promise<StudyMaterialResponse> => {
    console.log('🚀 studyMaterialService: Starting study material creation');
    console.log('📦 studyMaterialService: Request payload:', JSON.stringify(materialData, null, 2));
    
    try {
      const token = await getToken();
      console.log('🔑 studyMaterialService: Token retrieved:', token ? 'Present' : 'Missing');
      
      // First create the study material without file
      const requestUrl = `${API_BASE_URL}/study-material`;
      console.log('🌐 studyMaterialService: Request URL:', requestUrl);
      
      const createPayload = {
        title: materialData.title,
        description: materialData.description,
        unitId: materialData.unitId
      };
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createPayload),
      });

      console.log('📡 studyMaterialService: Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('📨 studyMaterialService: Response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log('❌ studyMaterialService: Failed to parse response as JSON:', parseError);
        return {
          success: false,
          message: `Server error (${response.status}). Please try again.`,
        };
      }

      if (!response.ok) {
        console.log('❌ studyMaterialService: Study material creation failed with status:', response.status);
        return {
          success: false,
          message: data.message || 'Failed to create study material',
        };
      }
      
      console.log('✅ studyMaterialService: Study material created successfully');
      
      // If there's a file, upload it separately
      if (materialData.file && data.id) {
        console.log('📄 studyMaterialService: Uploading file for material:', data.id);
        const fileResult = await studyMaterialService.updateStudyMaterialFile(data.id, materialData.file);
        
        if (!fileResult.success) {
          console.log('❌ studyMaterialService: File upload failed:', fileResult.message);
          return {
            success: false,
            message: `Material created but file upload failed: ${fileResult.message}`,
          };
        }
        
        console.log('✅ studyMaterialService: File uploaded successfully');
      }
      
      return {
        success: true,
        message: 'Study material created successfully',
        data: data,
      };
    } catch (error) {
      console.log('❌ studyMaterialService: Network/Parse error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  getStudyMaterialsByUnit: async (unitId: string): Promise<StudyMaterialResponse> => {
    console.log('🚀 studyMaterialService: Fetching study materials for unit:', unitId);
    
    try {
      const token = await getToken();
      console.log('🔑 studyMaterialService: Token retrieved:', token ? 'Present' : 'Missing');
      
      const requestUrl = `${API_BASE_URL}/study-material/tutor/list?unitId=${unitId}`;
      console.log('🌐 studyMaterialService: Request URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 studyMaterialService: Response status:', response.status);
      
      const data = await response.json();
      console.log('📨 studyMaterialService: Response data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ studyMaterialService: Study materials fetched successfully');
        return {
          success: true,
          message: 'Study materials fetched successfully',
          data: data.result || data,
        };
      } else {
        console.log('❌ studyMaterialService: Failed to fetch study materials');
        return {
          success: false,
          message: data.message || 'Failed to fetch study materials',
        };
      }
    } catch (error) {
      console.log('❌ studyMaterialService: Network/Parse error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  getStudyMaterialById: async (materialId: string): Promise<StudyMaterialResponse> => {
    console.log('🚀 studyMaterialService: Fetching study material:', materialId);
    
    try {
      const token = await getToken();
      const requestUrl = `${API_BASE_URL}/study-material/${materialId}`;
      
      const response = await fetch(requestUrl, {
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
          message: 'Study material fetched successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch study material',
        };
      }
    } catch (error) {
      console.error('studyMaterialService: getStudyMaterialById error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  updateStudyMaterial: async (materialId: string, materialData: UpdateStudyMaterialData): Promise<StudyMaterialResponse> => {
    console.log('🚀 studyMaterialService: Updating study material:', materialId);
    
    try {
      const token = await getToken();
      const requestUrl = `${API_BASE_URL}/study-material/tutor/${materialId}`;
      
      let body: any;
      let headers: any = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      if (materialData.file) {
        const formData = new FormData();
        if (materialData.title) formData.append('title', materialData.title);
        if (materialData.description) formData.append('description', materialData.description);
        formData.append('file', {
          uri: materialData.file.uri,
          type: materialData.file.type,
          name: materialData.file.name,
        } as any);
        body = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        const { file, ...dataWithoutFile } = materialData;
        body = JSON.stringify(dataWithoutFile);
      }
      
      const response = await fetch(requestUrl, {
        method: 'PUT',
        headers,
        body,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Study material updated successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update study material',
        };
      }
    } catch (error) {
      console.error('studyMaterialService: updateStudyMaterial error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },

  updateStudyMaterialFile: async (materialId: string, file: { uri: string; type: string; name: string }): Promise<StudyMaterialResponse> => {
    console.log('🚀 studyMaterialService: Updating study material file:', materialId);
    
    try {
      const token = await getToken();
      const requestUrl = `${API_BASE_URL}/study-material/pdf/${materialId}`;
      
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
      
      const response = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Study material file updated successfully',
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update study material file',
        };
      }
    } catch (error) {
      console.error('studyMaterialService: updateStudyMaterialFile error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  },
};