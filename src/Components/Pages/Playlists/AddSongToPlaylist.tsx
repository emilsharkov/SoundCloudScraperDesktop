import { DropdownMenuItem } from "@/Components/ui/dropdown-menu"
import { setCurrentRoute } from "@/Redux/Slices/currentRouteSlice"
import { useAppDispatch } from "@/Redux/hooks"
import { ListPlus } from "lucide-react"

const AddSongToPlaylist = () => {
    const dispatch = useAppDispatch()

    return (
        <DropdownMenuItem onSelect={() => dispatch(setCurrentRoute('Downloads'))}>
            <ListPlus className="mr-2 h-4 w-4"/>
            <span>Add Songs to Playlist</span>
        </DropdownMenuItem>
    )
}

export default AddSongToPlaylist