import { useState, useEffect, useMemo } from "react"
import { useSearchSong } from "@/Hooks/useSearchSong"
import { useDebounce } from "@/Hooks/useDebounce"
import SongSuggestionTile from "./SongSuggestionTile"
import { SongSuggestion } from '../../../Interfaces/SongSuggestion'

import clock from '../../../Assets/clock.svg'
import heart from '../../../Assets/heart.svg'

import suggestionsConst from './songSuggestionConstants'
import Baki from '../../../Assets/baki.jpg'

const Search = (): JSX.Element => {
    const [searchBarInput,setSearchBarInput] = useState<string>('')
    const debouncedValue = useDebounce(searchBarInput)
    const {songSuggestions,receivedSuggestions,setSongName} = useSearchSong()

    useEffect(() => {
        if(debouncedValue != null) {
            setSongName(debouncedValue)
        }
    },[debouncedValue])

    return(
        <div className='flex flex-col w-full h-full bg-gray-50'>
            <input 
                className='border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-11/12 pl-6 self-center mt-3'
                placeholder="Enter Song Name"
                value={searchBarInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchBarInput(e.target.value)}
            />
            <table className='block h-full w-11/12 self-center overflow-hidden items-center bg-transparent border-collapse break-words bg-white shadow-lg rounded'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='w-2/12 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'></th>
                        <th className='w-6/12 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'>Title</th>
                        <th className='w-2/12 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'>Artist</th>
                        <th className='w-1/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'><img className='h-5' src={clock} /></th>
                        <th className='w-1/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'><img className='h-6' src={heart} /></th>
                    </tr>
                </thead>
                <tbody>
                    {suggestionsConst.map((songSuggestion: SongSuggestion) => {
                    // {songSuggestions.map((songSuggestion: SongSuggestion) => {
                        return (
                            <SongSuggestionTile 
                                key={songSuggestion.id}
                                title={songSuggestion.title}
                                // thumbnail={songSuggestion.thumbnail}
                                thumbnail={Baki}
                                duration={songSuggestion.duration}
                                likes={songSuggestion.likes}
                                artist={songSuggestion.author.name}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Search