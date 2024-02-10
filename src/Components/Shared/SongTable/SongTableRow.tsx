import { TableCell, TableRow } from "../../ui/table"
import SongSettings from "./SongSettings/SongSettings"
import MarqueeText from "./MarqueeText";
import { GripVertical, PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import SongPlayButton from "./SongPlayButton";
import { useAppSelector } from "@/Redux/hooks";
import { SongRow } from "@/Interfaces/electronHandlerReturns";

export interface SongTableRowProps {
    currentSong: number;
    row: SongRow;
    onClick: () => void;
    playlistID?: number;
}

const SECONDS_PER_MINUTE = 60

const SongTableRow = (props: SongTableRowProps) => {
    const {currentSong,row,onClick,playlistID} = props
    const [isHovered,setIsHovered] = useState<boolean>(false)

    const onMouseEnter = () => setIsHovered(true)
    const onMouseLeave = () => setIsHovered(false)

    const durationFormatted = () => {
        const minutes = Math.trunc(row.duration_seconds / SECONDS_PER_MINUTE)
        const seconds = String(row.duration_seconds % SECONDS_PER_MINUTE).padStart(2,'0')
        return `${minutes}:${seconds}`
    }

    return (
        <TableRow 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            className={`overflow-hidden ${currentSong === row.song_id ? 'bg-gray-300 hover:bg-gray-300': ''}`}
            key={row.title}
        >
            <TableCell className={isHovered || currentSong === row.song_id ? 'p-0 pl-1': 'pl-4'}>
                {isHovered || currentSong === row.song_id ? (
                    <SongPlayButton 
                        songOrigin={playlistID ? 'Playlist': 'Downloads'} 
                        isCurrentSong={currentSong === row.song_id} 
                        playSong={onClick}/>
                ): row.song_order + 1}
            </TableCell>

            <TableCell>
                <img className='h-10 w-10 max-w-none' src={`http://localhost:11738/songImages/${row.song_id}.png?${new Date().getTime()}`}/>
            </TableCell>

            <TableCell>
                <MarqueeText classname="font-semibold" text={row.title}/>
            </TableCell>

            <TableCell>
                <MarqueeText classname="font-normal" text={row.artist}/>
            </TableCell>

            <TableCell>
                {durationFormatted()}
            </TableCell>

            <TableCell className="p-0">
                <SongSettings 
                    row={row}
                    playlistID={playlistID}
                />
            </TableCell>

            <TableCell className="p-0">
                <a><GripVertical/></a>
            </TableCell>
        </TableRow>
    )
}

export default SongTableRow