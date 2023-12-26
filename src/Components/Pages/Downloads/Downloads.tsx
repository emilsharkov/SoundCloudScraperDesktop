import SongTable from "@/Components/Shared/SongTable/SongTable"
import { Input } from "@/Components/ui/input"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useFuzzySearch from "@/Hooks/useFuzzySearch"
import { Mp3Metadata, SongNamesArgs } from "@/Interfaces/electronHandlerInputs"
import { SongOrder, SongTitle } from "@/Interfaces/electronHandlerReturns"
import { refreshDownloads } from "@/Redux/Slices/refreshDataSlice"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { useEffect, useState } from "react"

const Downloads = () => {
    const {
        result: songs,
        error: songsError,
        receivedData: receivedSongsData,
        setArgs: setSongsArgs
    } = useElectronHandler<object,SongTitle[]>('get-all-songs')

    const {
        result: songsMetadata,
        error: songsMetadataError,
        receivedData: receivedSongsMetadata,
        setArgs: setSongsMetadataArgs
    } = useElectronHandler<SongNamesArgs,Mp3Metadata[]>('get-all-mp3-metadata')

    const refreshDownloadsData = useAppSelector((state) => state.refreshData.downloads)
    const dispatch = useAppDispatch()
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<Mp3Metadata>(songsMetadata,'title')

    useEffect(() => { dispatch(refreshDownloads()) },[])
    useEffect(() => setSongsArgs({}),[refreshDownloadsData])

    useEffect(() => {
        if(songs && !songsError && receivedSongsData) {
            const songNames: string[] = songs.map(song => song.title)
            setSongsMetadataArgs({songNames: songNames})
        }
    },[songs,songsError,receivedSongsData])

    return(
        <div className='flex flex-col w-full h-full items-center'>
            <Input 
                className='w-[99%] mt-1'
                type="text"
                placeholder="Search Song"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {receivedSongsMetadata && !songsMetadataError && songsMetadata &&
                <SongTable 
                    songMetadata={filteredData}
                    isPlaylist={false}
                />
            }
        </div>
    )
}

export default Downloads