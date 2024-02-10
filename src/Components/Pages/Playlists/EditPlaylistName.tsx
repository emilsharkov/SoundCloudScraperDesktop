import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { Button } from "@/Components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/Redux/hooks"
import { refreshPlaylists } from "@/Redux/Slices/refreshDataSlice"
import { CreatePlaylistArgs, EditPlaylistArgs } from "@/Interfaces/electronHandlerInputs"
import { PlaylistRow } from "@/Interfaces/electronHandlerReturns"
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import { FileEdit } from "lucide-react"

export interface EditPlaylistProps {
    row: PlaylistRow;
}

const EditPlaylistName = (props: EditPlaylistProps) => {
    const {row} = props
    const [open,setOpen] = useState<boolean>(false)
    const [name,setName] = useState<string>(row.name)
    const {result,error,receivedData,setArgs} = useElectronHandler<EditPlaylistArgs,PlaylistRow>('edit-playlist-name')
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
    }

    const editName = () => {
        setArgs({
            name: name,
            playlist_id: row.playlist_id
        })
    }

    useEffect(() => {
        if(result && !error && receivedData) {
            dispatch(refreshPlaylists())
            setOpen(false)
        }
    },[result,error,receivedData])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={openDialog}>
                    <FileEdit className="mr-2 h-4 w-4"/>
                    <span>Edit Playlist Name</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input
                            className="col-span-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        disabled={name === row.name || !receivedData} 
                        onClick={() => editName()} 
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditPlaylistName