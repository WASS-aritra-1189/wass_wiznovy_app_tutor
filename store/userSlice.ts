import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile } from '../services/profileService';

interface UserProfile {
  id: string;
  phoneNumber: string;
  email: string;
  roles: string;
  status: string;
  createdAt: string;
  tutorDetail: {
    id: string;
    name: string;
    gender: string | null;
    expertiseLevel: string;
    dob: string | null;
    profileImage: string;
    profileImagePath: string;
    bio: string | null;
    averageRating: string;
    totalRatings: number;
    hourlyRate: string;
    qualifications: string;
    createdAt: string;
    updatedAt: string;
    subject: { id: string; name: string } | null;
    city: { id: string; name: string } | null;
    country: { id: string; name: string } | null;
    language: { id: string; name: string } | null;
  };
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    console.log('=== FETCHING USER PROFILE ===');
    const result = await getUserProfile();
    console.log('Profile API Result:', JSON.stringify(result, null, 2));
    if (result.success && result.data) {
      console.log('Profile Data:', JSON.stringify(result.data, null, 2));
      console.log('TutorDetail in API:', result.data.tutorDetail);
      return result.data;
    }
    console.log('Profile fetch failed:', result.message);
    throw new Error(result.message);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        console.log('=== PROFILE STORED IN REDUX ===');
        console.log('Payload:', JSON.stringify(action.payload, null, 2));
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        console.log('State after update:', JSON.stringify(state.profile, null, 2));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;