import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs";
import { TableCell, TableRow } from "../ui/table"
import SongSettings from "./SongSettings"
import MarqueeText from "./MarqueeText";
import { GripVertical, PauseIcon, PlayIcon } from "lucide-react";

export interface SongTableRowProps {
    currentSong: string;
    isPlaying: boolean
    item: Mp3Metadata;
    index: number;
    isPlaylist: boolean;
}

const SongTableRow = (props: SongTableRowProps) => {
    const {currentSong,item,index,isPlaying,isPlaylist} = props
    const Icon = isPlaying ? PauseIcon: PlayIcon

    return (
        <TableRow className={currentSong === item.title ? 'bg-gray-300 hover:bg-gray-300': ''} key={item.title}>
            <TableCell>{currentSong === item.title ? <Icon strokeWidth={1.25}/>: index}</TableCell>
            <TableCell><img className='h-12 w-12 max-w-none' src={item.imgPath ?? undefined}/></TableCell>
            <TableCell className='max-w-[400px]'><MarqueeText text={item.title}/></TableCell>
            <TableCell className='max-w-[100px]'><MarqueeText text={item.artist ?? ''}/></TableCell>
            <TableCell>
                <SongSettings isPlaylist={isPlaylist} songMetadata={item}/></TableCell>
            <TableCell>{isPlaylist ? <GripVertical/>: null}</TableCell>
        </TableRow>
    )
}

export default SongTableRow