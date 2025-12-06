import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadProfileImage, updateTutorDetails, getUserProfile } from '../services/profileService';

interface ProfileState {
  profile: any;
  loading: {
    upload: boolean;
    update: boolean;
    fetch: boolean;
  };
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: {
    upload: false,
    update: false,
    fetch: false,
  },
  error: null,
};

export const uploadImage = createAsyncThunk(
  'profile/uploadImage',
  async (imageData: { file: { uri: string; type: string; name: string } }) => {
    const result = await uploadProfileImage(imageData);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updateData: any) => {
    const result = await updateTutorDetails(updateData);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const result = await getUserProfile();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message);
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.loading.upload = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading.upload = false;
        if (state.profile?.tutorDetail) {
          state.profile.tutorDetail.profileImage = action.payload.profileImage;
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading.upload = false;
        state.error = action.error.message || 'Failed to upload image';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.update = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;