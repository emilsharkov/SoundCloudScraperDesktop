import { useContext, useMemo, useCallback } from 'react'
import { Button } from "@/Components/ui/button"
import SkipBack from '../../Assets/skip-back.svg'
import SkipForward from '../../Assets/skip-forward.svg'
import useMusicPlaying from '@/Hooks/useMusicPlaying';

interface skipProps {
    skipForward: boolean;
    musicQueue: string[],
    currentQueueIndex: number,
    setCurrentQueueIndex: React.Dispatch<React.SetStateAction<number>>,
}

const Skip = (props: skipProps) => {
    const { skipForward,musicQueue,currentQueueIndex,setCurrentQueueIndex } = props
    const buttonSVG = skipForward ? SkipForward: SkipBack
    const disabled = skipForward ? currentQueueIndex >= musicQueue.length: currentQueueIndex <= 0

    const skip = useCallback(() => {
        const move: number = skipForward ? 1: -1
        setCurrentQueueIndex(currentQueueIndex + move)
    },[skipForward])

    return (
        <Button size="icon" variant="ghost" disabled={disabled} onClick={() => skip()}>
            <img src={buttonSVG}/>
        </Button>
    )
}
export default Skip