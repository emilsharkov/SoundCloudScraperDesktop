import { MoreVertical } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { PlaylistRow } from "@/Interfaces/electronHandlerReturns"
import DeletePlaylist from "./DeletePlaylist"
import EditPlaylistName  from "./EditPlaylistName"
import AddSongToPlaylist from "./AddSongToPlaylist"

export interface PlaylistSettingsProps {
    row: PlaylistRow;
}

const PlaylistSettings = (props: PlaylistSettingsProps) => {
    const {row} = props

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="p-0" variant="outline"><MoreVertical/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{row.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <AddSongToPlaylist/>
                        <EditPlaylistName row={row}/>
                        <DeletePlaylist row={row}/>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
        </>
    )
}

export default PlaylistSettings