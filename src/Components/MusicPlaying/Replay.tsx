import { Button } from "@/Components/ui/button"
import replay from '../../Assets/replay.svg'
import { useState } from "react"
import { ReplayingType } from "./MusicPlayer";

interface ReplayProps {
    replayingType: ReplayingType;
    setReplayingType: React.Dispatch<React.SetStateAction<ReplayingType>>;
}

const Replay = (props: ReplayProps) => {
    const {replayingType,setReplayingType} = props
    const replayColor = replayingType === 'NO_REPLAY' ? '' : replayingType === 'REPLAY_PLAYLIST' ? 'fill-orange-300	' : 'fill-red-300	'

    const changeReplayingType = () => {
        let newReplayingType: ReplayingType | null = null
        if(replayingType === 'NO_REPLAY'){
            newReplayingType = 'REPLAY_PLAYLIST'
        } else if(replayingType === 'REPLAY_PLAYLIST'){
            newReplayingType = 'REPLAY_SONG'
        } else{
            newReplayingType = 'NO_REPLAY'
        }
        setReplayingType(newReplayingType)
    }

    return (
        <Button size="icon" variant="ghost" onClick={() => changeReplayingType()}>
            <img className={replayColor} src={replay}/>
        </Button>
    )
}
export default Replay