import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { ListOrdered, MoreVertical } from 'lucide-react'
import { GripVertical } from 'lucide-react'
import SongSettings from "./SongSettings"
import MarqueeText from "./MarqueeText"
import { useAppSelector } from "@/Redux/hooks"
import { current } from "@reduxjs/toolkit"
import SongTableRow from "./SongTableRow"

export interface SongTableProps {
    songMetadata: Mp3Metadata[],
    isPlaylist: boolean
}

const SongTable = (props: SongTableProps) => {
    const { songMetadata,isPlaylist } = props
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : ''
    const isPlaying = useAppSelector((state) => state.isPlaying.value)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songMetadata.map((item: Mp3Metadata, index: number) => (
                    <SongTableRow 
                        key={item.title}
                        currentSong={currentSong} 
                        isPlaying={isPlaying} 
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