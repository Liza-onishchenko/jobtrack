import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import type { JobApplication, Platform, Status } from '../../types/jobApplication';
import {
  fetchApplicationsRequest,
  createApplicationRequest,
  updateApplicationRequest,
  deleteApplicationRequest,
} from '../../api/applicationsApi';
import type { ApplicationInput } from '../../api/applicationsApi';
import type { RootState } from '../../app/store';

interface ApplicationsFilters {
  platform: Platform | '';
  status: Status | '';
}

interface ApplicationsState {
  items: JobApplication[];
  loading: boolean;
  error: string | null;
  filters: ApplicationsFilters;
}

const initialState: ApplicationsState = {
  items: [],
  loading: false,
  error: null,
  filters: { platform: '', status: '' },
};

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (_arg: void, { getState, rejectWithValue }) => {
    const { filters } = (getState() as RootState).applications;
    try {
      return await fetchApplicationsRequest({
        platform: filters.platform || undefined,
        status: filters.status || undefined,
      });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to load applications'));
    }
  },
);

export const addApplication = createAsyncThunk(
  'applications/add',
  async (data: ApplicationInput, { rejectWithValue }) => {
    try {
      return await createApplicationRequest(data);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create application'));
    }
  },
);

export const editApplication = createAsyncThunk(
  'applications/edit',
  async (
    { id, data }: { id: string; data: Partial<ApplicationInput> },
    { rejectWithValue },
  ) => {
    try {
      return await updateApplicationRequest(id, data);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update application'));
    }
  },
);

export const removeApplication = createAsyncThunk(
  'applications/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteApplicationRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete application'));
    }
  },
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setPlatformFilter: (state, action: PayloadAction<Platform | ''>) => {
      state.filters.platform = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<Status | ''>) => {
      state.filters.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string | undefined) ?? 'Failed to load applications';
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.error = (action.payload as string | undefined) ?? 'Failed to create application';
      })
      .addCase(editApplication.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(editApplication.rejected, (state, action) => {
        state.error = (action.payload as string | undefined) ?? 'Failed to update application';
      })
      .addCase(removeApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeApplication.rejected, (state, action) => {
        state.error = (action.payload as string | undefined) ?? 'Failed to delete application';
      });
  },
});

export const { setPlatformFilter, setStatusFilter } = applicationsSlice.actions;
export default applicationsSlice.reducer;
