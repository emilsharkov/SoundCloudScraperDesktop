import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ShuffledState {
  value: boolean
}

const initialState: ShuffledState = {
  value: false,
}

export const isShuffledSlice = createSlice({
  name: 'isShuffled',
  initialState,
  reducers: {
    setIsShuffled: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

export const { setIsShuffled } = isShuffledSlice.actions

export const selectIsShuffled = (state: RootState) => state.isShuffled.value

export default isShuffledSlice.reducer