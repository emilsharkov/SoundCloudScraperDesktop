import { Button } from "@/Components/ui/button"
import replay from '../../Assets/replay.svg'
import { useState } from "react"
import { ReplayingType } from "./MusicPlayer";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setReplayingType } from "@/Redux/Slices/replayingTypeSlice";

const Replay = () => {
    const replayingType = useAppSelector((state) => state.replayingType.value)
    const dispatch = useAppDispatch()
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
        dispatch(setReplayingType(newReplayingType))
    }

    return (
        <Button size="icon" variant="ghost" onClick={() => changeReplayingType()}>
            <img className={replayColor} src={replay}/>
        </Button>
    )
}
export default Replay