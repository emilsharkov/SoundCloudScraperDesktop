import { useState, useEffect } from "react"
import { SongSuggestion } from "@/Interfaces/SongSuggestion";
const { ipcRenderer } = window.require('electron');
const DEFAULT_SONG_NAME = ''

export const useSearchSong = () => {
    const [songSuggestions,setSongSuggestions] = useState<SongSuggestion[]>([])
    const [songName,setSongName] = useState<string>(DEFAULT_SONG_NAME)
    const [receivedSuggestions,setReceivedSuggestions] = useState<boolean>(true)

    useEffect(() => {
        if(songName !== DEFAULT_SONG_NAME) {
            setReceivedSuggestions(false)
        }
    },[songName])

    useEffect(() => {
        const getSongSuggestions = async() => {
            try {
                if (!(songName !== DEFAULT_SONG_NAME && !receivedSuggestions)) { return }
                const content = await ipcRenderer.invoke('search-song',songName);
                setSongSuggestions(content)
                setSongName(DEFAULT_SONG_NAME)
                setReceivedSuggestions(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getSongSuggestions()
    },[receivedSuggestions])
    
    return {songSuggestions,receivedSuggestions,setSongName}
}