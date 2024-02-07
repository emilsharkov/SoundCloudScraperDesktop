import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import SongTableRow from "./SongTableRow"
import { Origin, setDefaultQueue, setMusicQueue, setOrigin } from "@/Redux/Slices/queueSlice"
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice"
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
import ReactDragListView from 'react-drag-listview';

export interface SongTableProps {
    rows: SongRow[];
    playlistID?: number;
    onDragEnd: (fromIndex: number, toIndex: number) => void;
}

const SongTable = (props: SongTableProps) => {
    const {rows,playlistID,onDragEnd} = props
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : -1
    const dispatch = useAppDispatch()

    const playSongs = (index: number) => {
        const origin: Origin = playlistID ? 'Playlist': 'Downloads'
        const song_ids: number[] = rows.map(row => row.song_id)
        dispatch(setDefaultQueue(song_ids))
        dispatch(setMusicQueue(song_ids))
        dispatch(setCurrentQueueIndex(index))
        dispatch(setOrigin(origin))
        dispatch(setIsPlaying(true))
    }

    return (
        <ReactDragListView
                onDragEnd={onDragEnd}
                nodeSelector="tr" 
                handleSelector="a"
        >
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
                            playlistID={playlistID}
                        />
                    ))}
                </TableBody>
            </Table>
        </ReactDragListView>
    )
}

export default SongTable