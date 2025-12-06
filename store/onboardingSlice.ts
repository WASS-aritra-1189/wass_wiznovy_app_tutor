import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubjects, getCountries, getCities, getLanguages } from '../services/onboardingService';
import { getMyAvailability } from '../services/availabilityService';

interface OnboardingState {
  subjects: any[];
  countries: any[];
  cities: any[];
  languages: any[];
  savedAvailability: any[];
  loading: {
    subjects: boolean;
    countries: boolean;
    cities: boolean;
    languages: boolean;
    availability: boolean;
  };
  error: string | null;
}

const initialState: OnboardingState = {
  subjects: [],
  countries: [],
  cities: [],
  languages: [],
  savedAvailability: [],
  loading: {
    subjects: false,
    countries: false,
    cities: false,
    languages: false,
    availability: false,
  },
  error: null,
};

export const fetchSubjects = createAsyncThunk(
  'onboarding/fetchSubjects',
  async () => {
    const result = await getSubjects(50, 0);
    if (result.success && result.data) {
      return result.data.result || result.data;
    }
    throw new Error('Failed to fetch subjects');
  }
);

export const fetchCountries = createAsyncThunk(
  'onboarding/fetchCountries',
  async () => {
    const result = await getCountries(50, 0);
    if (result.success && result.data) {
      return result.data.result || result.data;
    }
    throw new Error('Failed to fetch countries');
  }
);

export const fetchCities = createAsyncThunk(
  'onboarding/fetchCities',
  async (countryId: string) => {
    const result = await getCities(countryId, 50, 0);
    if (result.success && result.data) {
      return result.data.result || result.data;
    }
    throw new Error('Failed to fetch cities');
  }
);

export const fetchLanguages = createAsyncThunk(
  'onboarding/fetchLanguages',
  async () => {
    const result = await getLanguages(50, 0);
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Failed to fetch languages');
  }
);

export const fetchMyAvailability = createAsyncThunk(
  'onboarding/fetchMyAvailability',
  async () => {
    const result = await getMyAvailability(10, 0);
    if (result.success && result.data) {
      return result.data.result || [];
    }
    throw new Error('Failed to fetch availability');
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    clearCities: (state) => {
      state.cities = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading.subjects = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading.subjects = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading.subjects = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      })
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading.countries = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading.countries = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading.countries = false;
        state.error = action.error.message || 'Failed to fetch countries';
      })
      // Cities
      .addCase(fetchCities.pending, (state) => {
        state.loading.cities = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading.cities = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error = action.error.message || 'Failed to fetch cities';
      })
      // Languages
      .addCase(fetchLanguages.pending, (state) => {
        state.loading.languages = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading.languages = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading.languages = false;
        state.error = action.error.message || 'Failed to fetch languages';
      })
      // Availability
      .addCase(fetchMyAvailability.pending, (state) => {
        state.loading.availability = true;
        state.error = null;
      })
      .addCase(fetchMyAvailability.fulfilled, (state, action) => {
        state.loading.availability = false;
        state.savedAvailability = action.payload;
      })
      .addCase(fetchMyAvailability.rejected, (state, action) => {
        state.loading.availability = false;
        state.error = action.error.message || 'Failed to fetch availability';
      });
  },
});

export const { clearCities, clearError } = onboardingSlice.actions;
export default onboardingSlice.reducer;