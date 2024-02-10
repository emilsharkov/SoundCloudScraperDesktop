import { useEffect, useRef, useState } from "react"
import { Pause as PauseIcon } from 'lucide-react';
import { Play as PlayIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"
import { pause, play } from "@/Redux/Slices/audioSlice";
import { Button } from "@/Components/ui/button";
import { Origin } from "@/Redux/Slices/queueSlice";

export interface SongPlayButtonProps {
    playSong: () => void;
    songOrigin: Origin;
    isCurrentSong: boolean;
}

const SongPlayButton = (props: SongPlayButtonProps) => {
    const {playSong,songOrigin,isCurrentSong} = props
    const audio = useAppSelector((state) => state.audio.value)
    const origin = useAppSelector((state) => state.queue.origin)
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const [rowPlaying,setRowPlaying] = useState<boolean>(isPlaying && isCurrentSong && origin === songOrigin)
    const clicked = useRef<boolean>(false)
    const Icon = rowPlaying ? PauseIcon : PlayIcon
    const dispatch = useAppDispatch()

    useEffect(() => {
        setRowPlaying(isPlaying && isCurrentSong && origin === songOrigin)
    }, [isCurrentSong, isPlaying, origin, songOrigin])

    useEffect(() => {
        if(!clicked.current) {
            return
        }
        else if(rowPlaying) {
            dispatch(setIsPlaying(true))
        } else {
            dispatch(setIsPlaying(false))
        }
    },[rowPlaying])

    const onClick = () => {
        if(!clicked.current) {
            clicked.current = true
            if(!rowPlaying && origin === songOrigin && isCurrentSong) {
                setRowPlaying(true)
            } else if(rowPlaying) {
                setRowPlaying(false)
            } else {
                playSong()
                setRowPlaying(true)
            }
        } else {
            setRowPlaying(!rowPlaying)
        }
    }

    return (
        <Button 
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