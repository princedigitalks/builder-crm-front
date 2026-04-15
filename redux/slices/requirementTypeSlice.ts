import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface RequirementTypeState {
  requirementTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RequirementTypeState = {
  requirementTypes: [],
  loading: false,
  error: null,
};

export const fetchRequirementTypes = createAsyncThunk(
  'requirementType/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/requirement-type');
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const createRequirementType = createAsyncThunk(
  'requirementType/create',
  async (data: { name: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/requirement-type', data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create');
    }
  }
);

export const updateRequirementType = createAsyncThunk(
  'requirementType/update',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/requirement-type/${id}`, { name });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update');
    }
  }
);

export const deleteRequirementType = createAsyncThunk(
  'requirementType/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/requirement-type/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

const requirementTypeSlice = createSlice({
  name: 'requirementType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirementTypes.pending, (state) => { state.loading = true; })
      .addCase(fetchRequirementTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.requirementTypes = action.payload;
      })
      .addCase(fetchRequirementTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRequirementType.fulfilled, (state, action) => {
        state.requirementTypes.push(action.payload);
      })
      .addCase(updateRequirementType.fulfilled, (state, action) => {
        const idx = state.requirementTypes.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.requirementTypes[idx] = action.payload;
      })
      .addCase(deleteRequirementType.fulfilled, (state, action) => {
        state.requirementTypes = state.requirementTypes.filter(r => r._id !== action.payload);
      });
  },
});

export default requirementTypeSlice.reducer;
