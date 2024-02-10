import { FileFilter, OpenDialogReturnValue, dialog } from "electron"
import { Song } from "electron/interfaces/electron/electronHandlerInputs"
import { ErrorResponse } from "electron/interfaces/express/Error"
import { SongRow } from "electron/interfaces/express/ResponseBody"

const fs = require('fs')
const Jimp = require("jimp");
const nid3 = require('node-id3')
const { Readable } = require('stream')
const { finished } = require('stream/promises')

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

const getImgPathFromURL = (songID: number, imgURL: string) => {
    const urlSplit = imgURL.split(".")
    const imageType = urlSplit[urlSplit.length - 1]
    return `${workingDir}/images/${songID}.${imageType}`
}

const convertToPng = async(inputPath: string) => {
    const outputPath = inputPath.slice(0, inputPath.lastIndexOf('.')) + '.png'
    const image = await Jimp.read(inputPath)
    await image.writeAsync(outputPath)  
}

const downloadThumbnail = async(songID: number, thumbnailURL: string) => {
    const imagePath = getImgPathFromURL(songID,thumbnailURL)    
    const stream = fs.createWriteStream(imagePath)
    const response = await fetch(thumbnailURL)
    await finished(Readable.fromWeb(response.body).pipe(stream))
    if(imagePath.indexOf('.png') === -1) {
        await convertToPng(imagePath)
        fs.unlinkSync(imagePath)
    }
}

const editMp3CoverArt = async (songPath: string, imagePath: string) => {
    const tags = nid3.read(songPath)
    tags.image = {
        mime: 'image/png',
        type: {
            id: 3, // Cover (front) image
            name: 'front'
        },
        description: 'Cover',
        imageBuffer: fs.readFileSync(imagePath)
    }
    nid3.write(tags, songPath)
}

const changeSongMetadata = (songPath: string, artist: string) => {
    nid3.update({artist: artist}, songPath);
}

const editSongImage = async(song_id: number, newImagePath: string) => {
    const fileSplit = newImagePath.split('/')
    const newImageMime = fileSplit[fileSplit.length - 1].split('.')[1]
    const newFileLocation = `${workingDir}/images/${song_id}.${newImageMime}`
    const oldImageLocation = `${workingDir}/images/${song_id}.png`
    
    fs.unlinkSync(oldImageLocation)
    fs.copyFileSync(newImagePath, newFileLocation)
    if(newFileLocation.indexOf('.png') === -1) {
        await convertToPng(newFileLocation)
        fs.unlinkSync(newFileLocation)
    }
}

const validFileSongName = (inputString: string) => {
    const pattern = /^[a-zA-Z0-9._ -]+$/;
    const cleanedString = inputString.replace(/[\\/:*?"<>|]/g, '');
    return cleanedString.trim() || 'default_song_name';
}

const fetchData = async <T extends object>(url: string, options: RequestInit = {}) => {
    const response = await fetch(url,options)
    const data: T | ErrorResponse = await response.json()
    if('error' in data) {
        console.log(data)
        throw new Error(data.error)
    }
    return data as T
}

export {
    workingDir,
    initDirs,
    fetchData,
    changeSongMetadata,
    editMp3CoverArt,
    downloadThumbnail,
    convertToPng,
    getImgPathFromURL,
    editSongImage,
    validFileSongName
}