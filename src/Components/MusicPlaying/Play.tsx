import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import play from '../../Assets/play.svg'
import pause from '../../Assets/pause.svg'
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice"

interface PlayProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const Play = (props: PlayProps) => {
    const { audioRef } = props
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const dispatch = useAppDispatch()
    const buttonSVG = isPlaying ? pause: play
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
            <img src={buttonSVG}/>
        </Button>
    )
}
export default Play