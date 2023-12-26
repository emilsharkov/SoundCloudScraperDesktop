import { Mp3Metadata } from '../interfaces/electron/electronHandlerInputs'
import { ErrorResponse } from '../interfaces/express/Error'
import { SongTitle } from '../interfaces/express/ResponseBody'

const fs = require('fs')
import * as mm from "music-metadata"
const getMP3Duration = require('get-mp3-duration')
const Jimp = require("jimp");
const nid3 = require('node-id3')
const { Readable } = require('stream')
const { finished } = require('stream/promises')

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
        const outputPath = inputPath.slice(0, inputPath.lastIndexOf('.')) + '.png'
        const image = await Jimp.read(inputPath)
        await image.writeAsync(outputPath)  
        console.log('Image converted successfully to PNG:', outputPath)
    } catch (error) {
        console.error('Error converting image to PNG:', error)
        throw error
    }
  }

export const downloadThumbnail = async(songName: string, imgURL: string) => {
    const imagePath = getImgPathFromURL(songName,imgURL)    
    const stream = fs.createWriteStream(imagePath)
    const response = await fetch(imgURL)
    await finished(Readable.fromWeb(response.body).pipe(stream))
    if(imagePath.indexOf('.png') === -1) {
        await convertToPng(imagePath)
        fs.unlinkSync(imagePath)
    }
}

export const editMp3CoverArt = async (songName: string, imagePath: string) => {
    const songPath = `${workingDir}/songs/${songName}.mp3`
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

export const editMp3Metadata = async(originalTitle: string, metadata: Mp3Metadata) => {
    const originalSongPath = `${workingDir}/songs/${originalTitle}.mp3`
    const metadataSongPath = `${workingDir}/songs/${metadata.title}.mp3`
    const originalImagePath = `${workingDir}/images/${originalTitle}.png`
    const metadataImagePath = `${workingDir}/images/${metadata.title}.png`
    const mp3Metadata: mm.IAudioMetadata = await mm.parseFile(originalSongPath)
    
    if(metadata.title !== mp3Metadata.common.title) {
        if(!mp3Metadata.common.title) {
            const data = await fetchData<SongTitle[]>(`http://localhost:11738/songs`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: originalTitle }),
            })
        } else {
            fs.renameSync(originalSongPath, metadataSongPath)
            fs.renameSync(originalImagePath, metadataImagePath)

            const data = await fetchData<SongTitle[]>(`http://localhost:11738/songs/${mp3Metadata.common.title}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newTitle: metadata.title }),
            })
        }
        mp3Metadata.common.title = metadata.title
    }

    if(metadata.artist !== mp3Metadata.common.artist) {
        mp3Metadata.common.artist = metadata.artist
    }

    if (metadata.imgPath !== originalImagePath) {
        console.log(metadata)
        console.log('originalImagePath:', originalImagePath);
        console.log('metadataImagePath:', metadataImagePath);
    
        fs.unlinkSync(originalImagePath === metadataImagePath ? originalImagePath : metadataImagePath);
    
        const extension = metadata.imgPath.split('.').pop();
        const tempMetadataImagePath = `${workingDir}/images/${metadata.title}.${extension}`;
        console.log('tempMetadataImagePath:', tempMetadataImagePath);
    
        const imgData = fs.readFileSync(metadata.imgPath)
        fs.writeFileSync(tempMetadataImagePath, imgData)

        if (tempMetadataImagePath.indexOf('.png') === -1) {
            await convertToPng(tempMetadataImagePath);
            fs.unlinkSync(tempMetadataImagePath);
        }
    
        editMp3CoverArt(metadata.title, metadata.imgPath);
    }
    
    nid3.update(mp3Metadata.common, originalSongPath === metadataSongPath ? originalSongPath: metadataSongPath)
    return true
}

export const getMetadata = async(songName: string) => {
    const path = `${workingDir}/songs/${songName}.mp3`
    const response: mm.IAudioMetadata = await mm.parseFile(path)
    const common = response.common
    let metadata: Mp3Metadata = { 
        title: songName, 
        artist: common.artist!, 
        imgPath: `${workingDir}/images/${songName}.png`,
        duration: getDuration(path) 
    }
    return metadata
}

export const getDuration = (filePath: string): number => {
    const buffer = fs.readFileSync(filePath)
    return getMP3Duration(buffer) 
}

export const fetchData = async <T extends object>(url: string, options: RequestInit = {}) => {
    const response = await fetch(url,options)
    const data: T | ErrorResponse = await response.json()
    if('error' in data) {
        throw new Error(data.error)
    }
    return data as T
}