import { useState, useEffect } from "react"
import { SongSuggestion } from "@/Interfaces/SongSuggestion";
const { ipcRenderer } = window.require('electron');

export const useSearchSong = () => {
    const [songSuggestions,setSongSuggestions] = useState<SongSuggestion[]>([])
    const [songName,setSongName] = useState<string>('')
    const [receivedSuggestions,setReceivedSuggestions] = useState<boolean>(true)

    useEffect(() => {
        if(songName !== '') {
            setReceivedSuggestions(false)
        }
    },[songName])

    useEffect(() => {
        const getSongSuggestions = async() => {
            try {
                if (!(songName !== '' && !receivedSuggestions)) { return }
                const content = await ipcRenderer.invoke('search-song',songName);
                setSongSuggestions(content)
                setSongName('')
                setReceivedSuggestions(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getSongSuggestions()
    },[receivedSuggestions])
    
    return {songSuggestions,receivedSuggestions,setSongName}
}