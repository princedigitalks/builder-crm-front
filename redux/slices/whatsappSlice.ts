import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';
import { RootState } from '../store';

interface Whatsapp {
  _id: string;
  name: string;
  number: string;
  isActive: boolean;
  whatsappStatus?: 'connected' | 'disconnected';
  chatbotStatus?: 'active' | 'inactive';
  deleteRequested?: boolean;
  createdAt: string;
}

interface WhatsappState {
  whatsappList: Whatsapp[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

const initialState: WhatsappState = {
  whatsappList: [],
  loading: false,
  error: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  }
};

export const fetchWhatsapp = createAsyncThunk(
  'whatsapp/fetchWhatsapp',
  async ({ page = 1, limit = 10, search = '' }: { page?: number, limit?: number, search?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.get(`/whatsapp?page=${page}&limit=${limit}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch WhatsApp numbers');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const addWhatsapp = createAsyncThunk(
  'whatsapp/addWhatsapp',
  async (whatsappData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.post('/whatsapp', whatsappData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to add WhatsApp number');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const updateWhatsapp = createAsyncThunk(
  'whatsapp/updateWhatsapp',
  async ({ id, data }: { id: string, data: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.put(`/whatsapp/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to update WhatsApp number');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const deleteWhatsapp = createAsyncThunk(
  'whatsapp/deleteWhatsapp',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await axios.delete(`/whatsapp/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'Success') {
        return id;
      }
      return rejectWithValue(response.data.message || 'Failed to delete WhatsApp number');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    syncStatusUpdate: (state, action: { payload: { whatsappId: string; whatsappStatus: string; chatbotStatus: string } }) => {
      const { whatsappId, whatsappStatus, chatbotStatus } = action.payload;
      const index = state.whatsappList.findIndex(w => w._id === whatsappId);
      if (index !== -1) {
        state.whatsappList[index] = {
          ...state.whatsappList[index],
          whatsappStatus: whatsappStatus as any,
          chatbotStatus: chatbotStatus as any
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhatsapp.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWhatsapp.fulfilled, (state, action) => {
        state.loading = false;
        state.whatsappList = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchWhatsapp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addWhatsapp.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWhatsapp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addWhatsapp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWhatsapp.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWhatsapp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateWhatsapp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWhatsapp.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWhatsapp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteWhatsapp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { syncStatusUpdate } = whatsappSlice.actions;
export default whatsappSlice.reducer;
