import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface CityAreaState {
  cities: string[];
  areas: string[];
  loading: boolean;
}

const initialState: CityAreaState = {
  cities: [],
  areas: [],
  loading: false,
};

export const fetchCities = createAsyncThunk(
  'cityArea/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/city-area/cities');
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const fetchAreasByCity = createAsyncThunk(
  'cityArea/fetchAreasByCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/city-area/areas/${encodeURIComponent(city)}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const addCityArea = createAsyncThunk(
  'cityArea/addCityArea',
  async (payload: { city: string; area?: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/city-area', payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

const cityAreaSlice = createSlice({
  name: 'cityArea',
  initialState,
  reducers: {
    clearAreas: (state) => { state.areas = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(fetchAreasByCity.pending, (state) => { state.loading = true; })
      .addCase(fetchAreasByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreasByCity.rejected, (state) => { state.loading = false; })
      .addCase(addCityArea.fulfilled, (state, action) => {
        const city = action.payload.city;
        if (!state.cities.includes(city)) {
          state.cities = [...state.cities, city].sort();
        }
        state.areas = action.payload.areas;
      });
  },
});

export const { clearAreas } = cityAreaSlice.actions;
export default cityAreaSlice.reducer;
