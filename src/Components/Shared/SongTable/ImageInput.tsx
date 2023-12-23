import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/Components/ui/tooltip"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { OpenDialogReturnValue } from "@/Interfaces/electronHandlerReturns"
import { useEffect, useRef, useState } from "react"

const ImageInput = () => {
    const {result,error,receivedData,setArgs} = useElectronHandler<object,OpenDialogReturnValue>('open-file-dialog')
    const [path,setPath] = useState<string>('No file chosen')

    const onClick = () => {
        setArgs({})
    }

    useEffect(() => {
        if(receivedData && !error && result) {
            if(result.canceled) { 
                setPath('No file chosen')
            } else {
                setPath(result.filePaths[0])
            }
        }
    },[receivedData,error,result])

    return (
        <>
            <button onClick={onClick} className="col-span-3 flex h-10 w-full rounded-md border border-input px-3 py-2 bg-transparent text-sm font-medium">
                <div className='whitespace-nowrap'>Choose File</div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="font-normal ml-3 whitespace-nowrap overflow-hidden text-right" style={{ direction: 'rtl' }}>{path}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{path}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </button>
        </>    
    )
}
export default ImageInput