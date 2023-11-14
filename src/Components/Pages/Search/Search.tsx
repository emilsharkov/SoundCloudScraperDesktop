import { useState, useEffect, useMemo } from "react"
import { useSearchSong } from "@/Hooks/Electron/useSearchSong"
import { useDebounce } from "@/Hooks/useDebounce"
import SongSuggestionTile from "./SongSuggestionTile"
import { SongSuggestion } from '../../../Interfaces/SongSuggestion'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import clock from '../../../Assets/clock.svg'
import heart from '../../../Assets/heart.svg'

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
                className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-6 self-center my-3 table-fixed'
                placeholder="Enter Song Name"
                value={searchBarInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchBarInput(e.target.value)}
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead><img className='h-8' src={clock}/></TableHead>
                        <TableHead><img className='h-8' src={heart}/></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {songSuggestions.map((songSuggestion: SongSuggestion) => (                    
                        <SongSuggestionTile 
                            key={songSuggestion.id}
                            title={songSuggestion.title}
                            thumbnail={songSuggestion.thumbnail}
                            duration={songSuggestion.duration}
                            likes={songSuggestion.likes}
                            artist={songSuggestion.author.name}
                            url={songSuggestion.url}                            
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Search