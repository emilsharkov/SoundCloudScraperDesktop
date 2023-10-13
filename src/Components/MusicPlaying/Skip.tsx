import { useContext, useMemo, useCallback } from 'react'
import { Button } from "@/Components/ui/button"
import SkipBack from '../../Assets/skip-back.svg'
import SkipForward from '../../Assets/skip-forward.svg'
import useMusicPlaying from '@/Hooks/useMusicPlaying';

interface skipProps {
    skipForward: boolean;
}

const Skip = (props: skipProps) => {
    const {musicQueue,currentQueueIndex,setCurrentQueueIndex} = useMusicPlaying()
    const buttonSVG = useMemo(() => props.skipForward ? SkipForward: SkipBack, [props.skipForward])

    const skip = useCallback(() => {
        const move: number = props.skipForward ? 1: -1
        if(!(move + currentQueueIndex <= musicQueue.length || move + currentQueueIndex <= -1)) {
            setCurrentQueueIndex(currentQueueIndex + move)
        }
    },[props.skipForward])

    return (
        <Button size="icon" variant="ghost" onClick={() => skip()}>
            <img src={buttonSVG}/>
        </Button>
    )
}
export default Skip