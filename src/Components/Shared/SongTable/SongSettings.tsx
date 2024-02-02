import { MoreVertical,FileEdit, Trash2, ListX, ListPlus, ListEnd } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { useState } from "react"
import EditMetadataDialog from "./EditMetadataDialog"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { setQueuedSongs } from "@/Redux/Slices/queuedSongsSlice"
import AddToPlaylistMenu from "./AddToPlaylistMenu"

export interface SongSettingsProps {
    songMetadata: Mp3Metadata;
    isPlaylist: boolean;
    index: number;
}

const SongSettings = (props: SongSettingsProps) => {
    const { songMetadata,isPlaylist,index } = props
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

    const queuedSongs = useAppSelector((state) => state.queuedSongs.value)
    const dispatch = useAppDispatch()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><MoreVertical/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{songMetadata.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                            <FileEdit className="mr-2 h-4 w-4"/>
                            <span>Edit Metadata</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => dispatch(setQueuedSongs([...queuedSongs,songMetadata.title]))}>
                            <ListEnd className="mr-2 h-4 w-4"/>
                            <span>Add to Queue</span>
                        </DropdownMenuItem>
                        
                        <AddToPlaylistMenu 
                            songName={songMetadata.title} 
                            songIndex={index}
                        />
                        
                        {isPlaylist && 
                            <DropdownMenuItem >
                                <ListX className="mr-2 h-4 w-4"/>
                                <span>Remove from This Playlist</span>
                            </DropdownMenuItem>
                        }
                        
                        <DropdownMenuItem >
                            <Trash2 className="mr-2 h-4 w-4"/>
                            <span>Delete From Computer</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditMetadataDialog 
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                songMetadata={songMetadata}
                isPlaylist={isPlaylist}
            />
        </>
    )
}

export default SongSettings