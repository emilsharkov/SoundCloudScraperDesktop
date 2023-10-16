import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface SongsState {
  value: string[]
}

const initialState: SongsState = {
  value: [],
}

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload
    },
  },
})

export const { setSongs } = songsSlice.actions

export const selectSongs = (state: RootState) => state.counter.value

export default songsSlice.reducer