import { ipcMain, dialog, OpenDialogReturnValue } from 'electron'
import { AddSongToPlaylistArgs, ChangePlaylistNameArgs, DeletePlaylistSongArgs, Mp3Metadata, PlaylistNameArgs, ReorderSongsArgs, Song, SongNameArgs, SongURLArgs } from '../interfaces/electron/electronHandlerInputs'
import { downloadThumbnail, editMp3Metadata, getImgPathFromURL, initDirs, workingDir, fetchData} from './utils'
import { PlaylistName, PlaylistSongsNames, SongOrder, SongTitle } from '../interfaces/express/ResponseBody'

import * as fs from "fs"
import * as mm from "music-metadata"
import * as SoundCloud from "soundcloud-scraper"

initDirs()

export const applyElectronHandlers = () => {
    ipcMain.handle('open-file-dialog', async (event: Electron.IpcMainInvokeEvent): Promise<OpenDialogReturnValue> => {
        try{
            const result: OpenDialogReturnValue = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            })
            return result
        } catch (err) {
            console.error('Error in search-song handler:', err)
            throw new Error('Failed to Open File Dialog')
        }
    })

    ipcMain.handle('search-song', async (event: Electron.IpcMainInvokeEvent, args: SongNameArgs): Promise<Song[]> => {
        try {
            const client: SoundCloud.Client = new SoundCloud.Client()
            const searchResults: SoundCloud.SearchResult[] = await client.search(args.songName,'track')

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
        } catch (err) {
            console.error('Error in search-song handler:', err)
            throw new Error('Failed to Get Search Results')
        }
        
    })

    ipcMain.handle('download-song', async (event: Electron.IpcMainInvokeEvent, args: SongURLArgs): Promise<void> => {
        try {
            return new Promise<void> (async resolve => {
                const client: SoundCloud.Client = new SoundCloud.Client()
                const song: SoundCloud.Song = await client.getSongInfo(args.songURL)
    
                const stream = await song.downloadProgressive()
                const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`))
                writer.on("finish", async() => { 
                    await downloadThumbnail(song.title,song.thumbnail)
                    
                    const metadata: Mp3Metadata = {
                        title: song.title,
                        imgPath: `${workingDir}/images/${song.title}.png`,
                        artist: null
                    }
                    await editMp3Metadata(metadata)
                    
                    resolve() 
                })
            })
        } catch (err) {
            console.error('Error in download-song handler:', err)
            throw new Error('Failed to Download Song')
        }
    })

    ipcMain.handle('get-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, args: SongNameArgs): Promise<Mp3Metadata> => {
        try {
            const path = `${workingDir}/songs/${args.songName}.mp3`
            const response: mm.IAudioMetadata = await mm.parseFile(path)
            const common = response.common
            let metadata: Mp3Metadata = { 
                title: args.songName, 
                artist: null, 
                imgPath: `http://localhost:11738/songImages/${encodeURIComponent(args.songName)}.png` 
            }
            if(common.artist) { 
                metadata.artist = common.artist 
            }
            return metadata
        } catch (err) {
            console.error('Error in get-mp3-metadata:', err)
            throw new Error('Failed to Get Mp3 Metadata')
        }
    })

    ipcMain.handle('get-all-songs', async (event: Electron.IpcMainInvokeEvent, args = {}): Promise<SongTitle[]> => {
        try {
            const data = await fetchData<SongTitle[]>(`http://localhost:11738/songs`)
            return data
        } catch (err) {
            console.error('Error in get-all-songs:', err)
            throw new Error('Failed to Get All Songs')
        }
    })

    ipcMain.handle('edit-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, args: Mp3Metadata): Promise<void> => {
        try {
            return await editMp3Metadata(args)
        } catch (err) {
            console.error('Error in edit-mp3-metadata:', err)
            throw new Error('Failed to Edit Mp3 Metadata')
        }
    })

    ipcMain.handle('delete-song-from-computer', async (event: Electron.IpcMainInvokeEvent, args: SongNameArgs): Promise<SongTitle[]> => {
        try {
            fs.unlinkSync(`${workingDir}/songs/${args.songName}.mp3`)
            fs.unlinkSync(`${workingDir}/images/${args.songName}.png`)
            const data = await fetchData<SongTitle[]>(`http://localhost:11738/songs/${args.songName}`,{
                method: 'DELETE'
            })
            return data
        } catch (err) {
            console.error('Error in delete-song-from-computer:', err)
            throw new Error('Failed to Delete Song From Computer')
        }
    })

    ipcMain.handle('get-playlists', async (event: Electron.IpcMainInvokeEvent, args = {}): Promise<PlaylistName[]> => {
        try {
            console.log('Handler for get-playlists is called');
            const data = await fetchData<PlaylistName[]>('http://localhost:11738/playlists')
            return data
        } catch (err) {
            console.error('Error in get-playlists:', err)
            throw new Error('Failed to Get All Playlists')
        }
    })

    ipcMain.handle('create-playlist', async (event: Electron.IpcMainInvokeEvent, args: PlaylistNameArgs): Promise<PlaylistName[]> => {
        try {
            const data = await fetchData<PlaylistName[]>(`http://localhost:11738/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: args.playlistName }),
            })
            return data
        } catch (err) {
            console.error('Error in create-playlist:', err)
            throw new Error('Failed to Create Playlist')
        }
    })

    ipcMain.handle('edit-playlist-name', async (event: Electron.IpcMainInvokeEvent, args: ChangePlaylistNameArgs): Promise<PlaylistName[]> => {
        try {
            const data = await fetchData<PlaylistName[]>(`http://localhost:11738/playlists/${args.oldPlaylistName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName: args.newPlaylistName }),
            })
            return data
        } catch (err) {
            console.error('Error in edit-playlist-name:', err)
            throw new Error('Failed to Edit Playlist Name')
        }
    })

    ipcMain.handle('delete-playlist', async (event: Electron.IpcMainInvokeEvent, args: PlaylistNameArgs): Promise<PlaylistName[]> => {
        try {
            const data = await fetchData<PlaylistName[]>(`http://localhost:11738/playlists/${args.playlistName}`, {
                method: 'DELETE',
            })
            return data
        } catch (err) {
            console.error('Error in delete-playlist:', err)
            throw new Error('Failed to Delete Playlist')
        }
    })

    ipcMain.handle('get-songs-in-playlist', async (event: Electron.IpcMainInvokeEvent, args: PlaylistNameArgs): Promise<SongOrder[]> => {
        try {
            const data = await fetchData<SongOrder[]>(`http://localhost:11738/playlistSongs/${args.playlistName}`)
            return data
        } catch (err) {
            console.error('Error in get-songs-in-playlist:', err)
            throw new Error('Failed to Get Songs In Playlist')
        }
    })

    ipcMain.handle('add-song-to-playlist', async (event: Electron.IpcMainInvokeEvent, args: AddSongToPlaylistArgs): Promise<PlaylistSongsNames[]> => {
        try {
            const data = await fetchData<PlaylistSongsNames[]>(`http://localhost:11738/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    songTitle: args.songTitle, 
                    playlistName: args.playlistName, 
                    songOrder: args.songOrder 
                }),
            })
            return data
        } catch (err) {
            console.error('add-song-to-playlist:', err)
            throw new Error('Failed to Add Songs to Playlist')
        }
    })

    ipcMain.handle('edit-song-order', async (event: Electron.IpcMainInvokeEvent, args: ReorderSongsArgs): Promise<SongOrder[]> => {
        try {
            const data = await fetchData<SongOrder[]>(`http://localhost:11738/playlists/${args.playlistName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songOrderings: args.songOrderings }),
            })
            return data
        } catch (err) {
            console.error('Error in edit-song-order:', err)
            throw new Error('Failed to Edit Song Order')
        }
    })

    ipcMain.handle('delete-song-in-playlist', async (event: Electron.IpcMainInvokeEvent, args: DeletePlaylistSongArgs): Promise<PlaylistSongsNames[]> => {
        try {
            const data = await fetchData<PlaylistSongsNames[]>(`http://localhost:11738/playlists/${args.playlistName}/${args.songTitle}`, {
                method: 'DELETE',
            })
            return data
        } catch (err) {
            console.error('Error in delete-song-in-playlist:', err)
            throw new Error('Failed to Delete Song In Playlist')
        }
    })
}