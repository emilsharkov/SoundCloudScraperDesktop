import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface QueueState {
  defaultQueue: string[];
  musicQueue: string[];
}

const initialState: QueueState = {
  defaultQueue: [],
  musicQueue: ['Clovis Reyes - Fluxxwave (Ultra Slowed)',`I'LL KILL THEM ALL - EREN YEAGER - AOT × FLARE -HENSONN (SLOWED)`]
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setDefaultQueue: (state, action: PayloadAction<string[]>) => {
      state.defaultQueue = action.payload
    },
    setMusicQueue: (state, action: PayloadAction<string[]>) => {
      state.musicQueue = action.payload
    },
  },
})

export const { setDefaultQueue,setMusicQueue } = queueSlice.actions

export default queueSlice.reducer