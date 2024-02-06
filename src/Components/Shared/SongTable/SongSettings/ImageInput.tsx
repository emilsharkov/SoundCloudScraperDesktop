import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/Components/ui/tooltip"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { OpenDialogReturnValue } from "@/Interfaces/electronHandlerReturns";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react"

export interface ImageInputProps {
    newImgPath: string;
    setNewImgPath: (imgPath: string) => void;
}

const ImageInput = (props: ImageInputProps) => {
    const {newImgPath,setNewImgPath} = props
    const {result,error,receivedData,setArgs} = useElectronHandler<object,OpenDialogReturnValue>('open-file-dialog')
    const [path,setPath] = useState<string>('No file chosen')

    const openFileDialog = () => {
        setArgs({})
    }

    const onXClick = (event: React.MouseEvent) => {
        setNewImgPath(newImgPath)
        setPath('No file chosen')
        event.stopPropagation();
    }; 

    useEffect(() => {
        if(receivedData && !error && result) {
            if(result.canceled) { 
                setPath('No file chosen')
                setNewImgPath(newImgPath)
            } else {
                setPath(result.filePaths[0])
                setNewImgPath(result.filePaths[0])
            }
        }
    },[receivedData,error,result])

    return (
        <>
            <button onClick={openFileDialog} className="col-span-3 flex h-10 w-full rounded-md border border-input px-3 py-2 bg-transparent text-sm font-medium">
                <div className='whitespace-nowrap'>Choose File</div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div 
                                className="flex flex-row items-end overflow-hidden" 
                                style={{ direction: 'rtl' }}
                            >
                                {path !== 'No file chosen' ? <button onClick={onXClick} className=''><X className="h-4"/></button>: null}
                                <div className="flex font-normal ml-3 whitespace-nowrap overflow-hidden text-right">
                                    {path}
                                </div>
                            </div>
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