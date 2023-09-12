import { Mp3Metadata } from "@/Interfaces/Mp3Metadata";
import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useSetMp3Metadata = () => {
    const [title,setTitle] = useState<string>('')
    const [artist,setArtist] = useState<string | null>(null)
    const [imgPath,setImgPath] = useState<string | null>(null)
    const [updatedMp3Metadata,setUpdatedMp3Metadata] = useState<Mp3Metadata | null>(null)
    const [getData,setGetData] = useState<boolean>(false)

    useEffect(() => {
        const getMp3Metadata = async() => {
            try {
                if (getData || title === '') { return }

                const newMp3Metadata: Mp3Metadata = {
                    title: title,
                    artist: artist,
                    imgPath: imgPath
                }

                const content = await ipcRenderer.invoke('edit-mp3-metadata', newMp3Metadata)
                setUpdatedMp3Metadata(content)
                setGetData(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getMp3Metadata()
    },[getData])

    return { setTitle, setArtist, setImgPath, setGetData, updatedMp3Metadata }
}