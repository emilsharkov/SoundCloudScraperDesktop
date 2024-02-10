import useElectronHandler from '@/Hooks/useElectronHandler';
import useFuzzySearch from '@/Hooks/useFuzzySearch';
import { PlaylistRow } from '@/Interfaces/electronHandlerReturns';
import { useEffect } from 'react'
import NewPlaylistButton from './NewPlaylistButton';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { refreshPlaylists } from '@/Redux/Slices/refreshDataSlice';
import SearchBar from '@/Components/Shared/SearchBar';
import PlaylistSettings from './PlaylistSettings';

export interface PlaylistTableProps {
    setPlaylistID: (playlist_id: number) => void;
}

const PlaylistsTable = (props: PlaylistTableProps) => {
    const {setPlaylistID} = props
    const refreshPlaylistsData = useAppSelector((state) => state.refreshData.playlists)
    const dispatch = useAppDispatch()
    const {result: playlists,error,receivedData,setArgs} = useElectronHandler<object,PlaylistRow[]>('get-playlists')
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<PlaylistRow>(playlists,'name')
    
    useEffect(() => { dispatch(refreshPlaylists()) },[])
    useEffect(() => setArgs({}),[refreshPlaylistsData])

    return (
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-row mt-1 m w-[97%]'>
                <SearchBar
                    className='mr-1'
                    placeholder='Search Playlists'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <NewPlaylistButton/>
            </div>
            
            <Table className="w-full max-w-full table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[70%] max-w-[70%] pl-12">Playlist Name</TableHead>
                        <TableHead className="w-[10%] max-w-[10%]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {receivedData && !error
                        && filteredData?.map((playlist: PlaylistRow, index: number) => {
                            return (
                                <TableRow 
                                    key={playlist.playlist_id}
                                >
                                    <TableCell 
                                        onClick={() => setPlaylistID(playlist.playlist_id)} 
                                        className="font-medium pl-12"
                                    >
                                        <span className='text-base'>{playlist.name}</span>
                                    </TableCell>
                                    <TableCell className=''>
                                        <PlaylistSettings row={playlist}/>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
    
}

export default PlaylistsTable