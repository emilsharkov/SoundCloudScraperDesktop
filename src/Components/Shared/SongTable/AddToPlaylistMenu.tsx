import { 
    DropdownMenuItem, 
    DropdownMenuPortal, 
    DropdownMenuSeparator, 
    DropdownMenuSub, 
    DropdownMenuSubContent, 
    DropdownMenuSubTrigger 
} from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { AddSongToPlaylistArgs } from "@/Interfaces/electronHandlerInputs"
import { PlaylistName, PlaylistSongsNames } from "@/Interfaces/electronHandlerReturns"
import { setCurrentRoute } from "@/Redux/Slices/currentRouteSlice"
import { ListPlus } from "lucide-react"
import { useEffect } from "react"

export interface AddToPlaylistMenuProps {
    songName: string;
    songIndex: number;
}

const AddToPlaylistMenu = (props: AddToPlaylistMenuProps) => {
    const {songName,songIndex} = props
    const {
        result: playlists,
        error: playlistsError,
        receivedData: receivedPlaylistsData,
        setArgs: setPlaylistsArgs
    } = useElectronHandler<object,PlaylistName[]>('get-playlists')

    const {
        result: addSongToPlaylistResult,
        error: addSongToPlaylistError,
        receivedData: receivedAddSongToPlaylistData,
        setArgs: setAddSongToPlaylistArgs
    } = useElectronHandler<AddSongToPlaylistArgs,PlaylistSongsNames[]>('add-song-to-playlist')
    
    useEffect(() => setPlaylistsArgs({}),[])

    const addSongToPlaylist = (e: Event, playlistName: string) => {
        e.preventDefault()
        setAddSongToPlaylistArgs({
            playlistName: playlistName,
            songOrder: songIndex,
            songTitle: songName
        })
    }

    return (
        <>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <ListPlus className="mr-2 h-4 w-4"/>
                    <span>Add to Playlist</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        {playlists && !playlistsError && receivedPlaylistsData &&
                            playlists.map((playlist: PlaylistName) => {
                                return (
                                    <DropdownMenuItem key={playlist.name} onSelect={(e) => addSongToPlaylist(e,playlist.name)}>
                                        <span>{playlist.name}</span>
                                    </DropdownMenuItem>
                                )
                            })
                        }
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCurrentRoute('Playlists')}>
                            <span>Create a Playlist</span>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        </>
    )
}

export default AddToPlaylistMenu