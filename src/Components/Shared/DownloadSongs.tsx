import useElectronHandler from "@/Hooks/useElectronHandler"
import { Button } from "../ui/button"
import { ExportSongsArgs } from "@/Interfaces/electronHandlerInputs"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { FolderDown } from 'lucide-react'
import { Progress } from "@/Components/ui/progress"
import FileSystemInput from "./SongTable/SongSettings/FileSystemInput"
import { SongRow } from "@/Interfaces/electronHandlerReturns"

export interface DownloadSongsProps {
    songs: SongRow[]
}

const DownloadSongs = (props: DownloadSongsProps) => {
    const {songs} = props
    const [folderPath,setFolderPath] = useState<string>('')
    const [open,setOpen] = useState<boolean>(false)
    const [downloadIndex,setDownloadIndex] = useState<number>(0)
    const [dialogSubmitted,setDialogSubmitted] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<ExportSongsArgs,boolean>('export-songs')

    useEffect(() => {
        if(receivedData && !error && result) {
            if(downloadIndex !== songs.length) {
                setArgs({
                    destination: folderPath,
                    song_id: songs[downloadIndex].song_id
                })
                setDownloadIndex(downloadIndex + 1)
            }
            
        }
    },[receivedData,error,result])

    const submitDialog = () => {
        setDialogSubmitted(true)
        setArgs({
            destination: folderPath,
            song_id: songs[0].song_id
        })
        setDownloadIndex(downloadIndex + 1)
    }

    const closeDialog = () => {
        setDialogSubmitted(false)
        setFolderPath('')
        setDownloadIndex(0)
    }

    useEffect(() => {
        if(!open) {
            closeDialog()
        }
    },[open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' onClick={() => setOpen(true)}>
                    <FolderDown className="mr-2 h-4 w-4"/>
                    <span>Export</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Songs to Folder</DialogTitle>
                    <DialogDescription>
                        Warning: If you have multiple songs with the same name, only one of them will be downloaded to your file system.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Folder</Label>
                        <FileSystemInput 
                            dialogType="folder"
                            path={folderPath} 
                            setPath={setFolderPath}  
                        />
                    </div>
                </div>
                {
                    dialogSubmitted ? (
                        <Progress value={Math.trunc(downloadIndex/songs.length) * 100} />
                    ) : null
                }
                <DialogFooter>
                    {downloadIndex / songs.length === 1 ? (
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    ) : (
                        <Button 
                            disabled={songs.length === 0 || !receivedData || folderPath === '' } 
                            onClick={() => submitDialog()} 
                        >Export</Button>
                    )}
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DownloadSongs