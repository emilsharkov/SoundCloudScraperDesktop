import { ipcMain, dialog } from 'electron'
import { SongSuggestion } from '../interfaces/electron/SongSuggestion'
import { Song } from '../interfaces/electron/Song'
import { Mp3Metadata } from '../interfaces/electron/Mp3Metadata'
import { downloadThumbnail, editMp3Metadata, getImgPathFromURL, initDirs, workingDir} from './utils'
import sqlite3 from 'sqlite3'

const fs = require('fs')
const mm = require("music-metadata")
const SoundCloud = require("soundcloud-scraper");
initDirs()

export const applyElectronHandlers = () => {
    ipcMain.handle('open-file-dialog', async (event: Electron.IpcMainInvokeEvent) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        })
        return result;
    })

    ipcMain.handle('search-song', async (event: Electron.IpcMainInvokeEvent, songName: string) => {
        const client = new SoundCloud.Client();
        const songs: Song[] = await client.search(songName)
        const songSuggestions: SongSuggestion[] = await Promise.all(songs.map(async(song: Song) => {
            return song.type == 'track' ? await client.getSongInfo(song.url): null
        }))

        return songSuggestions.filter(song => song !== null)
    })

    ipcMain.handle('get-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, songName: string) => {
        const path = `${workingDir}/songs/${songName}.mp3`
        return await mm.parseFile(path, { native: true });
    })

    ipcMain.handle('edit-mp3-metadata', async (event: Electron.IpcMainInvokeEvent, metadata: Mp3Metadata) => {
        return await editMp3Metadata(metadata)
    })

    ipcMain.handle('download-song', async (event: Electron.IpcMainInvokeEvent, songURL: string) => {
        return new Promise<void> (async resolve => {
            const client = new SoundCloud.Client();
            const song = await client.getSongInfo(songURL)

            const stream = await song.downloadProgressive();
            const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`));
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
    })

    ipcMain.handle('get-downloads', async (event: Electron.IpcMainInvokeEvent) => {
        const response = await fetch('localhost:11738/songs')
        const data: SQLRowResultSong[] = await response.json()
        const songs = data.map(sqlRow => sqlRow.song_name)
        return songs
    })

    ipcMain.handle('delete-song', async (event: Electron.IpcMainInvokeEvent, songName: string) => {
        const params = { songName: songName }
        const response = await fetch('localhost:11738/songs' + new URLSearchParams(params),{
            method: 'DELETE'
        })
        const data: SQLRowResultSong[] = await response.json()
        const songs = data.map(sqlRow => sqlRow.song_name)
        return songs
    })

    ipcMain.handle('get-playlists', async (event: Electron.IpcMainInvokeEvent) => {
        const response = await fetch('localhost:11738/playlists')
        return await response.json()
    })

    ipcMain.handle('get-playlist-songs', async (event: Electron.IpcMainInvokeEvent, playlistName: string) => {
        const params = { playlistName: playlistName}
        const response = await fetch('localhost:11738/playlists' + new URLSearchParams(params))
        return await response.json()
    })

    ipcMain.handle('create-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string, songName: string) => {
        const response = await fetch('localhost:11738/playlists',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playlist_name: playlistName, 
                song_name: songName
            })
        })
        return await response.json()
    })

    ipcMain.handle('delete-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string) => {
        const params = { playlistName: playlistName }
        const response = await fetch('localhost:11738/playlists' + new URLSearchParams(params),{
            method: 'DELETE',
        })
        return await response.json()
    })

    ipcMain.handle('delete-song-from-playlist', async (event: Electron.IpcMainInvokeEvent, playlistName: string, songName: string) => {
        const params = { playlistName: playlistName, songName: songName}
        const response = await fetch('localhost:11738/playlists' + new URLSearchParams(params),{
            method: 'DELETE',
        })
        return await response.json()
    })

    ipcMain.handle('update-playlist-name', async (event: Electron.IpcMainInvokeEvent, playlistName: string, previousPlaylistName: string) => {
        const params = { previousPlaylistName: previousPlaylistName }
        const response = await fetch('localhost:11738/playlists' + new URLSearchParams(params),{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playlist_name: playlistName, 
            })
        })
        return await response.json()
    })
}