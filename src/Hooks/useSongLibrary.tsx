import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

const DEFAULT_SONG_LIBRARY: string[] = []

export const useSongLibrary = () => {
    const [songs,setSongs] = useState<string[]>(DEFAULT_SONG_LIBRARY)
    const [receivedSongs,setReceivedSongs] = useState<boolean>(true);

    useEffect(() => {
        const getSongs = async() => {
            try {
                if (receivedSongs) { return }
                const content = await ipcRenderer.invoke('get-songs')
                setSongs(content)
                setReceivedSongs(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getSongs()
    },[receivedSongs])
    
    return {songs,setReceivedSongs}
}