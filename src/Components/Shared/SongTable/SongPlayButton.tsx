import { useEffect, useRef, useState } from "react"
import { Pause as PauseIcon } from 'lucide-react';
import { Play as PlayIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"
import { pause, play } from "@/Redux/Slices/audioSlice";
import { Button } from "@/Components/ui/button";
import { Origin } from "@/Redux/Slices/queueSlice";

export interface SongPlayButtonProps {
    playing: boolean;
    playSong: () => void;
    songOrigin: Origin;
}

const SongPlayButton = (props: SongPlayButtonProps) => {
    const {playing,playSong,songOrigin} = props
    const audio = useAppSelector((state) => state.audio.value)
    const origin = useAppSelector((state) => state.queue.origin)
    const [songPlaying,setSongPlaying] = useState<boolean>(playing && origin === songOrigin)
    const clicked = useRef<boolean>(false)
    const Icon = songPlaying ? PauseIcon : PlayIcon
    const dispatch = useAppDispatch()

    useEffect(() => {
        setSongPlaying(playing && origin === songOrigin)
    }, [playing, origin, songOrigin])

    useEffect(() => {
        if(!clicked.current) {
            return
        }
        else if(songPlaying) {
            dispatch(setIsPlaying(true))
        } else {
            dispatch(setIsPlaying(false))
        }
    },[songPlaying])

    const onClick = () => {
        if(!clicked.current) {
            clicked.current = true
            if(songPlaying) {
                setSongPlaying(false)
            } else {
                playSong()
                setSongPlaying(true)
            }
        } else {
            setSongPlaying(!songPlaying)
        }
    }

    return (
        <Button 
            className="p-2" 
            size="icon" 
            variant="ghost" 
            disabled={audio.src === ''} 
            onClick={onClick}
        >
            <Icon strokeWidth={1.25}/>
        </Button>
    )
}
export default SongPlayButton