import { configureStore } from '@reduxjs/toolkit';
import planReducer from './slices/planSlice';
import authReducer from './slices/authSlice';
import staffReducer from './slices/staffSlice';
import teamReducer from './slices/teamSlice';
import leadStatusReducer from './slices/statusSlice';
import whatsappReducer from './slices/whatsappSlice';
import siteReducer from './slices/siteSlice';
import leadReducer from './slices/leadSlice';
import requirementTypeReducer from './slices/requirementTypeSlice';
import propertyTypeReducer from './slices/propertyTypeSlice';
import cityAreaReducer from './slices/cityAreaSlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    auth: authReducer,
    staff: staffReducer,
    team: teamReducer,
    leadStatus: leadStatusReducer,
    whatsapp: whatsappReducer,
    site: siteReducer,
    lead: leadReducer,
    requirementType: requirementTypeReducer,
    propertyType: propertyTypeReducer,
    cityArea: cityAreaReducer,
    budget: budgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
