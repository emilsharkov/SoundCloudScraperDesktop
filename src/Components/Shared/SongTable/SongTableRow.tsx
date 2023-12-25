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

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60

const SongTableRow = (props: SongTableRowProps) => {
    const {currentSong,item,index,isPlaylist,onClick} = props
    const [isHovered,setIsHovered] = useState<boolean>(false)

    const onMouseEnter = () => setIsHovered(true)
    const onMouseLeave = () => setIsHovered(false)

    const durationFormatted = () => {
        const durationInSeconds = Math.trunc(item.duration / MILLISECONDS_PER_SECOND)
        const minutes = Math.trunc(durationInSeconds / SECONDS_PER_MINUTE)
        const seconds = String(durationInSeconds % SECONDS_PER_MINUTE).padStart(2,'0')
        return `${minutes}:${seconds}`
    }

    return (
        <TableRow 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            className={currentSong === item.title ? 'bg-gray-300 hover:bg-gray-300': ''} 
            key={item.title}
        >
            <TableCell>
                {isHovered || currentSong === item.title ? (
                    <SongPlayButton 
                        songOrigin='Downloads' 
                        isCurrentSong={currentSong === item.title} 
                        playSong={onClick}/>
                ): index}
            </TableCell>

            <TableCell>
                <img className='h-12 w-12 max-w-none' src={`http://localhost:11738/songImages/${item.title}.png?${new Date().getTime()}`}/>
            </TableCell>

            <TableCell>
                <MarqueeText text={item.title}/>
            </TableCell>

            <TableCell className='max-w-[50px]'>
                <MarqueeText text={item.artist}/>
            </TableCell>

            <TableCell>
                {durationFormatted()}
            </TableCell>

            <TableCell>
                <SongSettings 
                    isPlaylist={isPlaylist} 
                    songMetadata={item}
                />
            </TableCell>

            <TableCell>
                {isPlaylist ? <GripVertical/>: null}
            </TableCell>
        </TableRow>
    )
}

export default SongTableRow