import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler";
import { DeletePlaylistArgs } from "@/Interfaces/electronHandlerInputs";
import { PlaylistRow } from "@/Interfaces/electronHandlerReturns";
import { refreshPlaylists } from "@/Redux/Slices/refreshDataSlice";
import { useAppDispatch } from "@/Redux/hooks";
import { Trash2, XSquare  } from "lucide-react";
import { useEffect, useState } from "react";

export interface DeletePlaylistProps {
    row: PlaylistRow;
}

const DeletePlaylist = (props: DeletePlaylistProps) => {
    const {row} = props
    const [open,setOpen] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<DeletePlaylistArgs,PlaylistRow>('delete-playlist')
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
    }

    const submitDialog = () => {
        setArgs({playlist_id: row.playlist_id})
    }

    useEffect(() => {
        if(receivedData && !error && result) {
            setOpen(false)
            dispatch(refreshPlaylists())
        }
    },[receivedData,error,result])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={openDialog}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span>Delete Playlist</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="w-[80%]">
                    <DialogHeader>
                        <DialogTitle>Delete <span className="text-gray-500">{row.name}</span></DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete this playlist? You cannot undo this action.
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

export default DeletePlaylist