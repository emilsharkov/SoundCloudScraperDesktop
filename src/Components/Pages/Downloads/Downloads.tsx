import DownloadSongs from "@/Components/Shared/DownloadSongs"
import SearchBar from "@/Components/Shared/SearchBar"
import SongTable from "@/Components/Shared/SongTable/SongTable"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useFuzzySearch from "@/Hooks/useFuzzySearch"
import { SwitchSongOrderArgs } from "@/Interfaces/electronHandlerInputs"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
import { setCurrentQueueIndex } from "@/Redux/Slices/currentQueueIndexSlice"
import { setDefaultQueue } from "@/Redux/Slices/queueSlice"
import { refreshDownloads } from "@/Redux/Slices/refreshDataSlice"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { useEffect, useState } from "react"

const Downloads = () => {
    const {
        result: songs,
        error: songsError,
        receivedData: receivedSongsData,
        setArgs: setSongsArgs
    } = useElectronHandler<object,SongRow[]>('get-songs')
    const {
        result: switchedOrder,
        error: switchedOrderError,
        receivedData: receivedSwitchedOrderData,
        setArgs: setSwitchedOrderArgs
    } = useElectronHandler<SwitchSongOrderArgs,boolean>('switch-song-order')
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<SongRow>(songs,'title')

    const refreshDownloadsData = useAppSelector((state) => state.refreshData.downloads)
    const defaultQueue = useAppSelector((state) => state.queue.defaultQueue)
    const dispatch = useAppDispatch()


    useEffect(() => { dispatch(refreshDownloads()) },[])
    useEffect(() => setSongsArgs({}),[refreshDownloadsData])
    useEffect(() => {
        if(switchedOrder && !switchedOrderError && receivedSwitchedOrderData){
            dispatch(refreshDownloads()) 
        }
    },[switchedOrder,switchedOrderError,receivedSwitchedOrderData])

    const onDragEnd = (fromIndex: number, toIndex: number) => {
        setSwitchedOrderArgs({
            from: fromIndex,
            to: toIndex
        })

        const newDefaultQueue = [...defaultQueue]
        const [item] = newDefaultQueue.splice(fromIndex, 1)
        newDefaultQueue.splice(toIndex, 0, item)
        dispatch(setDefaultQueue(newDefaultQueue))
    }

    return(
        <div className='flex flex-col w-full h-full items-center max-w-full'>
            <div className='flex flex-row w-[96%] mt-1'>
                <SearchBar
                    className="mr-2"
                    placeholder="Search Downloads"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <DownloadSongs songs={songs ?? []}/>    
            </div>

            {receivedSongsData && !songsError && songs && 
                <SongTable
                    rows={filteredData}
                    onDragEnd={onDragEnd}
                />
            }
        </div>
    )
}

export default Downloads