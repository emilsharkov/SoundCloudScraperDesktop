import { configureStore } from '@reduxjs/toolkit'
import isPlayingReducer from './Slices/isPlayingSlice'
import replayingTypeReducer from './Slices/replayingTypeSlice'
import currentRouteReducer from './Slices/currentRouteSlice'
import toastErrorSlice from './Slices/toastErrorSlice'
import audioSlice from './Slices/audioSlice'
import queueSlice from './Slices/queueSlice'
import queuedSongsSlice from './Slices/queuedSongsSlice'
import currentQueueIndexSlice from './Slices/currentQueueIndexSlice'
import isShuffledSlice from './Slices/isShuffledSlice'
import refreshDataSlice from './Slices/refreshDataSlice'

const store = configureStore({
  reducer: {
    isPlaying: isPlayingReducer,
    isShuffled: isShuffledSlice,
    replayingType: replayingTypeReducer,
    currentRoute: currentRouteReducer,
    toastError: toastErrorSlice,
    audio: audioSlice,
    queue: queueSlice,
    queuedSongs: queuedSongsSlice,
    currentQueueIndex: currentQueueIndexSlice,
    refreshData: refreshDataSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch