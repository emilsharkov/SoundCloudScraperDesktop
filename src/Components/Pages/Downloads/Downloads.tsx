import SongTable from "@/Components/Shared/SongTable"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useSongsWithMetadata from "@/Hooks/useSongsWithMetadata"
import { SongOrder, SongTitle } from "@/Interfaces/electronHandlerReturns"
import { useEffect, useState } from "react"

const Downloads = () => {
    const {
        result: songs,
        error: songsError,
        receivedData: receivedSongsData,
        setArgs: setSongsArgs
    } = useElectronHandler<object,SongTitle[]>('get-all-songs')

    const [songOrder,setSongOrder] = useState<SongOrder[]>([])
    const {songsMetadata,receivedAllData} = useSongsWithMetadata(songOrder)

    useEffect(() => {
        setSongsArgs({})
    },[])

    useEffect(() => {
        if(receivedSongsData && !songsError && songs) {
            const orderedSongs: SongOrder[] = songs.map((song: SongTitle,index: number) => {
                return { song_title: song.title, song_order: index.toString()}
            })
            setSongOrder(orderedSongs)
        }
    },[receivedSongsData,songsError,songs])

    return(
        <>
            {receivedAllData && 
                <SongTable 
                    songMetadata={songsMetadata}
                    isDraggable={false}
                />}
        </>
    )
}

export default Downloads