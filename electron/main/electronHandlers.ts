import { ipcMain, dialog } from 'electron'
import { SongSuggestion } from '../interfaces/SongSuggestion'
import { Song } from '../interfaces/Song'
import { Mp3Metadata } from '../interfaces/Mp3Metadata'
import { downloadThumbnail, editMp3CoverArt, editMp3Metadata, getImgPathFromURL, initDirs, workingDir} from './utils'

const fs = require('fs')
const mm = require("music-metadata")
const SoundCloud = require("soundcloud-scraper");
initDirs()

export const applyElectronHandlers = () => {
    ipcMain.handle('open-file-dialog', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        })
        return result;
    })

    ipcMain.handle('search-song', async (event, songName: string) => {
        const client = new SoundCloud.Client();
        const songs: Song[] = await client.search(songName)
        const songSuggestions: SongSuggestion[] = await Promise.all(songs.map(async(song: Song) => {
            return song.type == 'track' ? await client.getSongInfo(song.url): null
        }))

        return songSuggestions.filter(song => song !== null)
    })

    ipcMain.handle('get-mp3-metadata', async (event, songName: string) => {
        const path = `${workingDir}/songs/${songName}.mp3`
        return await mm.parseFile(path, { native: true });
    })

    ipcMain.handle('edit-mp3-metadata', async (event, metadata: Mp3Metadata) => {
        return await editMp3Metadata(metadata)
    })

    ipcMain.handle('download-song', async (event, songURL: string) => {
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

    ipcMain.handle('get-songs', async (event) => {
        const songsDir = `${workingDir}/songs`
        const files: string[] = fs.readdirSync(songsDir)

        let fileNames: string[] = []
        files.forEach(file => {
            const filePath = `${songsDir}/${file}`
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                const songName = file.split('.mp3')[0]
                fileNames.push(songName);
            }
        })
        return fileNames
    })

    ipcMain.handle('get-playlist-names', async (event) => {
        const playlistsDir = `${workingDir}/playlists`
        const files: string[] = fs.readdirSync(playlistsDir)

        let playlistNames: string[] = []
        files.forEach(file => {
            const filePath = `${workingDir}/${file}`
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                playlistNames.push(file);
            }
        })
        return playlistNames
    })

    ipcMain.handle('get-songs-in-playlist', async (event, playlist: string) => {
        const playlistDir = `${workingDir}/playlists/${playlist}`
        const files: string[] = fs.readdirSync(playlistDir)

        let fileNames: string[] = []
        files.forEach(file => {
            const filePath = `${workingDir}/${file}`
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                fileNames.push(file);
            }
        })
        return fileNames
    })
}