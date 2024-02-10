import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler";
import { DeleteSongFromAppArgs, DeleteSongInPlaylistArgs } from "@/Interfaces/electronHandlerInputs";
import { PlaylistSongRow, SongRow } from "@/Interfaces/electronHandlerReturns";
import { clearSource } from "@/Redux/Slices/audioSlice";
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice";
import { setDefaultQueue, setMusicQueue } from "@/Redux/Slices/queueSlice";
import { setQueuedSongs } from "@/Redux/Slices/queuedSongsSlice";
import { refreshDownloads, refreshPlaylist } from "@/Redux/Slices/refreshDataSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { Trash2, XSquare } from "lucide-react";
import { useEffect, useState } from "react";

export interface RemoveFromPlaylistProps {
    row: SongRow;
    playlist_id?: number;
}

const RemoveFromPlaylist = (props: RemoveFromPlaylistProps) => {
    const {row,playlist_id} = props
    const [open,setOpen] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<DeleteSongInPlaylistArgs,PlaylistSongRow>('delete-song-in-playlist')
    const queue = useAppSelector((state) => state.queue)
    const queuedSongs = useAppSelector((root) => root.queuedSongs.value)
    const currentQueueIndex = useAppSelector((root) => root.currentQueueIndex.value)
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
    }

    const removeFromQueuedPlaylist = () => {
        if(result){
            if(queue.musicQueue.includes(result.song_id)){
                const filteredDefaultQueue = queue.defaultQueue.filter(song_id => song_id !== result.song_id)
                const filteredMusicQueue = queue.musicQueue.filter(song_id => song_id !== result.song_id)
                const filteredQueuedSongs = queuedSongs.filter(song_id => song_id !== result.song_id)
                const queueOffset = queue.musicQueue.length - filteredMusicQueue.length
                
                if(currentQueueIndex >= queue.musicQueue.length - queueOffset) {
                    dispatch(setCurrentQueueIndex(currentQueueIndex-queueOffset))
                }

                if(queue.musicQueue.length - queueOffset === -1){
                    dispatch(clearSource())
                }

                dispatch(setDefaultQueue(filteredDefaultQueue))
                dispatch(setMusicQueue(filteredMusicQueue))
                dispatch(setQueuedSongs(filteredQueuedSongs))
            }
        }
    }

    const submitDialog = () => {
        if(playlist_id !== undefined){
            setArgs({
                playlist_id: playlist_id,
                song_id: row.song_id
            })
        }
    }

    useEffect(() => {
        if(receivedData && !error && result) {
            if(queue.origin === 'Playlist' && playlist_id === queue.playlist_id){
                removeFromQueuedPlaylist()
            }
            setOpen(false)
            dispatch(refreshPlaylist())
        }
    },[receivedData,error,result])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={openDialog}>
                        <XSquare className="mr-2 h-4 w-4"/>
                        <span>Remove From Playlist</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[80%]">
                    <DialogHeader>
                        <DialogTitle>Delete <span className="text-gray-500">{row.title}</span> from Computer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to this song from the playlist?
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="w-full flex flex-row items-center justify-center">
                        <Button 
                            disabled={!receivedData} 
                            onClick={() => submitDialog()} 
                            className="w-[30%]"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RemoveFromPlaylist