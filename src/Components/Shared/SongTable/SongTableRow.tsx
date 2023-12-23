import { Mp3Metadata } from "@/Interfaces/electronHandlerInputs";
import { TableCell, TableRow } from "../../ui/table"
import SongSettings from "./SongSettings"
import MarqueeText from "./MarqueeText";
import { GripVertical, PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import SongPlayButton from "./SongPlayButton";
import { useAppSelector } from "@/Redux/hooks";

export interface SongTableRowProps {
    currentSong: string;
    item: Mp3Metadata;
    index: number;
    isPlaylist: boolean;
    onClick: () => void;
}

const SongTableRow = (props: SongTableRowProps) => {
    const {currentSong,item,index,isPlaylist,onClick} = props
    const [isHovered,setIsHovered] = useState<boolean>(false)
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const songPlaying = currentSong === item.title && isPlaying

    const onMouseEnter = () => setIsHovered(true)
    const onMouseLeave = () => setIsHovered(false)

    return (
        <TableRow 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            className={currentSong === item.title ? 'bg-gray-300 hover:bg-gray-300': ''} 
            key={item.title}
        >
            <TableCell>{isHovered || currentSong === item.title ? <SongPlayButton songOrigin='Downloads' playing={songPlaying} playSong={onClick}/>: index}</TableCell>
            <TableCell><img className='h-12 w-12 max-w-none' src={item.imgPath ?? undefined}/></TableCell>
            <TableCell><MarqueeText text={item.title}/></TableCell>
            <TableCell className='max-w-[50px]'><MarqueeText text={item.artist ?? ''}/></TableCell>
            <TableCell>
                <SongSettings 
                    isPlaylist={isPlaylist} 
                    songMetadata={item}
                />
            </TableCell>
            <TableCell>{isPlaylist ? <GripVertical/>: null}</TableCell>
        </TableRow>
    )
}

export default SongTableRow