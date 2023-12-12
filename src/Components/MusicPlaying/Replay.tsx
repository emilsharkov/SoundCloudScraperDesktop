import { Button } from "@/Components/ui/button"
import { Repeat } from 'lucide-react';
import { Repeat1 } from 'lucide-react';
import { useState } from "react"
import { ReplayingType } from "./MusicPlayer";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setReplayingType } from "@/Redux/Slices/replayingTypeSlice";

const ReplayIconData = {
    'NO_REPLAY': {
        icon: Repeat,
        color: 'black',
    },
    'REPLAY_PLAYLIST': {
        icon: Repeat,
        color: '#1ed760',
    },
    'REPLAY_SONG': {
        icon: Repeat1,
        color: '#1ed760',
    }
}

const Replay = () => {
    const replayingType = useAppSelector((state) => state.replayingType.value)
    const dispatch = useAppDispatch()
    const Icon = ReplayIconData[replayingType]

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
            <Icon.icon color={Icon.color} strokeWidth={1.5}/>
        </Button>
    )
}
export default Replay