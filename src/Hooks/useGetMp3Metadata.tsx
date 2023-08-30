import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron');

export const useGetMp3Metadata = () => {
    const [mp3Metadata,setMp3Metadata] = useState()
    const [receivedMp3Metadata,setReceivedMp3Metadata] = useState<boolean>(true)

    useEffect(() => {
        const getMp3Metadata = async() => {
            try {
                if (receivedMp3Metadata) { return }
                const content = await ipcRenderer.invoke('get-mp3-metadata')
                setMp3Metadata(content)
                setReceivedMp3Metadata(true)
            } catch (error) {
                console.error('Error communicating with main process:', error);
            }
        }
        getMp3Metadata()
    },[])

    return { mp3Metadata, setReceivedMp3Metadata }
}