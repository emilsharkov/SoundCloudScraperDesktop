import { Slider } from "@/Components/ui/slider"
import useElectronHandler from "@/Hooks/useElectronHandler";
import { SongIDsArgs } from "@/Interfaces/electronHandlerInputs";
import { SongRow } from "@/Interfaces/electronHandlerReturns";
import { useAppSelector } from "@/Redux/hooks";
import { useEffect, useState } from "react";

export interface SongSliderProps {
    disabled: boolean;
}

const SongSlider = (props: SongSliderProps) => {
    const {disabled} = props

    const audio = useAppSelector((state) => state.audio.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const [seconds,setSeconds] = useState<number>(0)
    const [duration,setDuration] = useState<number>(0)
    const {result,error,receivedData,setArgs} = useElectronHandler<SongIDsArgs,SongRow[]>('get-mp3-metadata')

    useEffect(() => {
        if(musicQueue.length && currentQueueIndex !== -1) {
            setArgs({
                song_ids: [musicQueue[currentQueueIndex]]
            })
        }
    },[musicQueue,currentQueueIndex])

    useEffect(() => {
        if(receivedData && !error && result) {
            setDuration(result[0].duration_seconds)
        }
    },[result,error,receivedData])

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
            disabled={disabled || !!error || !result || !receivedData}
            defaultValue={[0]}
            value={[seconds]}
            max={duration}
            step={1}
            onValueChange={(value) => seek(value)}
        />
    )
}
export default SongSlider