import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface AudioState {
  value: HTMLAudioElement
}

const initialState: AudioState = {
  value: new Audio(),
}

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<void>) => {
      state.value.play()
    },
    pause: (state, action: PayloadAction<void>) => {
      state.value.pause()
    },
    setCurrentSong: (state, action: PayloadAction<string>) => {
      const newSource = `http://localhost:11738/songFiles/${action.payload}.mp3`
      if(decodeURIComponent(state.value.src) !== newSource) {
        state.value.src = newSource
      }
    },
    clearSource: (state, action: PayloadAction<void>) => {
      state.value.src = ''
    },
  },
})

export const { play,pause,setCurrentSong,clearSource } = audioSlice.actions

export const selectAudio = (state: RootState) => state.audio.value

export default audioSlice.reducer