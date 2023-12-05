import { useAppDispatch } from "@/Redux/hooks"
import { setToastError } from "@/Redux/Slices/toastErrorSlice"
import { useState, useEffect } from "react"
const { ipcRenderer } = window.require('electron')

const useElectronHandler = <T,V>(electronEvent: string) => {
    const [args,setArgs] = useState<T | null>(null)
    const [result,setResult] = useState<V | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [receivedData,setReceivedData] = useState<boolean>(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(args !== null) {
            setReceivedData(false) 
        }
    },[args])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(receivedData) { return }
                const response: V = await ipcRenderer.invoke(electronEvent, args)
                setResult(response)
                setError(null)
            } catch (err) {
                setResult(null)
                dispatch(setToastError((err as Error).message))
                setError((err as Error).message)
            }
            
            setReceivedData(true)
            setArgs(null)
        }
  
        fetchData()
    },[receivedData])
  
    return {result,error,receivedData,setArgs}
}

export default useElectronHandler