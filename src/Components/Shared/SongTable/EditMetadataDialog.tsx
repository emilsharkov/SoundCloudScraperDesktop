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
import { useEffect, useState } from "react"
import ImageInput from "./ImageInput"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { useAppDispatch } from "@/Redux/hooks"
import { refreshDownloads, refreshPlaylist } from "@/Redux/Slices/refreshDataSlice"
import { SongRow } from "@/Interfaces/electronHandlerReturns"

export interface EditMetadataDialogProps {
    row: SongRow;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isPlaylist: boolean;
}

const EditMetadataDialog = (props: EditMetadataDialogProps) => {
    const {open,setOpen,row,isPlaylist} = props
    const {title,artist,duration_seconds,song_id,song_order} = row
    const [newTitle,setNewTitle] = useState<string>(title)
    const [newArtist,setNewArtist] = useState<string>(artist)
    const [newImgPath,setNewImgPath] = useState<string>('')
    const {result,error,receivedData,setArgs} = useElectronHandler<EditMetadataArgs,boolean>('edit-mp3-metadata')
    const dispatch = useAppDispatch()

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            defaultValue={newTitle}
                            className="col-span-3"
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Artist</Label>
                        <Input
                            className="col-span-3"
                            defaultValue={newArtist}
                            onChange={(e) => setNewArtist(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Image</Label>
                        <ImageInput newImgPath={newImgPath} setNewImgPath={setNewImgPath} />
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

export default EditMetadataDialog