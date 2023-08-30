import { ipcMain, dialog } from 'electron'
import { Song } from '../interfaces/Song'
import { Suggestion } from '../interfaces/Suggestion'
import { Mp3Metadata } from '../interfaces/Mp3Metadata'
import { downloadThumbnail, editMp3CoverArt, getImgPathFromURL, initDirs, workingDir} from './utils'

const fs = require('fs')
const mm = require("music-metadata")
const SoundCloud = require("soundcloud-scraper");
const nid3 = require('node-id3')
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
        const suggestions: Suggestion[] = await client.search(songName)
        const songSuggestions: Song[] = await Promise.all(suggestions.map(async(song: Suggestion) => {
            return song.type == 'track' ? await client.getSongInfo(song.url): null
        }))

        return songSuggestions.filter(song => song !== null)
    })

    ipcMain.handle('get-mp3-metadata', async (event, path: string) => {
        return await mm.parseFile(path, { native: true });
    })

    ipcMain.handle('edit-mp3-metadata', async (event, metadata: Mp3Metadata) => {
        const path = `${workingDir}/songs/${metadata.title}.mp3`
        const mp3Metadata = await mm.parseFile(path, { native: true });
        
        if(metadata.title != mp3Metadata.common.title) {
            mp3Metadata.common.title = metadata.title;
        }

        if(metadata.artist != null) {
            mp3Metadata.common.artist = metadata.artist;
        }

        if(metadata.imgPath != null) {
            editMp3CoverArt(metadata.title, metadata.imgPath)
        }

        nid3.update(mp3Metadata.common, path)
        return await mm.parseFile(path, { native: true })
    })

    ipcMain.handle('download-song', async (event, songURL: string) => {
        return new Promise<void> (async resolve => {
            const client = new SoundCloud.Client();
            const song = await client.getSongInfo(songURL)

            const stream = await song.downloadProgressive();
            const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`));
            writer.on("finish", async() => { 
                await downloadThumbnail(song.title,song.thumbnail)
                await editMp3CoverArt(song.title,getImgPathFromURL(song.title,song.thumbnail))
                resolve() 
            })
        })
    })

    ipcMain.handle('get-songs', async (event) => {
        const songsDir = `${workingDir}/songs`
        const files: string[] = fs.readdirSync(songsDir)

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