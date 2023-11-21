import { useState, useEffect, useMemo } from "react"
import useElectronHandler from "@/Hooks/useElectronHandler"
import { useDebounce } from "@/Hooks/useDebounce"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/Components/ui/table"
import ReactDragListView from 'react-drag-listview';
import { DragListViewProps } from 'react-drag-listview'
import { SongTitle } from "@/Interfaces/nodeTypes";

const Downloads = () => {
    const {result,error,receivedData,setArgs} = useElectronHandler<object,SongTitle[]>('get-all-songs')
    const [songTitles,setSongTitles] = useState<SongTitle[]>([])

    useEffect(() => {
        setArgs({})
    },[])

    useEffect(() => {
        if(receivedData && !error && result) {
            setSongTitles(result)
        }
    },[receivedData,error,result])

    const onDragEnd = (fromIndex: number, toIndex: number) => {
        const updatedSongTitles = [...songTitles as SongTitle[]];
        const draggedItem = updatedSongTitles.splice(fromIndex, 1)[0]
        updatedSongTitles.splice(toIndex, 0, draggedItem)
        setSongTitles(updatedSongTitles)
    }
    
    const dragProps: DragListViewProps = {
        onDragEnd,
        nodeSelector: 'tr',
        handleSelector: 'div',
    }

    return(
        <div>
            <ReactDragListView {...dragProps}>
                <Table>
                    <TableBody>
                        {songTitles.map((item, index) => (
                            <TableRow key={index}>
                                <div>
                                    <TableCell>{item.title}</TableCell>
                                </div>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ReactDragListView>
        </div>
    )
}

export default Downloads