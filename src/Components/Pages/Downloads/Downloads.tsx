import SearchBar from "@/Components/Shared/SearchBar"
import SongTable from "@/Components/Shared/SongTable/SongTable"
import { Input } from "@/Components/ui/input"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useFuzzySearch from "@/Hooks/useFuzzySearch"
import { SwitchSongOrderArgs } from "@/Interfaces/electronHandlerInputs"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
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
    const refreshDownloadsData = useAppSelector((state) => state.refreshData.downloads)
    const dispatch = useAppDispatch()
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<SongRow>(songs,'title')

    useEffect(() => { dispatch(refreshDownloads()) },[])
    useEffect(() => setSongsArgs({}),[refreshDownloadsData])
    useEffect(() => {
        if(switchedOrder && !switchedOrderError && receivedSwitchedOrderData){
            console.log('anus')
            dispatch(refreshDownloads()) 
        }
    },[switchedOrder,switchedOrderError,receivedSwitchedOrderData])

    const onDragEnd = (fromIndex: number, toIndex: number) => {
        if(songs) {
            setSwitchedOrderArgs({
                song_id: songs[fromIndex].song_id,
                from: fromIndex,
                to: toIndex
            })
        }
    }

    return(
        <div className='flex flex-col w-full h-full items-center'>
            <SearchBar
                className="w-[99%] mt-1"
                placeholder="Search Song"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
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