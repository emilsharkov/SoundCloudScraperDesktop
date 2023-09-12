import { Mp3Metadata } from "@/Interfaces/Mp3Metadata";
import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useGetMp3Metadata = () => {
    const [songName,setSongName] = useState<string>()
    const [mp3Metadata,setMp3Metadata] = useState<Mp3Metadata | null>(null)

    useEffect(() => {
        const getMp3Metadata = async() => {
            try {
                if (!songName) { return }
                const content = await ipcRenderer.invoke('get-mp3-metadata',songName)
                console.log(content)
                setMp3Metadata(content)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getMp3Metadata()
    },[songName])

    return { mp3Metadata, setSongName }
}