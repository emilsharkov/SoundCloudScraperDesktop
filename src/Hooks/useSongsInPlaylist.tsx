import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

const DEFAULT_PLAYLIST: string[] = []

export const useSongsInPlaylist = () => {  
    const [songs,setSongs] = useState<string[]>(DEFAULT_PLAYLIST)
    const [receivedSongs,setReceivedSongs] = useState<boolean>(true);

    useEffect(() => {
        const getPlaylists = async() => {
            try {
                if (receivedSongs) { return }
                const content = await ipcRenderer.invoke('get-songs-in-playlist')
                setSongs(content)
                setReceivedSongs(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getPlaylists()
    },[receivedSongs])
    
    return {songs,setReceivedSongs}
}