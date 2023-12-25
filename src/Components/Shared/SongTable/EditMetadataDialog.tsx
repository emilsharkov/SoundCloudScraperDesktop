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
import { EditMetadataArgs, Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { useEffect, useState } from "react"
import ImageInput from "./ImageInput"
import useElectronHandler from "@/Hooks/useElectronHandler"

export interface EditMetadataDialogProps {
    songMetadata: Mp3Metadata,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditMetadataDialog = (props: EditMetadataDialogProps) => {
    const {open,setOpen} = props
    const { title,artist,imgPath,duration } = props.songMetadata
    const [newTitle,setNewTitle] = useState<string>(title)
    const [newArtist,setNewArtist] = useState<string>(artist)
    const [newImgPath,setNewImgPath] = useState<string>(imgPath)
    const {result,error,receivedData,setArgs} = useElectronHandler<EditMetadataArgs,void>('edit-mp3-metadata')

    console.log(newImgPath)

    useEffect(() => {
        if(receivedData && !error) {
            setOpen(false)
        }
    },[receivedData,error])

    const submitDialog = () => {
        setArgs({
            originalTitle: title,
            metadata: {
                title: newTitle,
                artist: newArtist,
                imgPath: newImgPath,
                duration: duration
            }
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
                        disabled={!receivedData || newTitle === title && newArtist === artist && newImgPath === imgPath} 
                        onClick={() => submitDialog()} 
                    >Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditMetadataDialog