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
    const disabled = audioRef.current?.src === '' || audioRef.current?.src === null
    
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
            onClick={() => setIsPlaying(!isPlaying)}
        >
            <img src={buttonSVG}/>
        </Button>
    )
}
export default Play