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
    setReplayingType: (state, action: PayloadAction<ReplayingType>) => {
      state.value = action.payload
    },
  },
})

export const { setReplayingType } = replayingTypeSlice.actions

export const selectReplayingType = (state: RootState) => state.counter.value

export default replayingTypeSlice.reducer