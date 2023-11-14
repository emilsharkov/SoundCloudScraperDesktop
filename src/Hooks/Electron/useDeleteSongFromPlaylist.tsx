import { useState, useEffect } from "react"
import { FileDialogResult } from "@/Interfaces/FileDialogResult"
const { ipcRenderer } = window.require('electron')

export const useDeleteSongFromPlaylist = () => {
    const [playlistName,setPlaylistName] = useState<string>('')
    const [songName,setSongName] = useState<string>('')
    const [songDeleted,setSongDeleted] = useState<boolean>(true)

    useEffect(() => {
        if(playlistName !== '' && songName !== '') { 
            setSongDeleted(false) 
        }
    },[playlistName,songName])

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (songDeleted) { return }
                const content = await ipcRenderer.invoke('delete-song-from-playlist',playlistName,songName);
                console.log(content)
                setSongDeleted(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[songDeleted])
    
    return {songDeleted,setPlaylistName}
}