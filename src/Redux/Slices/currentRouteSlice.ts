import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface CurrentRouteSlice {
  value: string
}

const initialState: CurrentRouteSlice = {
  value: 'Search',
}

export const currentRouteSlice = createSlice({
  name: 'currentRoute',
  initialState,
  reducers: {
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { setCurrentRoute } = currentRouteSlice.actions

export const selectCurrentRoute = (state: RootState) => state.currentRoute.value

export default currentRouteSlice.reducer