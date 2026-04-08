import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface LeadStatusState {
  statuses: any[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadStatusState = {
  statuses: [],
  loading: false,
  error: null,
};

export const fetchStatuses = createAsyncThunk(
  'leadStatus/fetchStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead-status');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statuses');
    }
  }
);

export const createStatus = createAsyncThunk(
  'leadStatus/createStatus',
  async (statusData: { name: string; color: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/lead-status', statusData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create status');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'leadStatus/updateStatus',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/lead-status/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const reorderStatuses = createAsyncThunk(
  'leadStatus/reorderStatuses',
  async (orderings: { id: string; order: number }[], { rejectWithValue }) => {
    try {
      await axios.put('/lead-status/reorder', { orderings });
      return orderings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder statuses');
    }
  }
);

export const deleteStatus = createAsyncThunk(
  'leadStatus/deleteStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/lead-status/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete status');
    }
  }
);

const leadStatusSlice = createSlice({
  name: 'leadStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.statuses.push(action.payload);
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.statuses.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.statuses[index] = action.payload;
        }
      })
      .addCase(reorderStatuses.fulfilled, (state, action) => {
        action.payload.forEach((item) => {
          const status = state.statuses.find((s) => s._id === item.id);
          if (status) status.order = item.order;
        });
        state.statuses.sort((a, b) => a.order - b.order);
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.statuses = state.statuses.filter((s) => s._id !== action.payload);
      });
  },
});

export default leadStatusSlice.reducer;
