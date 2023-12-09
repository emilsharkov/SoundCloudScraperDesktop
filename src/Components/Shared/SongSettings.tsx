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

export interface SongSettingsProps {
    songName: string,
    isPlaylist: boolean
}

const SongSettings = (props: SongSettingsProps) => {
    const { songName,isPlaylist } = props
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><MoreVertical/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{songName}</DropdownMenuLabel>
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
        </>
    )
}

export default SongSettings