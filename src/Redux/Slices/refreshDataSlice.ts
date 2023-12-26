import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RefreshDataState {
  downloads: boolean;
  playlists: boolean;
  playlist: boolean;
}

const initialState: RefreshDataState = {
  downloads: false,
  playlists: false,
  playlist: false,
}

export const refreshDataSlice = createSlice({
  name: 'refreshData',
  initialState,
  reducers: {
    refreshDownloads: (state, action: PayloadAction<void>) => {
      state.downloads = !state.downloads
    },
    refreshPlaylists: (state, action: PayloadAction<void>) => {
      state.playlists = !state.playlists
    },
    refreshPlaylist: (state, action: PayloadAction<void>) => {
      state.playlist = !state.playlist
    },
  },
})

export const { refreshDownloads,refreshPlaylists,refreshPlaylist } = refreshDataSlice.actions

export default refreshDataSlice.reducer