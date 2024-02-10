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
import { Button } from "@/Components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/Redux/hooks"
import { refreshPlaylists } from "@/Redux/Slices/refreshDataSlice"
import { CreatePlaylistArgs } from "@/Interfaces/electronHandlerInputs"
import { PlaylistRow } from "@/Interfaces/electronHandlerReturns"


const NewPlaylistButton = () => {
    const [open,setOpen] = useState<boolean>(false)
    const [name,setName] = useState<string>('')
    const [isSubmitted,setIsSubmitted] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<CreatePlaylistArgs,PlaylistRow[]>('create-playlist')
    const dispatch = useAppDispatch()

    const createPlaylist = () => {
        setArgs({name: name})
        setIsSubmitted(true)
    }

    useEffect(() => {
        if(result && !error && receivedData) {
            setOpen(false)
            setIsSubmitted(false)
            setName('')
            dispatch(refreshPlaylists())
        }
    },[result,error,receivedData])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create Playlist</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
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
                        disabled={name === '' || isSubmitted} 
                        onClick={() => createPlaylist()} 
                    >
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewPlaylistButton