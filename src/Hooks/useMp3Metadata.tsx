import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useMp3Metadata = () => {
    const [songName,setSongName] = useState<string>()
    const [mp3ActionComplete,setMp3ActionComplete] = useState<boolean>(true)

    useEffect(() => {
        setReceivedSuggestions(false)
    },[songName])

    useEffect(() => {
        const getSongSuggestions = async() => {
            try {
                if (!(songName !== DEFAULT_SONG_NAME && !receivedSuggestions)) { return }
                const content = await ipcRenderer.invoke('search-song-name',songName);
                setSongSuggestions(content)
                setSongName(DEFAULT_SONG_NAME)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getSongSuggestions()
    },[receivedSuggestions])
    
    return {}
}