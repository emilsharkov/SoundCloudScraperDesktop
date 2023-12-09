import { Button } from "@/Components/ui/button"
import { FastForward, Rewind } from 'lucide-react';

interface skipProps {
    skipForward: boolean;
    musicQueue: string[],
    currentQueueIndex: number,
    setCurrentQueueIndex: React.Dispatch<React.SetStateAction<number>>,
}

const Skip = (props: skipProps) => {
    const { skipForward,musicQueue,currentQueueIndex,setCurrentQueueIndex } = props
    const Icon = skipForward ? FastForward: Rewind
    const disabled = skipForward ? currentQueueIndex === musicQueue.length - 1 || currentQueueIndex === 0: currentQueueIndex === 0

    const skip = () => {
        const move: number = skipForward ? 1: -1
        setCurrentQueueIndex(currentQueueIndex + move)
    }

    return (
        <Button size="icon" variant="ghost" disabled={disabled} onClick={() => skip()}>
            <Icon strokeWidth={1.5}/>
        </Button>
    )
}
export default Skip