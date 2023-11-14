import { useState, useEffect } from "react"
import { FileDialogResult } from "@/Interfaces/FileDialogResult"
const { ipcRenderer } = window.require('electron')

export const useCreatePlaylist = () => {
    const [playlistName,setPlaylistName] = useState<string>('')
    const [playlistCreated,setPlaylistCreated] = useState<boolean>(true)

    useEffect(() => {
        if(playlistName !== '') { 
            setPlaylistCreated(false) 
        }
    },[playlistName])

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (playlistCreated) { return }
                const content = await ipcRenderer.invoke('delete-playlist',playlistName);
                console.log(content)
                setPlaylistCreated(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[playlistCreated])
    
    return {playlistCreated,setPlaylistName}
}