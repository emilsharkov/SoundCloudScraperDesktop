import { ipcMain, dialog } from 'electron'
import { Song } from '../interfaces/Song'
import { Suggestion } from '../interfaces/Suggestion'

const fs = require('fs')
const mm = require("music-metadata")
const SoundCloud = require("soundcloud-scraper");
const nid3 = require('node-id3')
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

const workingDir = process.env.USERPROFILE + '\\SoundCloudScraper'

export const getElectronHandlers = () => {
    const initDirs = () => {
        const songDir = `${workingDir}/songs`
        if (!fs.existsSync()) {
            fs.mkdirSync(songDir,{ recursive: true })
        }
    }

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

    ipcMain.handle('search-song-name', async (event, songName: string) => {
        const client = new SoundCloud.Client();
        const suggestions: Suggestion[] = await client.search(songName)
        const songSuggestions: Song[] = await Promise.all(suggestions.map(async(song: Suggestion) => {
            return song.type == 'track' ? await client.getSongInfo(song.url): null
        }))

        return songSuggestions.filter(song => song !== null)
    })

    // fetch mp3 file metadata
    ipcMain.handle('get-mp3-metadata', async (event, path: string) => {
        return await mm.parseFile(path, { native: true });
    })

    //edit mp3 file title metadata
    ipcMain.handle('edit-mp3-title', async (event, path: string, title: string) => {
        const metadata = await mm.parseFile(path, { native: true });
        metadata.common.title = title;
        nid3.update(metadata.common, path);
    })

    // //edit mp3 file author metadata
    ipcMain.handle('edit-mp3-artist', async (event, path: string, artist: string) => {
        const metadata = await mm.parseFile(path, { native: true });
        metadata.common.artist = artist;
        nid3.update(metadata.common, path);
    })

    // //edit mp3 file jpg metadata
    ipcMain.handle('edit-mp3-picture', async (event, songName: string, imageURL: string) => {
        //download picture
        const imagePath = `${workingDir}/images/${songName}`
        const stream = fs.createWriteStream(imagePath);
        const response = await fetch(imageURL);
        await finished(Readable.fromWeb(response.body).pipe(stream));

        const songPath = `${workingDir}/songs/${songName}`
        const tempSongPath = `${songPath}_temp`
        ffmpeg()
            .input(songPath)
            .input(imagePath)
            .outputOptions('-c', 'copy')
            .outputOptions('-map', '0')
            .outputOptions('-map', '1')
            .outputOptions('-id3v2_version', '3')
            .outputOptions('-metadata:s:v', 'title="Album cover"')
            .outputOptions('-metadata:s:v', 'comment="Cover (front)"')
            .output(tempSongPath)
            .run()

        fs.unlink(songPath)
        fs.rename(tempSongPath,songPath)
    })

    //download song
    ipcMain.handle('download-song', async (event, songURL: string) => {
        initDirs()

        return new Promise<void> (async resolve => {
            const client = new SoundCloud.Client();
            const song = await client.getSongInfo(songURL)
            const stream = await song.downloadProgressive();
            const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`));
            writer.on("finish", () => {
                resolve()
            })
        })
    })
}