import ReactDragListView from 'react-drag-listview';
import { DragListViewProps } from 'react-drag-listview'
import useElectronHandler from '@/Hooks/useElectronHandler';
import SongTable from '@/Components/Shared/SongTable/SongTable';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { refreshPlaylist } from '@/Redux/Slices/refreshDataSlice';
import { PlaylistSongDataRow, SongRow } from '@/Interfaces/electronHandlerReturns';
import { GetSongsInPlaylistArgs } from '@/Interfaces/electronHandlerInputs';
import SearchBar from '@/Components/Shared/SearchBar';
import { Button } from '@/Components/ui/button';
import { ArrowLeft  } from 'lucide-react';
import useFuzzySearch from '@/Hooks/useFuzzySearch';


export interface PlaylistProps {
    playlistID: number;
    setPlaylistID: (playlist_id: number) => void;
}

const Playlist = (props: PlaylistProps) => {
    const {playlistID,setPlaylistID} = props
    const {result: songsInPlaylist,error,receivedData,setArgs} = useElectronHandler<GetSongsInPlaylistArgs,PlaylistSongDataRow[]>('get-songs-in-playlist')
    const rows = songsInPlaylist?.map((row: PlaylistSongDataRow) => {
        return {
            song_id: row.song_id,
            title: row.title,
            artist: row.artist,
            song_order: row.playlist_order,
            duration_seconds: row.duration_seconds
        } as SongRow
    })
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<SongRow>(rows,'title')

    const refreshPlaylistData = useAppSelector((state) => state.refreshData.playlist)
    const dispatch = useAppDispatch()
    

    useEffect(() => { dispatch(refreshPlaylist()) },[])
    useEffect(() => setArgs({ playlist_id: playlistID }),[refreshPlaylistData])

    return(
        <>
            <div className='flex flex-row mt-1'>
                <Button 
                    className='ml-2 mr-2'
                    variant="outline"
                    onClick={() => setPlaylistID(-1)}
                >
                    <ArrowLeft strokeWidth={1.25}/>
                </Button>
                <SearchBar
                    className='w-[90%]'
                    placeholder='Search Playlist'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>
            {receivedData && !error && rows &&
                <SongTable 
                    rows={rows}
                    playlistID={playlistID}
                />
            }
        </>
    )
}

export default Playlist