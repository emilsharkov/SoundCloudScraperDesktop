import { Slider } from "@/Components/ui/slider"
import { useEffect, useState } from "react";

interface SongSliderProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const SongSlider = (props: SongSliderProps) => {
    const { audioRef } = props
    const duration = audioRef.current?.duration ?? 0
    const [seconds,setSeconds] = useState<number>(0)

    useEffect(() => {
        const handleTimeUpdate = () => setSeconds(audioRef.current?.currentTime ?? 0)
        audioRef.current?.addEventListener('timeupdate', handleTimeUpdate)
        return () => audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate)
    }, [audioRef])

    const seek = (seekedTo: number[]) => {
        if(audioRef.current && seekedTo.length && seekedTo[0] >= 0 && seekedTo[0] <= duration) {
            audioRef.current.currentTime = seekedTo[0]
        }
    }

    return (
        <Slider 
            className="flex-1" 
            defaultValue={[seconds]}
            max={duration}
            step={1}
            onValueChange={(value) => seek(value)}
        />
    )
}
export default SongSlider