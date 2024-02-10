import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Origin = 'Playlist' | 'Downloads'

interface QueueState {
  origin: Origin | null;
  defaultQueue: number[];
  musicQueue: number[];
  playlist_id?: number;
}

const initialState: QueueState = {
  origin: null,
  playlist_id: undefined,
  defaultQueue: [],
  musicQueue: []
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setDefaultQueue: (state, action: PayloadAction<number[]>) => {
      state.defaultQueue = action.payload
    },
    setMusicQueue: (state, action: PayloadAction<number[]>) => {
      state.musicQueue = action.payload
    },
    setOrigin: (state, action: PayloadAction<Origin | null>) => {
      state.origin = action.payload
    },
    setOriginPlaylistID : (state, action: PayloadAction<number | undefined>) => {
      state.playlist_id = action.payload
    },
  },
})

export const { setDefaultQueue,setMusicQueue,setOrigin,setOriginPlaylistID } = queueSlice.actions

export default queueSlice.reducer