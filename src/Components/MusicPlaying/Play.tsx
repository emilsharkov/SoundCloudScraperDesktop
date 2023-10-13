import { useEffect, useState } from "react"

interface PlayProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const Play = (props: PlayProps) => {
    const [isPlaying,setIsPlaying] = useState<boolean>(false)
    
    useEffect(() => {
        if(isPlaying) {
            props.audioRef.current?.pause()
        } else{
            props.audioRef.current?.play()
        }
    },[isPlaying])

    return (
        {}
    )
}
export default Play