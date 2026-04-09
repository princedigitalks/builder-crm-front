import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  site: string;
  siteId: string;
  source: 'WhatsApp' | 'Facebook' | 'Website' | 'Walk-in' | 'Referral';
  budget: string;
  stage: string;
  stageId: string;
  agent: string;
  agentId: string;
  createdAt: string;
  notes?: string;
}

interface LeadState {
  leads: Lead[];
  leadStatuses: any[];
  staffDropdown: any[];
  sitesDropdown: any[];
  siteTeamMembers: {
    leader: any;
    members: any[];
  };
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  leadStatuses: [],
  staffDropdown: [],
  sitesDropdown: [],
  siteTeamMembers: {
    leader: null,
    members: []
  },
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  },
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk(
  'lead/fetchLeads',
  async ({ page = 1, limit = 10, search = '' }: { page?: number, limit?: number, search?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lead?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadStatuses = createAsyncThunk(
  'lead/fetchLeadStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/statuses');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead statuses');
    }
  }
);

export const fetchStaffDropdown = createAsyncThunk(
  'lead/fetchStaffDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/staff-dropdown');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff dropdown');
    }
  }
);

export const fetchSitesDropdown = createAsyncThunk(
  'lead/fetchSitesDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/sites-dropdown');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites dropdown');
    }
  }
);

export const fetchSiteTeamMembers = createAsyncThunk(
  'lead/fetchSiteTeamMembers',
  async (siteId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lead/site-team-members/${siteId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch site team members');
    }
  }
);

export const createLead = createAsyncThunk(
  'lead/createLead',
  async (leadData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/lead', leadData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'lead/updateLead',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/lead/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'lead/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/lead/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Lead Statuses
      .addCase(fetchLeadStatuses.fulfilled, (state, action) => {
        state.leadStatuses = action.payload;
      })
      // Staff Dropdown
      .addCase(fetchStaffDropdown.fulfilled, (state, action) => {
        state.staffDropdown = action.payload;
      })
      // Sites Dropdown
      .addCase(fetchSitesDropdown.fulfilled, (state, action) => {
        state.sitesDropdown = action.payload;
      })
      // Site Team Members
      .addCase(fetchSiteTeamMembers.fulfilled, (state, action) => {
        state.siteTeamMembers = action.payload;
      })
      // Create Lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
        state.pagination.totalRecords += 1;
      })
      // Update Lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l._id !== action.payload);
        state.pagination.totalRecords -= 1;
      });
  },
});

export default leadSlice.reducer;