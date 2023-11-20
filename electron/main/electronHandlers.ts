import { ipcMain, dialog } from 'electron'
import { SongSuggestion } from '../interfaces/electron/SongSuggestion'
import { Song } from '../interfaces/electron/Song'
import { Mp3Metadata } from '../interfaces/electron/Mp3Metadata'
import { downloadThumbnail, editMp3Metadata, getImgPathFromURL, initDirs, workingDir} from './utils'
import { PlaylistName, PlaylistSongsNames, SongOrder, SongTitle } from '../interfaces/express/ResponseBody'
import { ErrorResponse } from '../interfaces/express/Error'
import { PutPlaylistSongBodyItem } from '../interfaces/express/RequestBody'

const fs = require('fs')
const mm = require("music-metadata")
const SoundCloud = require("soundcloud-scraper")
initDirs()

export const applyElectronHandlers = () => {
    ipcMain.handle('open-file-dialog', async (event: Electron.IpcMainInvokeEvent) => {
        try{
            const result = await dialog.showOpenDialog({
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

    ipcMain.handle('search-song', async (event: Electron.IpcMainInvokeEvent, songName: string) => {
        try {
            const client = new SoundCloud.Client()
            const songs: Song[] = await client.search(songName)
            const songSuggestions: SongSuggestion[] = await Promise.all(
                songs.map(async(song: Song) => {
                    return song.type == 'track' ? await client.getSongInfo(song.url): null
                }
            ))
    
            return songSuggestions.filter(song => song !== null)
        } catch (err) {
            console.error('Error in search-song handler:', err)
            throw new Error('Failed to Get Search Results')
        }
        
    })

    ipcMain.handle('download-song', async (event: Electron.IpcMainInvokeEvent, songURL: string) => {
        try {
            return new Promise<void> (async resolve => {
                const client = new SoundCloud.Client()
                const song = await client.getSongInfo(songURL)
    
                const stream = await song.downloadProgressive()
                const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`))
                writer.on("finish", async() => { 
                    await downloadThumbnail(song.title,song.thumbnail)
                    
                    const metadata: Mp3Metadata = {
                        title: song.title,
                        imgPath: getImgPathFromURL(song.title,song.thumbnail),
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

    ipcMain.handle('get-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, songName: string) => {
        try {
            const path = `${workingDir}/songs/${songName}.mp3`
            return await mm.parseFile(path, { native: true })
        } catch (err) {
            console.error('Error in get-mp3-metadata:', err)
            throw new Error('Failed to Get Mp3 Metadata')
        }
    })

    ipcMain.handle('edit-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, metadata: Mp3Metadata) => {
        try {
            return await editMp3Metadata(metadata)
        } catch (err) {
            console.error('Error in edit-mp3-metadata:', err)
            throw new Error('Failed to Edit Mp3 Metadata')
        }
    })

    ipcMain.handle('delete-song-from-computer', async (event: Electron.IpcMainInvokeEvent, songTitle: string) => {
        try {
            fs.unlinkSync(`${workingDir}/songs/${songTitle}.mp3`)
            fs.unlinkSync(`${workingDir}/images/${songTitle}.png`)
            const response = await fetch(`http://localhost:11738/songs/${songTitle}`,{
                method: 'DELETE'
            })

            const data: SongTitle[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in delete-song-from-computer:', err)
            throw new Error('Failed to Delete Song From Computer')
        }
    })

    ipcMain.on('get-playlists', async (event: Electron.IpcMainInvokeEvent) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists`)

            const data: PlaylistName[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in get-playlists:', err)
            throw new Error('Failed to Get All Playlists')
        }
    })

    ipcMain.on('create-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playlistName }),
            })

            const data: PlaylistName[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in create-playlist:', err)
            throw new Error('Failed to Create Playlist')
        }
    })

    ipcMain.on('edit-playlist-name', async (event: Electron.IpcMainInvokeEvent, oldPlaylistName: string, newPlaylistName: string) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists/${oldPlaylistName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName: newPlaylistName }),
            })

            const data: PlaylistName[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in edit-playlist-name:', err)
            throw new Error('Failed to Edit Playlist Name')
        }
    })

    ipcMain.on('delete-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists/${playlistName}`, {
                method: 'DELETE',
            })

            const data: PlaylistName[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in delete-playlist:', err)
            throw new Error('Failed to Delete Playlist')
        }
    })

    ipcMain.on('get-songs-in-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string) => {
        try {
            const response = await fetch(`http://localhost:11738/playlistSongs/${playlistName}`)

            const data: SongOrder[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in get-songs-in-playlist:', err)
            throw new Error('Failed to Get Songs In Playlist')
        }
    })

    ipcMain.on('add-song-to-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string, songTitle: string, songOrder: number) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songTitle, playlistName, songOrder }),
            })

            const data: PlaylistSongsNames[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('add-song-to-playlist:', err)
            throw new Error('Failed to Add Songs to Playlist')
        }
    })

    ipcMain.on('edit-song-order', async (event: Electron.IpcMainInvokeEvent, playlistName: string, songOrderings: PutPlaylistSongBodyItem[]) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists/${playlistName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songOrderings }),
            })

            const data: SongOrder[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in edit-song-order:', err)
            throw new Error('Failed to Edit Song Order')
        }
    })

    ipcMain.on('delete-song-in-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string, songTitle: string) => {
        try {
            const response = await fetch(`http://localhost:11738/playlists/${playlistName}/${songTitle}`, {
                method: 'DELETE',
            })

            const data: PlaylistSongsNames[] | ErrorResponse = await response.json()
            if('error' in data) {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error in delete-song-in-playlist:', err)
            throw new Error('Failed to Delete Song In Playlist')
        }
    })
}