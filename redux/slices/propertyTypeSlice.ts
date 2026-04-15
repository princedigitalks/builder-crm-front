import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface PropertyTypeState {
  propertyTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyTypeState = {
  propertyTypes: [],
  loading: false,
  error: null,
};

export const fetchPropertyTypes = createAsyncThunk(
  'propertyType/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/property-type');
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const createPropertyType = createAsyncThunk(
  'propertyType/create',
  async (data: { name: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/property-type', data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create');
    }
  }
);

export const updatePropertyType = createAsyncThunk(
  'propertyType/update',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/property-type/${id}`, { name });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update');
    }
  }
);

export const deletePropertyType = createAsyncThunk(
  'propertyType/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/property-type/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

const propertyTypeSlice = createSlice({
  name: 'propertyType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyTypes.pending, (state) => { state.loading = true; })
      .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.propertyTypes = action.payload;
      })
      .addCase(fetchPropertyTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPropertyType.fulfilled, (state, action) => {
        state.propertyTypes.push(action.payload);
      })
      .addCase(updatePropertyType.fulfilled, (state, action) => {
        const idx = state.propertyTypes.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.propertyTypes[idx] = action.payload;
      })
      .addCase(deletePropertyType.fulfilled, (state, action) => {
        state.propertyTypes = state.propertyTypes.filter(r => r._id !== action.payload);
      });
  },
});

export default propertyTypeSlice.reducer;
