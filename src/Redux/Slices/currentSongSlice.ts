import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface CurrentSongState {
  value: string
}

const initialState: CurrentSongState = {
  value: '',
}

export const currentSongSlice = createSlice({
  name: 'currentSong',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { setCurrentSong } = currentSongSlice.actions

export const selectCurrentSong = (state: RootState) => state.currentSong.value

export default currentSongSlice.reducer