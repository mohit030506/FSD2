import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  ids: ['twitter', 'linkedin', 'instagram', 'facebook'],
  entities: {
    twitter: { id: 'twitter', name: 'Twitter / X', color: '#38bdf8', icon: 'Twitter', count: 1 },
    linkedin: { id: 'linkedin', name: 'LinkedIn', color: '#0ea5e9', icon: 'Linkedin', count: 1 },
    instagram: { id: 'instagram', name: 'Instagram', color: '#f43f5e', icon: 'Instagram', count: 1 },
    facebook: { id: 'facebook', name: 'Facebook', color: '#3b82f6', icon: 'Facebook', count: 1 },
  }
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    updatePlatformCount(state, action) {
      const { platformId, change } = action.payload;
      const platform = state.entities[platformId];
      if (platform) {
        platform.count = Math.max(0, (platform.count || 0) + change);
      }
    }
  }
});

export const { updatePlatformCount } = platformsSlice.actions;

// Base platform selector
const selectPlatformsState = state => state.platforms;

// Memoized selector for all platforms
export const selectAllPlatforms = createSelector(
  [selectPlatformsState],
  (platforms) => platforms.ids.map(id => platforms.entities[id])
);

// Memoized selector for single platform by ID
export const selectPlatformById = createSelector(
  [selectPlatformsState, (state, id) => id],
  (platforms, id) => platforms.entities[id]
);

export default platformsSlice.reducer;
