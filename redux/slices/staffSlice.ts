import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';
import { RootState } from '../store';

interface Staff {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
  };
  staffRole: string;
  isActive: boolean;
  createdAt: string;
}

interface StaffState {
  staffList: Staff[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

const initialState: StaffState = {
  staffList: [],
  loading: false,
  error: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  }
};

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async ({ page = 1, limit = 10, search = '' }: { page?: number, limit?: number, search?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.get(`/staff?page=${page}&limit=${limit}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch staff');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const addStaff = createAsyncThunk(
  'staff/addStaff',
  async (staffData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.post('/staff', staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to add staff');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }: { id: string, data: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.put(`/staff/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to update staff');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.delete(`/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return id;
      }
      return rejectWithValue(response.data.message || 'Failed to delete staff');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default staffSlice.reducer;
