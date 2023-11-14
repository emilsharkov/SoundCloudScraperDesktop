import { useState, useEffect } from "react"
import { FileDialogResult } from "@/Interfaces/FileDialogResult"
const { ipcRenderer } = window.require('electron')


export const useOpenFileDialog = () => {
    const [path,setPath] = useState<FileDialogResult>()
    const [dialogClosed,setDialogClosed] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    useEffect(() => {
        if(openDialog) { 
            setDialogClosed(false) 
        }
    },[openDialog])

    useEffect(() => {
        const getFilePath = async() => {
            try {
                if (!(openDialog && !dialogClosed)) { return }
                const content = await ipcRenderer.invoke('open-file-dialog');
                console.log(content)
                setPath(content)
                setDialogClosed(true)
                setOpenDialog(false)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getFilePath()
    },[dialogClosed])
    
    return {path,dialogClosed,setOpenDialog}
}