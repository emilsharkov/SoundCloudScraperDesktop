import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { EditMetadataArgs } from "@/Interfaces/electronHandlerInputs"
import { MouseEventHandler, useEffect, useState } from "react"
import FileSystemInput from "./FileSystemInput"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { useAppDispatch } from "@/Redux/hooks"
import { refreshDownloads, refreshPlaylist } from "@/Redux/Slices/refreshDataSlice"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
import { FileEdit } from "lucide-react"
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"

export interface EditMetadataDialogProps {
    row: SongRow;
    isPlaylist: boolean;
    playlist_id?: number;
}

const EditMetadata = (props: EditMetadataDialogProps) => {
    const {row,isPlaylist} = props
    const {title,artist,duration_seconds,song_id,song_order} = row
    const [open,setOpen] = useState<boolean>(false)
    const [newTitle,setNewTitle] = useState<string>(title)
    const [newArtist,setNewArtist] = useState<string>(artist)
    const [newImgPath,setNewImgPath] = useState<string>('')
    const {result,error,receivedData,setArgs} = useElectronHandler<EditMetadataArgs,boolean>('edit-mp3-metadata')
    const dispatch = useAppDispatch()

    const openDialog = (e: Event) => {
        e.preventDefault()
        setOpen(true)
    }

    useEffect(() => {
        if(receivedData && !error && result) {
            setOpen(false)
            isPlaylist? dispatch(refreshPlaylist()): dispatch(refreshDownloads())
        }
    },[receivedData,error,result])

    const submitDialog = () => {
        setArgs({
            song_id: song_id,
            title: newTitle,
            artist: newArtist,
            newImagePath: newImgPath
        })
    }

    const validateInput = (e: React.ChangeEvent<HTMLInputElement>, setState: (state: string) => void) => {
        const inputValue = e.target.value;
        const filteredValue = inputValue.replace(/[\\/:*?"<>|]/g, '');
        console.log(filteredValue)
        setState(filteredValue)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={openDialog}>
                    <FileEdit className="mr-2 h-4 w-4"/>
                    <span>Edit Metadata</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your song metadata here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Title</Label>
                        <Input
                            value={newTitle}
                            defaultValue={newTitle}
                            className="col-span-3"
                            onChange={(e) => validateInput(e,setNewTitle)}
                        />
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Artist</Label>
                        <Input
                            className="col-span-3"
                            value={newArtist}
                            defaultValue={newArtist}
                            onChange={(e) => validateInput(e,setNewArtist)}
                        />
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Image</Label>
                        <FileSystemInput 
                            dialogType="file"
                            path={newImgPath} 
                            setPath={setNewImgPath}  
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        disabled={!receivedData || newTitle === title && newArtist === artist && newImgPath === ''} 
                        onClick={() => submitDialog()} 
                    >Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditMetadata