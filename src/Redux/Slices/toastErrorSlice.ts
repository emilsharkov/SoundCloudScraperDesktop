import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ErrorState {
  value: string
}

const initialState: ErrorState = {
  value: '',
}

export const toastErrorSlice = createSlice({
  name: 'toastError',
  initialState,
  reducers: {
    setToastError: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { setToastError } = toastErrorSlice.actions

export const selectError = (state: RootState) => state.toastError.value

export default toastErrorSlice.reducer