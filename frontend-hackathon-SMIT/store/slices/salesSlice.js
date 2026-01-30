import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    // add reducers if needed
  },
});

export default salesSlice.reducer;
