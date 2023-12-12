import useElectronHandler from '@/Hooks/useElectronHandler';
import useFuzzySearch from '@/Hooks/useFuzzySearch';
import { PlaylistName } from '@/Interfaces/electronHandlerReturns';
import { useEffect } from 'react'
import NewPlaylistButton from './NewPlaylistButton';
import { Input } from '@/Components/ui/input';

const Playlists = () => {
    const {result: playlists,error,receivedData,setArgs} = useElectronHandler<object,PlaylistName[]>('get-playlists')
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<PlaylistName>(playlists,'name')
    
    useEffect(() => setArgs({}),[])

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
                    refreshPlaylists={setArgs}
                />
            </div>
            
            {receivedData && !error
                && filteredData?.map(playlist => {
                    return playlist.name
                })
            }
        </div>
    )
    
}

export default Playlists