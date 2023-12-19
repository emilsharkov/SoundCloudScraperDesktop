import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type ReplayingType = 'NO_REPLAY' | 'REPLAY_PLAYLIST' | 'REPLAY_SONG'

interface ReplayState {
  value: ReplayingType
}

const initialState: ReplayState = {
  value: 'NO_REPLAY',
}

export const replayingTypeSlice = createSlice({
  name: 'replayingType',
  initialState,
  reducers: {
    toggleReplayingType: (state, action: PayloadAction<void>) => {
      let newReplayingType: ReplayingType | null = null
      if(state.value === 'NO_REPLAY'){
        newReplayingType = 'REPLAY_PLAYLIST'
      } else if(state.value === 'REPLAY_PLAYLIST'){
        newReplayingType = 'REPLAY_SONG'
      } else{
        newReplayingType = 'NO_REPLAY'
      }
      state.value = newReplayingType
    },
  },
})

export const { toggleReplayingType } = replayingTypeSlice.actions

export const selectReplayingType = (state: RootState) => state.replayingType.value

export default replayingTypeSlice.reducer