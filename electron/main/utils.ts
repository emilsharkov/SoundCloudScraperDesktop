import { Mp3Metadata } from 'electron/interfaces/electron/Mp3Metadata';
import { ErrorResponse } from '../interfaces/express/Error';
import { SongTitle } from '../interfaces/express/ResponseBody';
import { PostSongBody, PutSongBody } from '../interfaces/express/RequestBody';

const fs = require('fs')
const sharp = require('sharp');
const mm = require("music-metadata")
const nid3 = require('node-id3')
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

export const workingDir = process.env.USERPROFILE + '\\SoundCloudScraper'

export const initDirs = () => {
    const songDir = `${workingDir}/songs`
    if (!fs.existsSync()) {
        fs.mkdirSync(songDir,{ recursive: true })
    }

    const imagesDir = `${workingDir}/images`
    if (!fs.existsSync()) {
        fs.mkdirSync(imagesDir,{ recursive: true })
    }
}

export const getImgPathFromURL = (songName: string, imgURL: string) => {
    const urlSplit = imgURL.split(".")
    const imageType = urlSplit[urlSplit.length - 1]
    const imagePath = `${workingDir}/images/${songName}.${imageType}`
    return imagePath
}

async function convertToPng(inputPath: string) {
    try {
        const outputPath = inputPath.split('.')[0] + '.png'
        await sharp(inputPath).toFormat('png').toFile(outputPath);
        console.log('Image converted successfully to PNG:', outputPath);
    } catch (error) {
        console.error('Error converting image to PNG:', error)
        throw error
    }
  }

export const downloadThumbnail = async(songName: string, imgURL: string) => {
    const imagePath = getImgPathFromURL(songName,imgURL)    
    const stream = fs.createWriteStream(imagePath);
    const response = await fetch(imgURL);
    await finished(Readable.fromWeb(response.body).pipe(stream))
    await convertToPng(imagePath)
}

export const editMp3CoverArt = async (songName: string, imagePath: string) => {
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

    copyLocalImageToImages(imagePath)
}

const copyLocalImageToImages = (path: string) => {
    const fileNameArr: string[] = path.split('/')
    const fileName: string = fileNameArr[fileNameArr.length - 1]
    const copyPath = `${workingDir}/images/${fileName}`

    fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          console.error('Error reading the source image:', err);
          return;
        }
      
        fs.writeFile(copyPath, data, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.error('Error writing the destination image:', err);
            return;
          }
        });
    });
}

export const editMp3Metadata = async(metadata: Mp3Metadata) => {
    const path = `${workingDir}/songs/${metadata.title}.mp3`
    const mp3Metadata = await mm.parseFile(path, { native: true });
    
    if(metadata.title != mp3Metadata.common.title) {
        await changeTitle(mp3Metadata.common.title,metadata.title)
        mp3Metadata.common.title = metadata.title;
    }

    if(metadata.artist != null) {
        mp3Metadata.common.artist = metadata.artist;
    }

    if(metadata.imgPath != null) {
        editMp3CoverArt(metadata.title, metadata.imgPath)
    }

    nid3.update(mp3Metadata.common, path)
    await mm.parseFile(path, { native: true })

    
}

const changeTitle = async (oldTitle: string, newTitle: string) => {
    const songResponse = await fetch('http://localhost:11738/songs')
    const songData: SongTitle[] | ErrorResponse = await songResponse.json()
    
    if('error' in songData) {
        throw new Error(songData.error)
    }
    const songs = songData.map(song => song.title)
    
    let url: string = 'http://localhost:11738/songs'
    let method: string = ''
    let body: PutSongBody | PostSongBody | null = null
    if (songs.includes(oldTitle)) {
        method = 'PUT'
        url += `/${oldTitle}`
        body = { newTitle: newTitle }
    } else {
        method = 'POST'
        body = { title: newTitle }
    }
    
    const newMetaDataResponse = await fetch(url,{
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    const newMetaData: SongTitle | ErrorResponse = await newMetaDataResponse.json()
    if('error' in newMetaData) {
        throw new Error(newMetaData.error)
    }
}