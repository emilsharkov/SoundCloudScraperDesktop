import { useState, useEffect, useMemo } from "react"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { useDebounce } from "@/Hooks/useDebounce"
import SongTile from "./SongTile"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import clock from '../../../Assets/clock.svg'
import heart from '../../../Assets/heart.svg'
import { Song } from "@/Interfaces/electronHandlerReturns"
import { SongNameArgs } from "@/Interfaces/electronHandlerInputs"

const Search = (): JSX.Element => {
    const [searchBarInput,setSearchBarInput] = useState<string>('')
    const debouncedValue = useDebounce(searchBarInput)
    const {result,error,receivedData,setArgs} = useElectronHandler<SongNameArgs,Song[]>('search-song')

    useEffect(() => {
        if(debouncedValue && debouncedValue !== null && debouncedValue !== '') {
            console.log(debouncedValue)
            setArgs({ songName: debouncedValue })
        }
    },[debouncedValue])

    return(
        <div className='flex flex-col w-full h-full bg-gray-25'>
            <input 
                className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-6 self-center my-3 table-fixed'
                placeholder="Find Song"
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
                    {receivedData && !error 
                        && result?.map((song: Song) => (                    
                            <SongTile 
                                key={song.id}
                                title={song.title}
                                thumbnail={song.thumbnail}
                                duration={song.duration}
                                likes={song.likes}
                                artist={song.artist}
                                url={song.url}                            
                            />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Search