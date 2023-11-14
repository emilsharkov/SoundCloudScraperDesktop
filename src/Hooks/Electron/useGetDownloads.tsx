import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useGetDownloads = () => {
    const [downloads,setDownloads] = useState<string[]>([])
    const [receivedDownloads,setReceivedDownloads] = useState<boolean>(true);

    useEffect(() => {
        const getDownloads = async() => {
            try {
                if (receivedDownloads) { return }
                const content: string[] = await ipcRenderer.invoke('get-downloads')
                setDownloads(content)
                setReceivedDownloads(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getDownloads()
    },[receivedDownloads])
    
    return {downloads,setReceivedDownloads}
}