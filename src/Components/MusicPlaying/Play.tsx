import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import play from '../../Assets/play.svg'
import pause from '../../Assets/pause.svg'

interface PlayProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const Play = (props: PlayProps) => {
    const {audioRef,isPlaying,setIsPlaying} = props
    const buttonSVG = isPlaying ? pause: play
    
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
        <Button className="p-2" size="icon" variant="ghost">
            <img src={buttonSVG}/>
        </Button>
    )
}
export default Play