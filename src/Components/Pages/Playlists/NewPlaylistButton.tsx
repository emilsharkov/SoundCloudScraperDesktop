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
import useElectronHandler from "@/Hooks/useElectronHandler"
import { PlaylistNameArgs } from "@/Interfaces/electronHandlerInputs"
import { PlaylistName } from "@/Interfaces/electronHandlerReturns"
import { Button } from "@/Components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/Redux/hooks"
import { setToastError } from "@/Redux/Slices/toastErrorSlice"


export interface NewPlaylistButtonProps {
    playlists: PlaylistName[] | null,
    refreshPlaylists: (arg: object) => void
}

const NewPlaylistButton = (props: NewPlaylistButtonProps) => {
    const [open,setOpen] = useState<boolean>(false)
    const [name,setName] = useState<string>('')
    const [isSubmitted,setIsSubmitted] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<PlaylistNameArgs,PlaylistName[]>('create-playlist')
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(receivedData) {
            setOpen(false)
            setIsSubmitted(false)
            setName('')
        }
    },[receivedData])

    const createPlaylist = () => {
        if(props.playlists?.some(playlist => playlist.name === name)) {
            setOpen(false)
            dispatch(setToastError('Please choose a unique playlist name!'))
        } else {
            setArgs({playlistName: name})
            props.refreshPlaylists({})
            setIsSubmitted(true)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create Playlist</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input
                            className="col-span-3"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        disabled={name === '' || isSubmitted || !props.playlists} 
                        onClick={() => createPlaylist()} 
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewPlaylistButton