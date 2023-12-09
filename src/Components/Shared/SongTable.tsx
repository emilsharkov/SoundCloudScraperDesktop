import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { MoreVertical } from 'lucide-react'
import { GripVertical } from 'lucide-react'
import SongSettings from "./SongSettings"

export interface SongTableProps {
    songMetadata: Mp3Metadata[],
    isPlaylist: boolean
}

const SongTable = (props: SongTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {props.songMetadata.map((item: Mp3Metadata, index: number) => (
                    <TableRow key={item.title}>
                            <TableCell>{index}</TableCell>
                            <TableCell><img src={item.imgPath ?? undefined}/></TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.artist}</TableCell>
                            <TableCell><SongSettings isPlaylist={props.isPlaylist} songName={item.title}/></TableCell>
                            <TableCell>{props.isPlaylist ? <GripVertical/>: null}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable