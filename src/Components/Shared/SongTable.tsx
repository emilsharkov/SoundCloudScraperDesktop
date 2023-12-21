import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { ListOrdered, MoreVertical } from 'lucide-react'
import { GripVertical } from 'lucide-react'
import SongSettings from "./SongSettings"
import MarqueeText from "./MarqueeText"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { current } from "@reduxjs/toolkit"
import SongTableRow from "./SongTableRow"
import { Origin, setDefaultQueue, setMusicQueue, setOrigin } from "@/Redux/Slices/queueSlice"
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice"
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"

export interface SongTableProps {
    songMetadata: Mp3Metadata[],
    isPlaylist: boolean
}

const SongTable = (props: SongTableProps) => {
    const { songMetadata,isPlaylist } = props
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : ''
    const dispatch = useAppDispatch()

    const playSongs = (index: number) => {
        const origin: Origin = isPlaylist ? 'Playlist': 'Downloads'
        const songs: string[] = songMetadata.map(metadata => metadata.title)
        console.log('row clciked')
        dispatch(setDefaultQueue(songs))
        dispatch(setMusicQueue(songs))
        dispatch(setCurrentQueueIndex(index))
        dispatch(setOrigin(origin))
        dispatch(setIsPlaying(true))
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className=''>Title</TableHead>
                    <TableHead>Artist</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songMetadata.map((item: Mp3Metadata, index: number) => (
                    <SongTableRow 
                        key={item.title}
                        onClick={playSongs}
                        currentSong={currentSong} 
                        item={item} 
                        index={index} 
                        isPlaylist={isPlaylist}                    
                    />
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable