import SongTable from "@/Components/Shared/SongTable/SongTable"
import { Input } from "@/Components/ui/input"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useFuzzySearch from "@/Hooks/useFuzzySearch"
import useSongsWithMetadata from "@/Hooks/useSongsWithMetadata"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
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
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<Mp3Metadata>(songsMetadata,'title')

    useEffect(() => setSongsArgs({}),[])

    useEffect(() => {
        if(receivedSongsData && !songsError && songs) {
            const orderedSongs: SongOrder[] = songs.map((song: SongTitle,index: number) => {
                return { song_title: song.title, song_order: index.toString()}
            })
            setSongOrder(orderedSongs)
        }
    },[receivedSongsData,songsError,songs])

    return(
        <div className='flex flex-col w-full h-full items-center'>
            <Input 
                className='w-[99%] mt-1'
                type="text"
                placeholder="Search Song"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {receivedAllData && 
                <SongTable 
                    songMetadata={filteredData}
                    isPlaylist={false}
                />
            }
        </div>
    )
}

export default Downloads