import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useRef } from 'react'

interface AudioRefState {
  value: React.MutableRefObject<HTMLAudioElement | null>
}

const initialState: AudioRefState = {
  value: useRef<HTMLAudioElement | null>(null),
}

export const audioRefSlice = createSlice({
  name: 'audioRef',
  initialState,
  reducers: {},
})

export const selectAudioRef = (state: RootState) => state.audioRef.value

export default audioRefSlice.reducer