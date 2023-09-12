import { Mp3Metadata } from 'electron/interfaces/Mp3Metadata';
import { Request, Response, NextFunction } from 'express';

const fs = require('fs')
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

export const sendSongImage = (req: Request, res: Response, next: NextFunction) => {
    const fileName = req.params.fileName
    const imagePath = `${workingDir}/images`
  
    fs.readdir(imagePath, (err: Error, files: string[]) => {
      if (err) { return res.status(500).send('Internal Server Error') }

      const matchingFile = files.find(file => {
        const tokens = file.split(fileName)
        return tokens[0] === '' && tokens[1][0] === '.'
      });
      
      return matchingFile ? res.sendFile(`${imagePath}/${matchingFile}`): res.status(404).send('File not found')
    })
}

export const editMp3Metadata = async(metadata: Mp3Metadata) => {
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
}