import useElectronHandler from '@/Hooks/useElectronHandler';
import useFuzzySearch from '@/Hooks/useFuzzySearch';
import { PlaylistName } from '@/Interfaces/electronHandlerReturns';
import { useEffect } from 'react'
import NewPlaylistButton from './NewPlaylistButton';
import { Input } from '@/Components/ui/input';
import { TableCell, TableRow } from '@/Components/ui/table';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { refreshPlaylists } from '@/Redux/Slices/refreshDataSlice';

export interface PlaylistTableProps {
    setPlaylistName: (playlistName: string) => void;
}

const PlaylistsTable = (props: PlaylistTableProps) => {
    const {setPlaylistName} = props
    const refreshPlaylistsData = useAppSelector((state) => state.refreshData.playlists)
    const dispatch = useAppDispatch()
    const {result: playlists,error,receivedData,setArgs} = useElectronHandler<object,PlaylistName[]>('get-playlists')
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<PlaylistName>(playlists,'name')
    
    useEffect(() => { dispatch(refreshPlaylists()) },[])
    useEffect(() => setArgs({}),[refreshPlaylistsData])

    return (
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-row mt-1 m w-[97%]'>
                <Input 
                    className='mr-1'
                    type="text"
                    placeholder="Find Playlist"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <NewPlaylistButton
                    playlists={playlists}
                />
            </div>
            
            {receivedData && !error
                && filteredData?.map((playlist: PlaylistName, index: number) => {
                    return (
                        <TableRow 
                            onClick={() => setPlaylistName(playlist.name)} 
                            className='w-full' 
                            key={playlist.name}
                        >
                            <TableCell className="font-medium">
                                {playlist.name}
                            </TableCell>
                        </TableRow>
                    )
                })
            }
        </div>
    )
    
}

export default PlaylistsTable