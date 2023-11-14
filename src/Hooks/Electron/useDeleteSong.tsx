import { useState, useEffect } from "react"
import { FileDialogResult } from "@/Interfaces/FileDialogResult"
const { ipcRenderer } = window.require('electron')


export const useDeleteSong = () => {
    const [songName,setSongName] = useState<string>('')
    const [songDeleted,setSongDeleted] = useState<boolean>(true)

    useEffect(() => {
        if(songName !== '') { 
            setSongDeleted(false) 
        }
    },[songName])

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (songDeleted) { return }
                const content = await ipcRenderer.invoke('delete-song',songName);
                console.log(content)
                setSongDeleted(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[songDeleted])
    
    return {songDeleted,setSongName}
}