import { useState, useEffect } from "react";
const { ipcRenderer } = window.require('electron');

const useElectronHandler = <T,V>() => {
    const [electronEvent,setElectronEvent] = useState<string>('')
    const [input,setInput] = useState<T | null>(null)
    const [result,setResult] = useState<V | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [receivedData,setReceivedData] = useState<boolean>(true)

    useEffect(() => {
        if(electronEvent !== '') { 
            setReceivedData(false) 
        }
    },[electronEvent])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!receivedData || electronEvent === '') { return }
                const response: V = await ipcRenderer.invoke(electronEvent, input)
                setResult(response)
                setError(null)
            } catch (err) {
                console.error('Error in useGenericHook:', err);
                setError((err as Error).message)
                setResult(null)
            }
            
            setElectronEvent('')
            setReceivedData(true)
            setInput(null)
        }
  
        fetchData();
    },[receivedData]);
  
    return {result,error,receivedData,setElectronEvent,setInput};
  };

export default useElectronHandler