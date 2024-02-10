import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Pause as PauseIcon } from 'lucide-react';
import { Play as PlayIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"
import { pause, play } from "@/Redux/Slices/audioSlice";

export interface PlayProps {
    disabled: boolean;
}

const Play = (props: PlayProps) => {
    const {disabled} = props

    const audio = useAppSelector((state) => state.audio.value)
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const dispatch = useAppDispatch()
    const Icon = isPlaying ? PauseIcon: PlayIcon

    useEffect(() => {
        if(audio.src) {
            isPlaying ? dispatch(play()): dispatch(pause())
        }
    },[isPlaying])

    return (
        <Button 
            className="p-2" 
            size="icon" 
            variant="ghost" 
            disabled={disabled} 
            onClick={() => dispatch(setIsPlaying(!isPlaying))}
        >
            <Icon strokeWidth={1.25}/>
        </Button>
    )
}
export default Play