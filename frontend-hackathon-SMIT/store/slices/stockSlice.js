import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
  isLoading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStocks: (state, action) => {
      state.stocks = action.payload;
    },
    addStock: (state, action) => {
      state.stocks.push(action.payload);
    },
    updateStock: (state, action) => {
      const index = state.stocks.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStocks,
  addStock,
  updateStock,
  setLoading,
  setError,
} = stockSlice.actions;

export default stockSlice.reducer;
