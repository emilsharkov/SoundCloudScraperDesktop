import useElectronHandler from '@/Hooks/useElectronHandler';
import useFuzzySearch from '@/Hooks/useFuzzySearch';
import { PlaylistName } from '@/Interfaces/electronHandlerReturns';
import { useEffect } from 'react'
import NewPlaylistButton from './NewPlaylistButton';

const Playlists = () => {
    const {result: playlists,error,receivedData,setArgs} = useElectronHandler<object,PlaylistName[]>('get-playlists')
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<PlaylistName>(playlists,'title')
    
    useEffect(() => setArgs({}),[])

    return (
        <div>
            <div>
                <input
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
            <div>
                {receivedData && !error
                    && filteredData?.map(playlist => {
                        return playlist.name
                    })
                }
            </div>
        </div>
    )
    
}

export default Playlists