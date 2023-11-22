import useElectronHandler from "@/Hooks/useElectronHandler"
import useSongsWithMetadata from "@/Hooks/useSongsWithMetaData"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { SongTitle } from "@/Interfaces/electronHandlerReturns"
import { useEffect, useState } from "react"

const Downloads = () => {
    const {
        result: songs,
        error: songsError,
        receivedData: receivedSongsData,
        setArgs: setSongsArgs
    } = useElectronHandler<object,SongTitle[]>('get-all-songs')

    const [songTitles,setSongTitles] = useState<SongTitle[]>([])
    const {songsMetadata,receivedAllData} = useSongsWithMetadata(songTitles)

    useEffect(() => {
        setSongsArgs({})
    },[])

    useEffect(() => {
        if(receivedSongsData && !songsError && songs) {
            setSongTitles(songs)
        }
    },[receivedSongsData,songsError,songs])

    return(
        <>
            {receivedAllData && 
                songsMetadata.map((songMetadata: Mp3Metadata) => {
                    return 
                })
            }
        </>
    )
}

export default Downloads