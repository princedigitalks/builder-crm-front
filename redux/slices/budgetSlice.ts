import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface BudgetState {
  budgets: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/budget');
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budget/create',
  async (data: { label: string; minAmount: number; maxAmount: number }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/budget', data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/update',
  async ({ id, ...data }: { id: string; label: string; minAmount: number; maxAmount: number }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/budget/${id}`, data);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/budget/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => { state.loading = true; })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
        state.budgets.sort((a, b) => a.minAmount - b.minAmount);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const idx = state.budgets.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.budgets[idx] = action.payload;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(b => b._id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
