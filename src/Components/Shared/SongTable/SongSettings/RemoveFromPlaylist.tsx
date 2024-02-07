import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler";
import { DeleteSongFromAppArgs, DeleteSongInPlaylistArgs } from "@/Interfaces/electronHandlerInputs";
import { PlaylistSongRow, SongRow } from "@/Interfaces/electronHandlerReturns";
import { refreshDownloads, refreshPlaylist } from "@/Redux/Slices/refreshDataSlice";
import { useAppDispatch } from "@/Redux/hooks";
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
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
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