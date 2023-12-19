import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs";
import { TableCell, TableRow } from "../ui/table"
import SongSettings from "./SongSettings"
import MarqueeText from "./MarqueeText";
import { GripVertical, PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import Play from "../MusicPlaying/Play";
import { useAppSelector } from "@/Redux/hooks";

export interface SongTableRowProps {
    currentSong: string;
    isPlaying: boolean
    item: Mp3Metadata;
    index: number;
    isPlaylist: boolean;
}

const SongTableRow = (props: SongTableRowProps) => {
    const {currentSong,item,index,isPlaying,isPlaylist} = props
    const [isHovered,setIsHovered] = useState<boolean>(false)

    const onMouseEnter = () => setIsHovered(true)
    const onMouseLeave = () => setIsHovered(false)

    return (
        <TableRow 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            className={currentSong === item.title ? 'bg-gray-300 hover:bg-gray-300': ''} 
            key={item.title}
        >
            <TableCell>
                {(isPlaying && currentSong === item.title) || isHovered ? index: index}
            </TableCell>
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