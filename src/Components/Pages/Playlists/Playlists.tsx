import useElectronHandler from '@/Hooks/useElectronHandler';
import { PlaylistName } from '@/Interfaces/electronHandlerReturns';
import { useEffect } from 'react';

const Playlists = () => {
    const {result: playlists,error,receivedData,setArgs} = useElectronHandler<object,PlaylistName[]>('get-playlists')
    
    useEffect(() => setArgs({}),[])

    return (
        <>
            {receivedData && !error
                && playlists?.map(playlist => {
                    return playlist.name
                })
            }
        </>
    )
    
}

export default Playlists