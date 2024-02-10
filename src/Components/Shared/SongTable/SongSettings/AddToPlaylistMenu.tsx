import NewPlaylistButton from "@/Components/Pages/Playlists/NewPlaylistButton"
import { 
    DropdownMenuItem, 
    DropdownMenuPortal, 
    DropdownMenuSeparator, 
    DropdownMenuSub, 
    DropdownMenuSubContent, 
    DropdownMenuSubTrigger 
} from "@/Components/ui/dropdown-menu"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { AddSongToPlaylistArgs, CreatePlaylistArgs } from "@/Interfaces/electronHandlerInputs"
import { PlaylistRow, PlaylistSongRow, SongRow } from "@/Interfaces/electronHandlerReturns"
import { refreshPlaylists } from "@/Redux/Slices/refreshDataSlice"
import { setToastError } from "@/Redux/Slices/toastErrorSlice"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { ListPlus } from "lucide-react"
import { useEffect } from "react"
import { ToastAction } from "@/Components/ui/toast"
import { useToast } from "@/Components/ui/use-toast"
import { setDefaultQueue, setMusicQueue } from "@/Redux/Slices/queueSlice"

export interface AddToPlaylistMenuProps {
    row: SongRow;
    playlist_id?: number;
}

const AddToPlaylistMenu = (props: AddToPlaylistMenuProps) => {
    const {row,playlist_id} = props
    const refreshPlaylistsData = useAppSelector((state) => state.refreshData.playlists)
    const queue = useAppSelector((state) => state.queue)
    const dispatch = useAppDispatch()
    const { toast } = useToast()

    const {
        result: playlists,
        error: playlistsError,
        receivedData: receivedPlaylistsData,
        setArgs: setPlaylistsArgs
    } = useElectronHandler<object,PlaylistRow[]>('get-playlists')

    const {
        result: addSongToPlaylistResult,
        error: addSongToPlaylistError,
        receivedData: receivedAddSongToPlaylistData,
        setArgs: setAddSongToPlaylistArgs
    } = useElectronHandler<AddSongToPlaylistArgs,PlaylistSongRow>('add-song-to-playlist')
    
    useEffect(() => { dispatch(refreshPlaylists()) },[])
    useEffect(() => setPlaylistsArgs({}),[refreshPlaylistsData])

    const addSongToPlaylist = (e: Event, playlist_id: number) => {
        e.preventDefault()
        setAddSongToPlaylistArgs({
            playlist_id: playlist_id,
            song_id: row.song_id
        })
    }

    useEffect(() => {
        if(addSongToPlaylistResult && receivedAddSongToPlaylistData) {
            if(!addSongToPlaylistError) {
                toast({description: `${row.title} added to playlist`})
                if(queue.origin === 'Playlist' && playlist_id === queue.playlist_id) {
                    const newDefaultQueue: number[] = [...queue.defaultQueue,addSongToPlaylistResult.song_id]
                    const newMusicQueue: number[] = [...queue.musicQueue,addSongToPlaylistResult.song_id]
                    dispatch(setDefaultQueue(newDefaultQueue))
                    dispatch(setMusicQueue(newMusicQueue))
                }
            } else {
                dispatch(setToastError('Each song may only be added once a playlist'))
            }
        }
    },[addSongToPlaylistResult,addSongToPlaylistError,receivedAddSongToPlaylistData])

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
                            playlists.map((playlist: PlaylistRow) => {
                                return (
                                    <DropdownMenuItem key={playlist.name} onSelect={(e) => addSongToPlaylist(e,playlist.playlist_id)}>
                                        <span>{playlist.name}</span>
                                    </DropdownMenuItem>
                                )
                            })
                        }
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={e => e.preventDefault()}>
                            <NewPlaylistButton/>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        </>
    )
}

export default AddToPlaylistMenu