import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createAvailability, getAvailability } from '../services/availabilityService';

interface AvailabilityItem {
  id: string;
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AvailabilityState {
  availabilities: AvailabilityItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  availabilities: [],
  loading: false,
  error: null,
};

export const saveAvailability = createAsyncThunk(
  'availability/save',
  async (availabilityData: { dayOfWeek: string; startTime: string; endTime: string }) => {
    const response = await createAvailability(availabilityData);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

export const fetchAvailabilities = createAsyncThunk(
  'availability/fetch',
  async () => {
    const response = await getAvailability();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availabilities.push(action.payload);
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save availability';
      })
      .addCase(fetchAvailabilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailabilities.fulfilled, (state, action) => {
        state.loading = false;
        state.availabilities = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(fetchAvailabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch availabilities';
      });
  },
});

export const { clearError } = availabilitySlice.actions;
export default availabilitySlice.reducer;