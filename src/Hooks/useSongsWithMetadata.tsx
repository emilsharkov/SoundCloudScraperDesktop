import useElectronHandler from "@/Hooks/useElectronHandler"
import { Mp3Metadata, SongNameArgs } from "@/Interfaces/electronHandlerInputs"
import { SongOrder, SongTitle } from "@/Interfaces/electronHandlerReturns"
import { useEffect, useRef, useState } from "react"

const useSongsWithMetadata = (orderedSongs: SongOrder[]) => {
    const { result: metadata,error,receivedData,setArgs } = useElectronHandler<SongNameArgs,Mp3Metadata>('get-mp3-metadata')
    const [songTitles,setSongTitles] = useState<SongTitle[]>([])
    const currentIndex = useRef<number>(0)
    const [songsMetadata,setSongsMetadata] = useState<Mp3Metadata[]>([])
    const [receivedAllData,setReceivedAllData] = useState<boolean>(true)

    useEffect(() => {
        const sortedSongs = orderedSongs.slice().sort((a, b) => {
            const orderA = parseInt(a.song_order);
            const orderB = parseInt(b.song_order);
            return orderA - orderB
        })
        const converted: SongTitle[] = sortedSongs.map(song => {
            return {title: song.song_title}
        })
        setSongTitles(converted)
    },[orderedSongs])

    useEffect(() => {
        if(songTitles.length) {
            setReceivedAllData(false)
            setArgs({songName: songTitles[0].title})
        }
    },[songTitles])

    useEffect(() => {
        if(receivedData && !error && metadata && !receivedAllData) {
            setSongsMetadata([...songsMetadata,metadata])
            currentIndex.current += 1

            if(currentIndex.current === orderedSongs.length) {
                setReceivedAllData(true)
            } else {
                setArgs({songName: songTitles[currentIndex.current].title})
            }
        }
    },[receivedData,error,metadata,receivedAllData])

    return {songsMetadata,receivedAllData}
}

export default useSongsWithMetadata