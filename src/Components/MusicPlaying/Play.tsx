import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Pause as PauseIcon } from 'lucide-react';
import { Play as PlayIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"

interface PlayProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    inSongTableRow: boolean;
    rowSong?: string
}

const Play = (props: PlayProps) => {
    const { audioRef,inSongTableRow,rowSong } = props
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const currentSong = useAppSelector((state) => state.currentSong.value)
    const dispatch = useAppDispatch()
    const Icon = inSongTableRow ? (isPlaying && rowSong && rowSong === currentSong ? PauseIcon: PlayIcon) :(isPlaying ? PauseIcon: PlayIcon)
    const [disabled,setDisabled] = useState<boolean>(audioRef.current?.src === window.location.href)

    useEffect(() => {
        setDisabled(audioRef.current?.src === window.location.href)
    }, [audioRef.current])

    useEffect(() => {
        if(audioRef.current?.src) {
            if(isPlaying) {
                audioRef.current?.play()
            } else{
                audioRef.current?.pause()
            }
        }
    },[audioRef,isPlaying])

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