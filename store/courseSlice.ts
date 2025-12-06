import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService, CreateCourseData, UpdateCourseData, CreateUnitData, CreateVideoLectureData } from '../services/courseService';
import { studyMaterialService, CreateStudyMaterialData } from '../services/studyMaterialService';

interface CourseState {
  courses: any[];
  units: any[];
  videoLectures: any[];
  studyMaterials: any[];
  currentCourse: any | null;
  loading: {
    create: boolean;
    update: boolean;
    fetch: boolean;
    fetchDetails: boolean;
    fetchUnits: boolean;
    fetchVideos: boolean;
    fetchStudyMaterials: boolean;
    createUnit: boolean;
    createVideoLecture: boolean;
    createStudyMaterial: boolean;
  };
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  units: [],
  videoLectures: [],
  studyMaterials: [],
  currentCourse: null,
  loading: {
    create: false,
    update: false,
    fetch: false,
    fetchDetails: false,
    fetchUnits: false,
    fetchVideos: false,
    fetchStudyMaterials: false,
    createUnit: false,
    createVideoLecture: false,
    createStudyMaterial: false,
  },
  error: null,
};

export const fetchMyCourses = createAsyncThunk(
  'course/fetchMyCourses',
  async () => {
    const result = await courseService.getMyCourses();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const createCourse = createAsyncThunk(
  'course/createCourse',
  async (courseData: CreateCourseData) => {
    console.log('🎯 courseSlice: createCourse thunk called with data:', courseData);
    const result = await courseService.createCourse(courseData);
    if (result.success) {
      console.log('✅ courseSlice: Course creation successful');
      return result.data;
    }
    console.log('❌ courseSlice: Course creation failed:', result.message);
    throw new Error(result.message);
  }
);

export const updateCourse = createAsyncThunk(
  'course/updateCourse',
  async ({ courseId, courseData }: { courseId: string; courseData: UpdateCourseData }) => {
    console.log('🎯 courseSlice: updateCourse thunk called with ID:', courseId);
    console.log('🎯 courseSlice: updateCourse thunk called with data:', courseData);
    const result = await courseService.updateCourse(courseId, courseData);
    if (result.success) {
      console.log('✅ courseSlice: Course update successful');
      return result.data;
    }
    console.log('❌ courseSlice: Course update failed:', result.message);
    throw new Error(result.message);
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'course/fetchCourseDetails',
  async (courseId: string) => {
    const result = await courseService.getCourseDetails(courseId);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const fetchUnitsByCourse = createAsyncThunk(
  'course/fetchUnitsByCourse',
  async (courseId: string) => {
    const result = await courseService.getUnitsByCourse(courseId);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const createUnit = createAsyncThunk(
  'course/createUnit',
  async (unitData: CreateUnitData, { dispatch }) => {
    console.log('🎯 courseSlice: createUnit thunk called with data:', unitData);
    const result = await courseService.createUnit(unitData);
    if (result.success) {
      console.log('✅ courseSlice: Unit creation successful');
      // Refresh units list after creating new unit
      dispatch(fetchUnitsByCourse(unitData.courseId));
      return result.data;
    }
    console.log('❌ courseSlice: Unit creation failed:', result.message);
    throw new Error(result.message);
  }
);

export const fetchVideosByUnit = createAsyncThunk(
  'course/fetchVideosByUnit',
  async (unitId: string) => {
    const result = await courseService.getVideosByUnit(unitId);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const createVideoLecture = createAsyncThunk(
  'course/createVideoLecture',
  async (videoData: CreateVideoLectureData, { dispatch }) => {
    console.log('🎯 courseSlice: createVideoLecture thunk called with data:', videoData);
    const result = await courseService.createVideoLecture(videoData);
    if (result.success) {
      console.log('✅ courseSlice: Video lecture creation successful');
      // Refresh videos list after creating new video
      dispatch(fetchVideosByUnit(videoData.unitId));
      return result.data;
    }
    console.log('❌ courseSlice: Video lecture creation failed:', result.message);
    throw new Error(result.message);
  }
);

export const fetchStudyMaterialsByUnit = createAsyncThunk(
  'course/fetchStudyMaterialsByUnit',
  async (unitId: string) => {
    console.log('🎯 courseSlice: fetchStudyMaterialsByUnit thunk called with unitId:', unitId);
    const result = await studyMaterialService.getStudyMaterialsByUnit(unitId);
    if (result.success) {
      console.log('✅ courseSlice: Study materials fetch successful');
      return result.data;
    }
    console.log('❌ courseSlice: Study materials fetch failed:', result.message);
    throw new Error(result.message);
  }
);

export const createStudyMaterial = createAsyncThunk(
  'course/createStudyMaterial',
  async (materialData: CreateStudyMaterialData, { dispatch }) => {
    console.log('🎯 courseSlice: createStudyMaterial thunk called with data:', materialData);
    const result = await studyMaterialService.createStudyMaterial(materialData);
    if (result.success) {
      console.log('✅ courseSlice: Study material creation successful');
      // Refresh study materials list after creating new material
      await dispatch(fetchStudyMaterialsByUnit(materialData.unitId));
      return result.data;
    }
    console.log('❌ courseSlice: Study material creation failed:', result.message);
    throw new Error(result.message);
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.courses = action.payload.result || action.payload || [];
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      // Create Course
      .addCase(createCourse.pending, (state) => {
        console.log('⏳ courseSlice: Create course pending');
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        console.log('✅ courseSlice: Create course fulfilled');
        console.log('📦 courseSlice: New course data:', JSON.stringify(action.payload, null, 2));
        state.loading.create = false;
        state.currentCourse = action.payload;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        console.log('❌ courseSlice: Create course rejected');
        console.log('❌ courseSlice: Error:', action.error.message);
        state.loading.create = false;
        state.error = action.error.message || 'Failed to create course';
      })
      // Update Course
      .addCase(updateCourse.pending, (state) => {
        console.log('⏳ courseSlice: Update course pending');
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        console.log('✅ courseSlice: Update course fulfilled');
        console.log('📦 courseSlice: Updated course data:', JSON.stringify(action.payload, null, 2));
        state.loading.update = false;
        state.currentCourse = action.payload;
        // Update the course in the courses array
        const courseIndex = state.courses.findIndex(course => course.id === action.payload.id);
        if (courseIndex !== -1) {
          state.courses[courseIndex] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        console.log('❌ courseSlice: Update course rejected');
        console.log('❌ courseSlice: Error:', action.error.message);
        state.loading.update = false;
        state.error = action.error.message || 'Failed to update course';
      })
      // Create Unit
      .addCase(createUnit.pending, (state) => {
        state.loading.createUnit = true;
        state.error = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.loading.createUnit = false;
        state.units.unshift(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading.createUnit = false;
        state.error = action.error.message || 'Failed to create unit';
      })
      // Fetch Course Details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading.fetchDetails = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading.fetchDetails = false;
        state.currentCourse = action.payload;
        state.units = action.payload.units || [];
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading.fetchDetails = false;
        state.error = action.error.message || 'Failed to fetch course details';
      })
      // Fetch Units by Course
      .addCase(fetchUnitsByCourse.pending, (state) => {
        state.loading.fetchUnits = true;
        state.error = null;
      })
      .addCase(fetchUnitsByCourse.fulfilled, (state, action) => {
        state.loading.fetchUnits = false;
        state.units = action.payload.result || [];
      })
      .addCase(fetchUnitsByCourse.rejected, (state, action) => {
        state.loading.fetchUnits = false;
        state.error = action.error.message || 'Failed to fetch units';
      })
      // Create Video Lecture
      .addCase(createVideoLecture.pending, (state) => {
        state.loading.createVideoLecture = true;
        state.error = null;
      })
      .addCase(createVideoLecture.fulfilled, (state, action) => {
        state.loading.createVideoLecture = false;
        state.videoLectures.unshift(action.payload);
      })
      .addCase(createVideoLecture.rejected, (state, action) => {
        state.loading.createVideoLecture = false;
        state.error = action.error.message || 'Failed to create video lecture';
      })
      // Fetch Videos by Unit
      .addCase(fetchVideosByUnit.pending, (state) => {
        state.loading.fetchVideos = true;
        state.error = null;
      })
      .addCase(fetchVideosByUnit.fulfilled, (state, action) => {
        state.loading.fetchVideos = false;
        state.videoLectures = action.payload || [];
      })
      .addCase(fetchVideosByUnit.rejected, (state, action) => {
        state.loading.fetchVideos = false;
        state.error = action.error.message || 'Failed to fetch videos';
      })
      // Fetch Study Materials by Unit
      .addCase(fetchStudyMaterialsByUnit.pending, (state) => {
        state.loading.fetchStudyMaterials = true;
        state.error = null;
      })
      .addCase(fetchStudyMaterialsByUnit.fulfilled, (state, action) => {
        state.loading.fetchStudyMaterials = false;
        state.studyMaterials = action.payload.result || action.payload || [];
      })
      .addCase(fetchStudyMaterialsByUnit.rejected, (state, action) => {
        state.loading.fetchStudyMaterials = false;
        state.error = action.error.message || 'Failed to fetch study materials';
      })
      // Create Study Material
      .addCase(createStudyMaterial.pending, (state) => {
        state.loading.createStudyMaterial = true;
        state.error = null;
      })
      .addCase(createStudyMaterial.fulfilled, (state, action) => {
        state.loading.createStudyMaterial = false;
        state.studyMaterials.unshift(action.payload);
      })
      .addCase(createStudyMaterial.rejected, (state, action) => {
        state.loading.createStudyMaterial = false;
        state.error = action.error.message || 'Failed to create study material';
      });
  },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;