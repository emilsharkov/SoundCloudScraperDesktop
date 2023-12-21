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

export interface SongSettingsProps {
    songMetadata: Mp3Metadata,
    isPlaylist: boolean
}

const SongSettings = (props: SongSettingsProps) => {
    const { songMetadata,isPlaylist } = props
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
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <ListPlus className="mr-2 h-4 w-4"/>
                                <span>Add to Playlist</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <span>Playlist1</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Playlist2</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span>More...</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
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
            />
        </>
    )
}

export default SongSettings