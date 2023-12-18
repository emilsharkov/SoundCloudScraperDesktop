import { configureStore } from '@reduxjs/toolkit'
import currentSongReducer from './Slices/currentSongSlice'
import isPlayingReducer from './Slices/isPlayingSlice'
import replayingTypeReducer from './Slices/replayingTypeSlice'
import songsReducer from './Slices/songsSlice'
import currentRouteReducer from './Slices/currentRouteSlice'
import toastErrorSlice from './Slices/toastErrorSlice'
import audioSlice from './Slices/audioSlice'

const store = configureStore({
  reducer: {
    currentSong: currentSongReducer,
    isPlaying: isPlayingReducer,
    replayingType: replayingTypeReducer,
    songs: songsReducer,
    currentRoute: currentRouteReducer,
    toastError: toastErrorSlice,
    audio: audioSlice,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch