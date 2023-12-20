import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface QueueState {
  defaultQueue: string[];
  musicQueue: string[];
}

const initialState: QueueState = {
  defaultQueue: ['Clovis Reyes - Fluxxwave (Ultra Slowed)',`I'LL KILL THEM ALL - EREN YEAGER - AOT × FLARE -HENSONN (SLOWED)`,`Jump out the house guitar remix slowed “I know what you are” Kobeni x anime villain mashup`],
  musicQueue: ['Clovis Reyes - Fluxxwave (Ultra Slowed)',`I'LL KILL THEM ALL - EREN YEAGER - AOT × FLARE -HENSONN (SLOWED)`,`Jump out the house guitar remix slowed “I know what you are” Kobeni x anime villain mashup`]
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