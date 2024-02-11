import ReactDragListView from 'react-drag-listview';
import { DragListViewProps } from 'react-drag-listview'
import useElectronHandler from '@/Hooks/useElectronHandler';
import SongTable from '@/Components/Shared/SongTable/SongTable';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { refreshPlaylist } from '@/Redux/Slices/refreshDataSlice';
import { PlaylistSongDataRow, SongRow } from '@/Interfaces/electronHandlerReturns';
import { GetSongsInPlaylistArgs, SwitchPlaylistOrderArgs } from '@/Interfaces/electronHandlerInputs';
import SearchBar from '@/Components/Shared/SearchBar';
import { Button } from '@/Components/ui/button';
import { ArrowLeft  } from 'lucide-react';
import useFuzzySearch from '@/Hooks/useFuzzySearch';
import DownloadSongs from '@/Components/Shared/DownloadSongs';
import { setDefaultQueue } from '@/Redux/Slices/queueSlice';


export interface PlaylistProps {
    playlistID: number;
    setPlaylistID: (playlist_id: number) => void;
}

const Playlist = (props: PlaylistProps) => {
    const {playlistID,setPlaylistID} = props
    const {
        result: switchedOrder,
        error: switchedOrderError,
        receivedData: receivedSwitchedOrderData,
        setArgs: setSwitchedOrderArgs
    } = useElectronHandler<SwitchPlaylistOrderArgs,boolean>('switch-playlist-order')

    const {
        result: songsInPlaylist,
        error: songsInPlaylistError,
        receivedData: receivedSongsInPlaylist,
        setArgs: setSongInPlaylistArgs
    } = useElectronHandler<GetSongsInPlaylistArgs,PlaylistSongDataRow[]>('get-songs-in-playlist')

    const songs = songsInPlaylist?.map((row: PlaylistSongDataRow) => {
        return {
            song_id: row.song_id,
            title: row.title,
            artist: row.artist,
            song_order: row.playlist_order,
            duration_seconds: row.duration_seconds
        } as SongRow
    })
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<SongRow>(songs,'title')

    const refreshPlaylistData = useAppSelector((state) => state.refreshData.playlist)
    const defaultQueue = useAppSelector((state) => state.queue.defaultQueue)
    const dispatch = useAppDispatch()
    
    useEffect(() => { dispatch(refreshPlaylist()) },[])
    useEffect(() => setSongInPlaylistArgs({ playlist_id: playlistID }),[refreshPlaylistData])
    useEffect(() => {
        if(switchedOrder && !switchedOrderError && receivedSwitchedOrderData){
            dispatch(refreshPlaylist()) 
        }
    },[switchedOrder,switchedOrderError,receivedSwitchedOrderData])

    const onDragEnd = (fromIndex: number, toIndex: number) => {
        setSwitchedOrderArgs({
            playlist_id: playlistID,
            from: fromIndex,
            to: toIndex
        })

        const newDefaultQueue = [...defaultQueue]
        const [item] = newDefaultQueue.splice(fromIndex, 1)
        newDefaultQueue.splice(toIndex, 0, item)
        dispatch(setDefaultQueue(newDefaultQueue))
    }

    return(
        <>
            <div className='flex flex-row mt-1 w-[98%]'>
                <Button 
                    className='ml-2 mr-2'
                    variant="outline"
                    onClick={() => setPlaylistID(-1)}
                >
                    <ArrowLeft strokeWidth={1.25}/>
                </Button>
                <SearchBar
                    className='w-[90%] mr-2'
                    placeholder='Search Playlist'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <DownloadSongs songs={songs ?? []}/>    
            </div>
            {receivedSongsInPlaylist && !songsInPlaylistError && songs &&
                <SongTable 
                    onDragEnd={onDragEnd}
                    rows={songs}
                    playlistID={playlistID}
                />
            }
        </>
    )
}

export default Playlist