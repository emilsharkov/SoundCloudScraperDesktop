import { MoreVertical } from "lucide-react"
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

export interface SongSettingsProps {
    songMetadata: Mp3Metadata,
    isPlaylist: boolean
}

const SongSettings = (props: SongSettingsProps) => {
    const { songMetadata,isPlaylist } = props
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

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
                            <span>Edit Metadata</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem >
                            <span>Add to Queue</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <span>Add to Playlist</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <span>Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Message</span>
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
                                <span>Remove from This Playlist</span>
                            </DropdownMenuItem>
                        }
                        <DropdownMenuItem >
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