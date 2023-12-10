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
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { useState } from "react"

export interface EditMetadataDialogProps {
    songMetadata: Mp3Metadata,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditMetadataDialog = (props: EditMetadataDialogProps) => {
    const {open,setOpen} = props
    const { title,artist,imgPath } = props.songMetadata
    const [newTitle,setNewTitle] = useState<string>(title)
    const [newArtist,setNewArtist] = useState<string>(artist ?? '')
    const [newImgPath,setNewImgPath] = useState<string>(imgPath ?? '')
    
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
                            onChange={(e) => setNewArtist(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Image</Label>
                        <Input
                            className="col-span-3"
                            onChange={(e) => setNewImgPath(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        disabled={newTitle === title && newArtist === artist && newImgPath === imgPath} 
                        onClick={() => console.log()} 
                    >Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditMetadataDialog