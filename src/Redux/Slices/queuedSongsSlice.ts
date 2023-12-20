import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface QueuedSongsState {
  value: string[]
}

const initialState: QueuedSongsState = {
  value: []
}

export const queuedSongsSlice = createSlice({
  name: 'queuedSongs',
  initialState,
  reducers: {
    setQueuedSongs: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload
    },
  },
})

export const { setQueuedSongs } = queuedSongsSlice.actions

export const selectQueuedSongs = (state: RootState) => state.queuedSongs.value

export default queuedSongsSlice.reducer