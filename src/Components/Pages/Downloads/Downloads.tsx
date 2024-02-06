import SearchBar from "@/Components/Shared/SearchBar"
import SongTable from "@/Components/Shared/SongTable/SongTable"
import { Input } from "@/Components/ui/input"
import useElectronHandler from "@/Hooks/useElectronHandler"
import useFuzzySearch from "@/Hooks/useFuzzySearch"
import { SongRow } from "@/Interfaces/electronHandlerReturns"
import { refreshDownloads } from "@/Redux/Slices/refreshDataSlice"
import { useAppDispatch, useAppSelector } from "@/Redux/hooks"
import { useEffect, useState } from "react"

const Downloads = () => {
    const {result,error,receivedData,setArgs} = useElectronHandler<object,SongRow[]>('get-songs')
    const refreshDownloadsData = useAppSelector((state) => state.refreshData.downloads)
    const dispatch = useAppDispatch()
    const {searchQuery, setSearchQuery, filteredData} = useFuzzySearch<SongRow>(result,'title')

    useEffect(() => { dispatch(refreshDownloads()) },[])
    useEffect(() => setArgs({}),[refreshDownloadsData])

    return(
        <div className='flex flex-col w-full h-full items-center'>
            <SearchBar
                className="w-[99%] mt-1"
                placeholder="Search Song"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {receivedData && !error && result && <SongTable rows={filteredData}/>}
        </div>
    )
}

export default Downloads