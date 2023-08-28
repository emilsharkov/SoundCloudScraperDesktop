import { useState, useEffect } from "react"
import { Song } from "@/Interfaces/Song";
const { ipcRenderer } = window.require('electron');
const DEFAULT_SONG_NAME = ''

export const useSongSuggestions = () => {
    const [songSuggestions,setSongSuggestions] = useState<Song[]>([])
    const [songName,setSongName] = useState<string>(DEFAULT_SONG_NAME)

    useEffect(() => {
        const getSongSuggestions = async() => {
            try {
                if (songName === DEFAULT_SONG_NAME) { return }
                const content = await ipcRenderer.invoke('search-song-name',songName);
                setSongSuggestions(content)
                setSongName(DEFAULT_SONG_NAME)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getSongSuggestions()
    },[songName])
    
    return {songSuggestions,setSongName}
}