import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface QueuedSongsState {
  value: number[]
}

const initialState: QueuedSongsState = {
  value: []
}

export const queuedSongsSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    setQueuedSongs: (state, action: PayloadAction<number[]>) => {
      state.value = action.payload
    },
  },
})

export const { setQueuedSongs } = queuedSongsSlice.actions

export default queuedSongsSlice.reducer