import { Button } from "@/Components/ui/button"
import { play } from "@/Redux/Slices/audioSlice";
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice";
import { setIsPlaying } from "@/Redux/Slices/isPlayingSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { FastForward, Rewind } from 'lucide-react';

interface skipProps {
    skipForward: boolean;
}

const Skip = (props: skipProps) => {
    const { skipForward } = props
    const audio = useAppSelector((state) => state.audio.value)
    const replayingType = useAppSelector((state) => state.replayingType.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const dispatch = useAppDispatch()
    
    const Icon = skipForward ? FastForward: Rewind
    const move = skipForward ? 1: -1
    const isReplaying = replayingType === 'REPLAY_PLAYLIST' || replayingType === 'REPLAY_SONG'
    const isLastIndex = currentQueueIndex === musicQueue.length - 1
    const isFirstIndex = currentQueueIndex === 0
    const disabled = isReplaying ? false : (skipForward ? isLastIndex || musicQueue.length === 1 : isFirstIndex)

    const skip = () => {
        if(isReplaying) {
            let index = null
            if(isLastIndex && skipForward) {
                index = 0
            } else if(isFirstIndex && !skipForward){
                index = musicQueue.length - 1
            } else {
                index = currentQueueIndex + move
            }
            dispatch(setCurrentQueueIndex(index))
        } else {
            dispatch(setCurrentQueueIndex(currentQueueIndex + move))
        }
    }

    return (
        <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled || audio.src === '' || musicQueue.length === 1} 
            onClick={() => skip()}
        >
            <Icon strokeWidth={1.5}/>
        </Button>
    )
}
export default Skip