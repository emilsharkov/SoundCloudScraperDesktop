import { MoreVertical,FileEdit, Trash2, ListX, ListPlus, ListEnd } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import EditMetadata from "./EditMetadata"
import AddToPlaylistMenu from "./AddToPlaylistMenu"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
import AddToQueue from "./AddToQueue"
import RemoveFromPlaylist from "./RemoveFromPlaylist"
import DeleteFromComputer from "./DeleteFromComputer"

export interface SongSettingsProps {
    row: SongRow;
    playlistID?: number;
}

const SongSettings = (props: SongSettingsProps) => {
    const {row,playlistID} = props
    

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="p-0" variant="outline"><MoreVertical/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                    <DropdownMenuLabel>{row.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>

                        <EditMetadata row={row} isPlaylist={!!playlistID}/>
                                                
                        <AddToQueue row={row}/>

                        <AddToPlaylistMenu playlist_id={playlistID} row={row}/>
                        
                        {playlistID && <RemoveFromPlaylist row={row} playlist_id={playlistID}/>}
                        
                        <DeleteFromComputer row={row} isPlaylist={!!playlistID}/>

                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
        </>
    )
}

export default SongSettings