import { SongOrder } from "@/Interfaces/electronHandlerReturns"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { useEffect, useState } from "react"

export interface SongTableProps {
    songOrderings: SongOrder[]
}

const SongTable = (props: SongTableProps) => {
    const [songs, setSongs] = useState<SongOrder[]>([])

    useEffect(() => {
        const sortedSongs = props.songOrderings.slice().sort((a, b) => {
            const orderA = parseInt(a.song_order);
            const orderB = parseInt(b.song_order);
            return orderA - orderB
        })
        setSongs(sortedSongs)
    },[props.songOrderings])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songs.map((item: SongOrder) => (
                    <TableRow key={item.song_title}>
                        <TableCell>{item.song_title}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable