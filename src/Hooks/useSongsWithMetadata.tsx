import useElectronHandler from "@/Hooks/useElectronHandler"
import { Mp3Metadata, SongNameArgs } from "@/Interfaces/electronHandlerInputs"
import { SongTitle } from "@/Interfaces/electronHandlerReturns"
import { useEffect, useRef, useState } from "react"

const useSongsWithMetadata = (songTitles: SongTitle[]) => {
    const { result: metadata,error,receivedData,setArgs } = useElectronHandler<SongNameArgs,Mp3Metadata>('get-mp3-metadata')
    const currentIndex = useRef<number>(0)
    const [songsMetadata,setSongsMetadata] = useState<Mp3Metadata[]>([])
    const [receivedAllData,setReceivedAllData] = useState<boolean>(true)

    useEffect(() => {
        if(currentIndex.current === songTitles.length - 1) {
            setReceivedAllData(true)
        }
    },[currentIndex.current])

    useEffect(() => {
        setReceivedAllData(false)
        setArgs({songName: songTitles[0].title})
        currentIndex.current += 1
    },[songTitles])

    useEffect(() => {
        if(receivedData && !error && metadata && !receivedAllData) {
            setSongsMetadata([...songsMetadata,metadata])
            setArgs({songName: songTitles[0].title})
            currentIndex.current += 1
        }
    },[receivedData,error,metadata,receivedAllData])

    return {songsMetadata,receivedAllData}
}

export default useSongsWithMetadata