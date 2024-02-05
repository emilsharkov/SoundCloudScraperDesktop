import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import SongTableRow from "./SongTableRow"
import { Origin, setDefaultQueue, setMusicQueue, setOrigin } from "@/Redux/Slices/queueSlice"
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice"
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"
import { SongRow } from "@/Interfaces/electronHandlerReturns"

export interface SongTableProps {
    rows: SongRow[],
    isPlaylist: boolean
}

const SongTable = (props: SongTableProps) => {
    const { rows,isPlaylist } = props
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : -1
    const dispatch = useAppDispatch()

    const playSongs = (index: number) => {
        const origin: Origin = isPlaylist ? 'Playlist': 'Downloads'
        const song_ids: number[] = rows.map(row => row.song_id)
        dispatch(setDefaultQueue(song_ids))
        dispatch(setMusicQueue(song_ids))
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
                    <TableHead>Duration</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row: SongRow, index: number) => (
                    <SongTableRow 
                        key={row.title}
                        onClick={() => playSongs(index)}
                        currentSong={currentSong} 
                        row={row} 
                        isPlaylist={isPlaylist}                    
                    />
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable