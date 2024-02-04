import { dialog, ipcMain, IpcMainInvokeEvent, OpenDialogReturnValue } from 'electron'
import { PlaylistRow, PlaylistSongDataRow, PlaylistSongRow, SongRow, SQLAction } from 'electron/interfaces/express/ResponseBody'
import { 
  AddSongToPlaylistArgs, CreatePlaylistArgs, DeletePlaylistArgs, DeleteSongFromAppArgs, 
  DeleteSongInPlaylistArgs, EditMetadataArgs, EditPlaylistArgs, ExportSongsArgs, GetSongsInPlaylistArgs,
  Song, SongIDsArgs, SongNameArgs, SongURLArgs, SwitchPlaylistOrderArgs, SwitchSongOrderArgs 
} from 'electron/interfaces/electron/electronHandlerInputs'

import * as fs from "fs"
import * as SoundCloud from "soundcloud-scraper"
import { changeSongMetadata, downloadThumbnail, editMp3CoverArt, fetchData, workingDir } from './utils'

type HandlerFunction<T> = (event: IpcMainInvokeEvent, args: any) => Promise<T>

const handleIpcWithTryCatch = <T>(channel: string, handler: HandlerFunction<T>): void => {
  ipcMain.handle(channel, async (event, args) => {
    try {
      return await handler(event, args)
    } catch (err) {
      console.error(`Error in ${channel} handler:`, err)
      throw new Error(`Failed to handle ${channel}`)
    }
  })
}

export const applyElectronHandlers = () => {
  handleIpcWithTryCatch<OpenDialogReturnValue>('open-file-dialog', 
    async (event: Electron.IpcMainInvokeEvent, args: object) => {
      const result: OpenDialogReturnValue = await dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
              { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
          ]
      })
      return result
  })

  handleIpcWithTryCatch<Song[]>('search-song', 
    async (event: Electron.IpcMainInvokeEvent, args: SongNameArgs) => {
      const client: SoundCloud.Client = new SoundCloud.Client()
      const searchResults: SoundCloud.SearchResult[] = await client.search(args.name,'track')

      const songs: SoundCloud.Song[] = await Promise.all(
          searchResults.map(async(song: SoundCloud.SearchResult) => await client.getSongInfo(song.url))
      )
      const songData = songs.map((song: SoundCloud.Song) => {
          return {
              artist: song.author.name,
              duration: song.duration,
              id: song.id,
              likes: song.likes,
              thumbnail: song.thumbnail,
              title: song.title,
              url: song.url
          } as Song
      })
      return songData
  })

  handleIpcWithTryCatch<SongRow[]>('download-song', 
    async (event: Electron.IpcMainInvokeEvent, args: SongURLArgs) => {
      const client = new SoundCloud.Client()
      const song: SoundCloud.Song = await client.getSongInfo(args.songURL)
  
      const stream = song.trackURL.endsWith('/stream/progressive')
          ? await song.downloadProgressive()
          : await song.downloadHLS()
  
      const data: SongRow[] = await fetchData<SongRow[]>(`http://localhost:11738/songs`,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              title: song.title,
              artist: song.author.name,
              duration_seconds: song.duration
          }),
      }) 
  
      const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${data[0].song_id}.mp3`))
      writer.on("finish", async () => await downloadThumbnail(data[0].song_id, song.thumbnail))
      return data
  })

  handleIpcWithTryCatch<SongRow[]>('get-mp3-metadata', 
    async (event: Electron.IpcMainInvokeEvent, args: SongIDsArgs) => {
      const promises: Promise<SongRow[]>[] = args.song_ids.map((song_id: number) => fetchData<SongRow[]>(`http://localhost:11738/songs/${song_id}`))
      const results: SongRow[][] = await Promise.all(promises)
      return results.map(result => result[0])
  })

  handleIpcWithTryCatch<SongRow[]>('get-songs', 
    async (event: Electron.IpcMainInvokeEvent, args: object) => {
      return await fetchData<SongRow[]>(`http://localhost:11738/songs`)
  })

  handleIpcWithTryCatch<SongRow[]>('edit-mp3-metadata', 
    async (event: Electron.IpcMainInvokeEvent, args: EditMetadataArgs) => {
      return await fetchData<SongRow[]>(`http://localhost:11738/songs/${args.song_id}`,{
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: args.title,
            artist: args.artist
          }),
      })
  })

  handleIpcWithTryCatch<SongRow[]>('delete-song-from-app', 
    async (event: Electron.IpcMainInvokeEvent, args: DeleteSongFromAppArgs) => {
      fs.unlinkSync(`${workingDir}/songs/${args.song_id}.mp3`)
      fs.unlinkSync(`${workingDir}/images/${args.song_id}.png`)
      return await fetchData<SongRow[]>(`http://localhost:11738/songs/${args.song_id}`,{
          method: 'DELETE',
      })
  })

  handleIpcWithTryCatch<void>('switch-song-order', 
    async (event: Electron.IpcMainInvokeEvent, args: SwitchSongOrderArgs) => {
      const data = await fetchData<SQLAction>(`http://localhost:11738/songs/${args.song_id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: args.from,
          to: args.to
        }),
      })
  })

  handleIpcWithTryCatch<PlaylistRow[]>('get-playlists', 
    async (event: Electron.IpcMainInvokeEvent, args: object) => {
      return await fetchData<PlaylistRow[]>(`http://localhost:11738/playlists`)
  })

  handleIpcWithTryCatch<PlaylistRow[]>('create-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: CreatePlaylistArgs) => {
      return await fetchData<PlaylistRow[]>(`http://localhost:11738/playlists`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: args.name }),
      })
  })

  handleIpcWithTryCatch<PlaylistRow[]>('edit-playlist-name', 
    async (event: Electron.IpcMainInvokeEvent, args: EditPlaylistArgs) => {
      return await fetchData<PlaylistRow[]>(`http://localhost:11738/playlists/${args.playlist_id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newName: args.name }),
      })
  })

  handleIpcWithTryCatch<PlaylistRow[]>('delete-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: DeletePlaylistArgs) => {
      return await fetchData<PlaylistRow[]>(`http://localhost:11738/songs/${args.playlist_id}`,{
          method: 'DELETE',
      })
  })

  handleIpcWithTryCatch<PlaylistSongDataRow[]>('get-songs-in-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: GetSongsInPlaylistArgs) => {
      return await fetchData<PlaylistSongDataRow[]>(`http://localhost:11738/playlistSongs/${args.playlist_id}`)
  })

  handleIpcWithTryCatch<PlaylistSongRow[]>('add-song-to-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: AddSongToPlaylistArgs) => {
      return await fetchData<PlaylistSongRow[]>(`http://localhost:11738/playlistSongs`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playlist_id: args.playlist_id,
            song_id: args.song_id
          }),
      })
  })

  handleIpcWithTryCatch<void>('switch-playlist-order', 
    async (event: Electron.IpcMainInvokeEvent, args: SwitchPlaylistOrderArgs) => {
      const data = await fetchData<SQLAction>(`http://localhost:11738/playlistSongs/${args.playlist_id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: args.from,
          to: args.to
        }),
      })
  })

  handleIpcWithTryCatch<PlaylistSongRow[]>('delete-song-in-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: DeleteSongInPlaylistArgs) => {
      return await fetchData<PlaylistSongRow[]>(`http://localhost:11738/songs/${args.playlist_id}/${args.song_id}`,{
          method: 'DELETE',
      })
  })

  handleIpcWithTryCatch<PlaylistSongRow[]>('delete-song-in-playlist', 
    async (event: Electron.IpcMainInvokeEvent, args: DeleteSongInPlaylistArgs) => {
      return await fetchData<PlaylistSongRow[]>(`http://localhost:11738/songs/${args.playlist_id}/${args.song_id}`,{
          method: 'DELETE',
      })
  })

  handleIpcWithTryCatch<OpenDialogReturnValue>('open-folder-dialog', 
    async (event: Electron.IpcMainInvokeEvent, args: object) => {
      const result: OpenDialogReturnValue = await dialog.showOpenDialog({
          properties: ['openDirectory']
      })
      return result
  })

  handleIpcWithTryCatch<void>('export-songs', 
    async (event: Electron.IpcMainInvokeEvent, args: ExportSongsArgs) => {
      args.song_ids.forEach(async(song_id: number) => {
        const data: SongRow[] = await fetchData<SongRow[]>(`http://localhost:11738/songs/${song_id}`)
        const newMP3FileName = `${data[0].title}.mp3`
        const originalMP3File = `${workingDir}/songs/${song_id}.mp3`
        const originalImageFile = `${workingDir}/images/${song_id}.png`

        if(fs.existsSync(newMP3FileName)) {
          fs.unlinkSync(newMP3FileName)
        }
        fs.copyFileSync(originalMP3File, newMP3FileName)
        editMp3CoverArt(newMP3FileName,originalImageFile)
        changeSongMetadata(newMP3FileName,data[0].artist)
      })
  })
}
