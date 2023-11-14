import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useDownloadSong = () => {
    const [songURL,setSongURL] = useState<string>('')
    const [isDownloaded,setIsDownloaded] = useState<boolean>(true);

    useEffect(() => {
        if(songURL !== '') { 
            setIsDownloaded(false) 
        }
    },[songURL])

    useEffect(() => {
        const downloadSong = async() => {
            try {
                if (!(songURL !== '' && !isDownloaded)) { return }
                await ipcRenderer.invoke('download-song',songURL)
                setIsDownloaded(true)
                setSongURL('')
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        downloadSong()
    },[isDownloaded])
    
    return {isDownloaded,setSongURL}
}