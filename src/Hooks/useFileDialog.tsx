import { useState, useEffect } from "react"
import { FileDialogResult } from "@/Interfaces/FileDialogResult"
const { ipcRenderer } = window.require('electron')


export const useFileDialog = () => {
    const [path,setPath] = useState<FileDialogResult>()
    const [isDone,setIsDone] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (!openDialog) { return }
                const content = await ipcRenderer.invoke('open-file-dialog');
                console.log(content)
                setPath(content)
                setIsDone(true)
                setOpenDialog(false)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[openDialog])
    
    return {path,isDone,setOpenDialog}
}