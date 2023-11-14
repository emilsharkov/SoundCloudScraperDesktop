import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron')

export const useUpdatePlaylistName = () => {
    const [previousPlaylistName,setPreviousPlaylistName] = useState<string>('')
    const [playlistName,setPlaylistName] = useState<string>('')
    const [playlistUpdated,setPlaylistUpdated] = useState<boolean>(true)

    useEffect(() => {
        if(playlistName !== '' && previousPlaylistName !== '') { 
            setPlaylistUpdated(false) 
        }
    },[playlistName,previousPlaylistName])

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (playlistUpdated) { return }
                const content = await ipcRenderer.invoke('update-playlist-name',playlistName,previousPlaylistName);
                console.log(content)
                setPlaylistUpdated(true)
                setPlaylistName('')
                setPreviousPlaylistName('')
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[playlistUpdated])
    
    return {playlistUpdated,setPlaylistName,setPreviousPlaylistName}
}