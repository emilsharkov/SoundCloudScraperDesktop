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
        <div className='flex flex-col w-full h-full bg-gray-25'>
            <input 
                className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-11/12 pl-6 self-center my-3 table-fixed'
                placeholder="Enter Song Name"
                value={searchBarInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchBarInput(e.target.value)}
            />
            <table className='block h-full w-11/12 self-center overflow-hidden items-center bg-transparent border-collapse break-words bg-white shadow-lg rounded'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='max-w-2/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 truncate font-semibold text-left text-gray-500'></th>
                        <th className='max-w-6/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 truncate font-semibold text-left text-gray-500'>Title</th>
                        <th className='max-w-2/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 truncate font-semibold text-left text-gray-500'>Artist</th>
                        <th className='max-w-1/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 truncate font-semibold text-left'><div className='flex justify-center'><img className='h-5' src={clock}/></div></th>
                        <th className='max-w-1/12 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 truncate font-semibold text-left'><div className='flex justify-center'><img className='h-5' src={heart}/></div></th>
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