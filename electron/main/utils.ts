import { Request, Response, NextFunction } from 'express';

const fs = require('fs')
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

    const playlistDir = `${workingDir}/playlists`
    if (!fs.existsSync()) {
        fs.mkdirSync(playlistDir,{ recursive: true })
    }
}

export const getImgPathFromURL = (songName: string, imgURL: string) => {
    const urlSplit = imgURL.split(".")
    const imageType = urlSplit[urlSplit.length - 1]
    const imagePath = `${workingDir}/images/${songName}.${imageType}`
    return imagePath
}

export const downloadThumbnail = async(songName: string, imgURL: string) => {
    const imagePath = getImgPathFromURL(songName,imgURL)    
    const stream = fs.createWriteStream(imagePath);
    const response = await fetch(imgURL);
    await finished(Readable.fromWeb(response.body).pipe(stream));
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
}

export const sendSongImage = (req: Request, res: Response, next: NextFunction) => {
    const fileName = req.params.fileName
    const imagePath = `${workingDir}/images`
  
    fs.readdir(imagePath, (err: Error, files: string[]) => {
      if (err) { return res.status(500).send('Internal Server Error') }

      const matchingFile = files.find(file => file.startsWith(fileName));
      return matchingFile ? res.sendFile(`${imagePath}/${fileName}`): res.status(404).send('File not found')
    })
}