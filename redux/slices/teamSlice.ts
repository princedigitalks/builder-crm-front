import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface TeamState {
  teams: any[];
  staffDropdown: any[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  staffDropdown: [],
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'team/fetchTeams',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/team?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const fetchStaffDropdown = createAsyncThunk(
  'team/fetchStaffDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/staff/dropdown');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff dropdown');
    }
  }
);

export const createTeam = createAsyncThunk(
  'team/createTeam',
  async (teamData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/team', teamData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'team/updateTeam',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/team/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'team/deleteTeam',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/team/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete team');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff Dropdown
      .addCase(fetchStaffDropdown.fulfilled, (state, action) => {
        state.staffDropdown = action.payload;
      })
      // Create Team
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
        state.pagination.totalRecords += 1;
      })
      // Update Team
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      // Delete Team
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t._id !== action.payload);
        state.pagination.totalRecords -= 1;
      });
  },
});

export default teamSlice.reducer;
