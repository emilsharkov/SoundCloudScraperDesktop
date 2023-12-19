import { Button } from "@/Components/ui/button"
import { play } from "@/Redux/Slices/audioSlice";
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { FastForward, Rewind } from 'lucide-react';

interface skipProps {
    skipForward: boolean;
}

const Skip = (props: skipProps) => {
    const { skipForward } = props
    const audio = useAppSelector((state) => state.audio.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const dispatch = useAppDispatch()
    
    const Icon = skipForward ? FastForward: Rewind
    const move = skipForward ? 1: -1
    const disabled = skipForward ? (currentQueueIndex === musicQueue.length - 1 || musicQueue.length === 1) : (currentQueueIndex === 0)

    const skip = () => {
        dispatch(setCurrentQueueIndex(currentQueueIndex + move))
        audio.currentTime = 0
        // dispatch(play())
    }

    return (
        <Button size="icon" variant="ghost" disabled={disabled} onClick={() => skip()}>
            <Icon strokeWidth={1.5}/>
        </Button>
    )
}
export default Skip