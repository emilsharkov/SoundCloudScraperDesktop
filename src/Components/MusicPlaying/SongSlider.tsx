import { Slider } from "@/Components/ui/slider"
import { useAppSelector } from "@/Redux/hooks";
import { useEffect, useState } from "react";

export interface SongSliderProps {
    disabled: boolean;
}

const SongSlider = (props: SongSliderProps) => {
    const {disabled} = props

    const audio = useAppSelector((state) => state.audio.value)
    const duration = audio.duration ?? 0
    const [seconds,setSeconds] = useState<number>(0)

    useEffect(() => {
        const handleTimeUpdate = () => setSeconds(audio.currentTime ?? 0)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        return () => audio.removeEventListener('timeupdate', handleTimeUpdate)
    }, [audio])

    const seek = (seekedTo: number[]) => {
        if(seekedTo.length && seekedTo[0] >= 0 && seekedTo[0] <= duration) {
            audio.currentTime = seekedTo[0]
        }
    }

    return (
        <Slider 
            className="flex-1" 
            disabled={disabled}
            defaultValue={[0]}
            value={[seconds]}
            max={duration}
            step={1}
            onValueChange={(value) => seek(value)}
        />
    )
}
export default SongSlider