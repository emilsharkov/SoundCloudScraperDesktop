import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useRef } from 'react'

interface AudioState {
  value: HTMLAudioElement
}

const initialState: AudioState = {
  value: new Audio(),
}

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {},
})

export const selectAudio = (state: RootState) => state.audio.value

export default audioSlice.reducer