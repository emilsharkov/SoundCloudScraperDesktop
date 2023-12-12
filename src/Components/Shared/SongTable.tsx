import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"
import { ListOrdered, MoreVertical } from 'lucide-react'
import { GripVertical } from 'lucide-react'
import SongSettings from "./SongSettings"

export interface SongTableProps {
    songMetadata: Mp3Metadata[],
    isPlaylist: boolean
}

const SongTable = (props: SongTableProps) => {
    const { songMetadata,isPlaylist } = props
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"><ListOrdered/></TableHead>
                    <TableHead></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {songMetadata.map((item: Mp3Metadata, index: number) => (
                    <TableRow key={item.title}>
                            <TableCell>{index}</TableCell>
                            <TableCell><img className='h-12 w-12 max-w-none' src={item.imgPath ?? undefined}/></TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.artist}</TableCell>
                            <TableCell>
                                <SongSettings isPlaylist={isPlaylist} songMetadata={songMetadata[index]}/></TableCell>
                            <TableCell>{isPlaylist ? <GripVertical/>: null}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable