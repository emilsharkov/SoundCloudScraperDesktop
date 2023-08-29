import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');
const DEFAULT_SONG_URL = ''

export const useSongDownload = () => {
    const [songURL,setSongURL] = useState<string>(DEFAULT_SONG_URL)
    const [isDownloaded,setIsDownloaded] = useState<boolean>(true);

    useEffect(() => {
        if(songURL !== DEFAULT_SONG_URL) { 
            setIsDownloaded(false) 
        }
    },[songURL])

    useEffect(() => {
        const downloadSong = async() => {
            try {
                if (!(songURL !== DEFAULT_SONG_URL && !isDownloaded)) { return }
                await ipcRenderer.invoke('download-song',songURL)
                setIsDownloaded(true)
                setSongURL(DEFAULT_SONG_URL)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        downloadSong()
    },[isDownloaded])
    
    return {isDownloaded,setSongURL}
}