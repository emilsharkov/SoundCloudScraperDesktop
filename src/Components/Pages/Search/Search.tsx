import { useState, useEffect, useMemo } from "react"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { useDebounce } from "@/Hooks/useDebounce"
import SongTile from "./SongTile"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Song } from "@/Interfaces/electronHandlerReturns"
import { SongNameArgs } from "@/Interfaces/electronHandlerInputs"
import { ListOrdered } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Input } from "@/Components/ui/input"

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
        <div className='flex flex-col w-full h-full items-center'>
            <Input 
                className='w-[99%] mt-1'
                placeholder='Find Song'
                value={searchBarInput}
                onChange={(e) => setSearchBarInput(e.target.value)}
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead><Clock/></TableHead>
                        <TableHead><Heart/></TableHead>
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