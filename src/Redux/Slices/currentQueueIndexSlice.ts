import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface CurrentQueueIndexState {
  value: number
}

const initialState: CurrentQueueIndexState = {
  value: 0
}

export const currentQueueIndexSlice = createSlice({
  name: 'currentQueueIndex',
  initialState,
  reducers: {
    setCurrentQueueIndex: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

export const { setCurrentQueueIndex } = currentQueueIndexSlice.actions

export const selectCurrentQueueIndex = (state: RootState) => state.currentQueueIndex.value

export default currentQueueIndexSlice.reducer