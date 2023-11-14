import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useGetPlaylistSongs = () => {  
    const [songs,setSongs] = useState<string[]>([])
    const [receivedSongs,setReceivedSongs] = useState<boolean>(true);

    useEffect(() => {
        const getPlaylists = async() => {
            try {
                if (receivedSongs) { return }
                const content = await ipcRenderer.invoke('get-playlist-songs')
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