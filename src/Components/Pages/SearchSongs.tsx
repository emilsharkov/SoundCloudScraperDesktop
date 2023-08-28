import { useState } from "react"
import { useSongSuggestions } from "@/Hooks/useSongSuggestions";
import { useSongDownload } from "@/Hooks/useSongDownload";
import { useFileDialog } from "@/Hooks/useFileDialog";

export const SearchSongs = () => {
    const {songSuggestions,setSongName} = useSongSuggestions()
    const {isDownloaded,setSongURL} = useSongDownload()
    const {path,isDone,setOpenDialog} = useFileDialog()

    return(
        <div>
            <button onClick={() => setSongName('im going to rip out your spine')}>Song Suggestions</button>
            <button onClick={() => setSongURL(songSuggestions[0].url)}>Download Songs</button>
            <button onClick={() => setOpenDialog(true)}>Open Dialog</button>
            <pre>{JSON.stringify(songSuggestions,null,2)}</pre>
            <pre>{JSON.stringify(path,null,2)}</pre>
            <pre>{JSON.stringify(isDone,null,2)}</pre>
        </div>
    )
}