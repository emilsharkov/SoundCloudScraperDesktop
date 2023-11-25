import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs"

export interface SongTableProps {
    songMetadata: Mp3Metadata[],
    isDraggable: boolean
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
                            <TableCell>Settings Button</TableCell>
                            {props.isDraggable ? <li>Draggable Dots</li>: null}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SongTable