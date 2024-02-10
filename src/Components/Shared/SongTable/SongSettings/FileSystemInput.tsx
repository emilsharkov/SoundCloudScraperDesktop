import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/Components/ui/tooltip"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { OpenDialogReturnValue } from "@/Interfaces/electronHandlerReturns";
import { dialog } from "electron";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react"

export interface FileSystemInputProps {
    path: string;
    setPath: (imgPath: string) => void;
    dialogType: 'folder' | 'file';
}

const FileSystemInput = (props: FileSystemInputProps) => {
    const {path,setPath,dialogType} = props
    const {result,error,receivedData,setArgs} = useElectronHandler<object,OpenDialogReturnValue>(`open-${dialogType}-dialog`)

    const openFileDialog = () => {
        setArgs({})
    }

    const onXClick = (event: React.MouseEvent) => {
        setPath('')
        event.stopPropagation();
    }

    useEffect(() => {
        if(receivedData && !error && result) {
            if(result.canceled) { 
                setPath('')
            } else {
                setPath(result.filePaths[0])
            }
        }
    },[receivedData,error,result])

    return (
        <>
            <button onClick={openFileDialog} className="col-span-3 flex h-10 w-full rounded-md border border-input px-3 py-2 bg-transparent text-sm font-medium">
                <div className='whitespace-nowrap'>Choose {dialogType}</div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div 
                                className="flex flex-row items-end overflow-hidden" 
                                style={{ direction: 'rtl' }}
                            >
                                {path !== '' ? <button onClick={onXClick} className=''><X className="h-4"/></button>: null}
                                <div className="flex font-normal ml-3 whitespace-nowrap overflow-hidden text-right">
                                    {path !== '' ? path : 'No file chosen'}
                                </div>
                            </div>
                        </TooltipTrigger>
                        {path !== '' ? <TooltipContent><p>{path}</p></TooltipContent>: null}
                    </Tooltip>
                </TooltipProvider>
            </button>
        </>    
    )
}
export default FileSystemInput