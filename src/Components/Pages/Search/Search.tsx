import { useState, useEffect, useMemo, KeyboardEvent } from "react"
import useElectronHandler from "@/Hooks/useElectronHandler"
import SearchSongRow from "./SearchSongRow"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Song } from "@/Interfaces/electronHandlerReturns"
import { SongNameArgs } from "@/Interfaces/electronHandlerInputs"
import { Clock } from 'lucide-react'
import { Search as SearchGlass } from 'lucide-react';
import { Heart } from 'lucide-react'
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import Spinner from "./Spinner"
import RowSkeleton from "@/Components/Shared/RowSkeleton"

const Search = (): JSX.Element => {
    const [searchBarInput, setSearchBarInput] = useState<string>('');
    const { result, error, receivedData, setArgs } = useElectronHandler<SongNameArgs, Song[]>('search-song');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleSubmit = () => {
        if (searchBarInput !== '') {
            setArgs({ songName: searchBarInput });
        }
    }

    return (
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-row mt-1 w-[97%]'>
                <Input
                    className='mr-1'
                    placeholder='Find Song'
                    value={searchBarInput}
                    onChange={(e) => setSearchBarInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    onClick={handleSubmit}
                    variant='outline'
                >
                    {receivedData ? <SearchGlass className="h-4" /> : <Spinner size={4} hexColor="#000000" />}
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead className="w-[50px]">Artist</TableHead>
                        <TableHead className="w-[50px]"><Clock /></TableHead>
                        <TableHead className="w-[100px] flex items-center justify-center"><Heart /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!!(receivedData && !error) ? (
                        result?.map((song: Song) => (
                            <SearchSongRow
                                key={song.id}
                                title={song.title}
                                thumbnail={song.thumbnail}
                                duration={song.duration}
                                likes={song.likes}
                                artist={song.artist}
                                url={song.url}
                            />
                        ))
                    ) : (
                        Array.from({ length: 10 }, (_, index) => (
                            <RowSkeleton key={index} />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Search;
