import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface PlayingState {
  value: boolean
}

const initialState: PlayingState = {
  value: false,
}

export const isPlayingSlice = createSlice({
  name: 'isPlaying',
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

export const { setIsPlaying } = isPlayingSlice.actions

export const selectIsPlaying = (state: RootState) => state.isPlaying.value

export default isPlayingSlice.reducer