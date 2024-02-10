import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler";
import { DeleteSongFromAppArgs } from "@/Interfaces/electronHandlerInputs";
import { SongRow } from "@/Interfaces/electronHandlerReturns";
import { clearSource, play } from "@/Redux/Slices/audioSlice";
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice";
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice";
import { setDefaultQueue, setMusicQueue } from "@/Redux/Slices/queueSlice";
import { setQueuedSongs } from "@/Redux/Slices/queuedSongsSlice";
import { refreshDownloads, refreshPlaylist } from "@/Redux/Slices/refreshDataSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface DeleteFromComputerProps {
    row: SongRow;
    isPlaylist: boolean;
}

const DeleteFromComputer = (props: DeleteFromComputerProps) => {
    const {row,isPlaylist} = props
    const [open,setOpen] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<DeleteSongFromAppArgs,SongRow>('delete-song-from-app')
    const queue = useAppSelector((state) => state.queue)
    const queuedSongs = useAppSelector((root) => root.queuedSongs.value)
    const currentQueueIndex = useAppSelector((root) => root.currentQueueIndex.value)
    const isPlaying = useAppSelector((root) => root.isPlaying.value)
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
    }

    const submitDialog = () => {
        setArgs({song_id: row.song_id})
    }

    useEffect(() => {
        if(receivedData && !error && result) {
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

            setOpen(false)
            isPlaylist? dispatch(refreshPlaylist()): dispatch(refreshDownloads())
        }
    },[receivedData,error,result])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={openDialog}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span>Delete From Computer</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[80%]">
                    <DialogHeader>
                        <DialogTitle>Delete <span className="text-gray-500">{row.title}</span> from Computer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete this song? You cannot undo this action.
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

export default DeleteFromComputer