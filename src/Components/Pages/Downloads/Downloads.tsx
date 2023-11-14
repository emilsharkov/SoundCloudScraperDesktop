import { useState, useEffect, useMemo } from "react"
import { useSongLibrary } from "@/Hooks/Electron/useGetDownloads"
import { useSearchSong } from "@/Hooks/Electron/useSearchSong"
import { useDebounce } from "@/Hooks/useDebounce"
import { SongSuggestion } from '../../../Interfaces/SongSuggestion'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import ReactDragListView from 'react-drag-listview';

const Downloads = () => {
    const {downloads,setReceivedDownloads} = useSongLibrary()

    useEffect(() => { 
        setReceivedDownloads(false)
    },[])

    // const onDragEnd = (fromIndex: number, toIndex: number) => {
    //     const newData = [...downloads];
    //     const [draggedItem] = newData.splice(fromIndex, 1);
    //     newData.splice(toIndex, 0, draggedItem);
    //     setData(newData);
    // }

    return(
        <div>
            {downloads.map(song => {
                return (
                    <div>{song}</div>
                )
            })}
        </div>
        
    )
}

export default Downloads