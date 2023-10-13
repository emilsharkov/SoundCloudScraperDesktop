import { Button } from "@/Components/ui/button"
import replay from '../../Assets/replay.svg'
import { useState } from "react"

interface ReplayProps {
    replayingType: number;
    setReplayingType: React.Dispatch<React.SetStateAction<number>>;
}

const Replay = (props: ReplayProps) => {
    const {replayingType,setReplayingType} = props
    const replayColor = replayingType === 0 ? '' : replayingType === 1 ? 'text-orange' : 'text-red'

    const changeReplayingType = () => {
        let newReplayingType = null
        if(replayingType === 0){
            newReplayingType = 1
        } else if(replayingType === 1){
            newReplayingType = 2
        } else{
            newReplayingType = 0
        }
        setReplayingType(newReplayingType)
    }

    return (
        <Button size="icon" variant="ghost" onClick={() => changeReplayingType()}>
            <img src={replay}/>
        </Button>
    )
}
export default Replay