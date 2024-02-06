import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import { SongRow } from "@/Interfaces/electronHandlerReturns";
import { setQueuedSongs } from "@/Redux/Slices/queuedSongsSlice"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { ListEnd } from "lucide-react"

export interface AddToQueueProps {
    row: SongRow;
}

const AddToQueue = (props: AddToQueueProps) => {
    const {row} = props
    const queuedSongs = useAppSelector((state) => state.queuedSongs.value)
    const dispatch = useAppDispatch()

    return (
        <>
            <DropdownMenuItem onClick={() => dispatch(setQueuedSongs([...queuedSongs,row.song_id]))}>
                <ListEnd className="mr-2 h-4 w-4"/>
                <span>Add to Queue</span>
            </DropdownMenuItem>
        </>
    )
}

export default AddToQueue