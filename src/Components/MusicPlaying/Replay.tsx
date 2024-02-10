import { Button } from "@/Components/ui/button"
import { Repeat } from 'lucide-react';
import { Repeat1 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { toggleReplayingType } from "@/Redux/Slices/replayingTypeSlice";

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

export interface ReplayProps {
    disabled: boolean;
}

const Replay = (props: ReplayProps) => {
    const {disabled} = props
    const replayingType = useAppSelector((state) => state.replayingType.value)
    const dispatch = useAppDispatch()
    const Icon = ReplayIconData[replayingType]

    return (
        <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            onClick={() => dispatch(toggleReplayingType())}
        >
            <Icon.icon color={Icon.color} strokeWidth={1.5}/>
        </Button>
    )
}
export default Replay