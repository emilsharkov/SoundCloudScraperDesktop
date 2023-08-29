import { ipcMain, dialog } from 'electron'
import { Song } from '../interfaces/Song'
import { Suggestion } from '../interfaces/Suggestion'
import { Mp3Metadata } from '../interfaces/Mp3Metadata'

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

const initDirs = () => {
    const songDir = `${workingDir}/songs`
    if (!fs.existsSync()) {
        fs.mkdirSync(songDir,{ recursive: true })
    }

    const imagesDir = `${workingDir}/images`
    if (!fs.existsSync()) {
        fs.mkdirSync(imagesDir,{ recursive: true })
    }
}

const getImgPath = (songName: string, imgURL: string) => {
    const urlSplit = imgURL.split(".")
    const imageType = urlSplit[urlSplit.length - 1]
    const imagePath = `${workingDir}/images/${songName}.${imageType}`
    return imagePath
}

const downloadThumbnail = async(songName: string, imgURL: string) => {
    const imagePath = getImgPath(songName,imgURL)    
    const stream = fs.createWriteStream(imagePath);
    const response = await fetch(imgURL);
    await finished(Readable.fromWeb(response.body).pipe(stream));
}

const editMp3CoverArt = async (songName: string, imagePath: string) => {
    const songPath = `${workingDir}/songs/${songName}.mp3`
    const tempSongPath = `${workingDir}/songs/${songName}_temp.mp3`

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
        .on('end', () => {
            fs.unlinkSync(songPath)
            fs.renameSync(tempSongPath,songPath)
        })
        .run()
}

export const getElectronHandlers = () => {
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

        nid3.update(mp3Metadata.common, path);
    })

    //download song
    ipcMain.handle('download-song', async (event, songURL: string) => {
        let song = null
        initDirs()

        await new Promise<void> (async resolve => {
            const client = new SoundCloud.Client();
            song = await client.getSongInfo(songURL)
            const stream = await song.downloadProgressive();
            const writer = stream.pipe(fs.createWriteStream(`${workingDir}/songs/${song.title}.mp3`));
            writer.on("finish", () => { resolve() })
        })
        setTimeout(async() => {
            await downloadThumbnail(song!.title,song!.thumbnail)
            await editMp3CoverArt(song!.title,getImgPath(song!.title,song!.thumbnail))
        }, 2000)
    })
}