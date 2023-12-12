import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import useElectronHandler from '@/Hooks/useElectronHandler';
import { TableCell,TableRow } from '@/Components/ui/table';
import Spinner from './Spinner';
import { SongURLArgs } from '@/Interfaces/electronHandlerInputs';
import Marquee from "react-fast-marquee";
import MarqueeText from '@/Components/Shared/MarqueeText';

interface SongSuggestionProps {
    title: string;
    thumbnail: string;
    duration: number;
    likes: number;
    artist: string;
    url: string;
}

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60

const SongTile = (props: SongSuggestionProps) => {
    const {title,thumbnail,duration,likes,artist,url} = props
    const rowRef = useRef<HTMLTableRowElement>(null)
    const [isClicked,setIsClicked] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<SongURLArgs,void>('download-song')
    const songIcon = isClicked && !receivedData && result !== undefined ? <Spinner/>: <img className='h-12 w-12 max-w-none' src={thumbnail}/>

    useEffect(() => {
        if(isClicked && receivedData && result === undefined) {
            setIsClicked(false)
        }
    },[receivedData,isClicked,result])

    useEffect(() => {
        if(isClicked) {
            const row = rowRef.current
            row!.className = 'bg-gray-300'
            setArgs({ songURL: url })
        }        
    },[isClicked])

    const durationFormatted = useMemo(() => {
        const durationInSeconds = Math.trunc(duration / MILLISECONDS_PER_SECOND)
        const minutes = Math.trunc(durationInSeconds / SECONDS_PER_MINUTE)
        const seconds = String(durationInSeconds % SECONDS_PER_MINUTE).padStart(2,'0')
        return `${minutes}:${seconds}`
    },[props.duration])

    const likeFormatted = useMemo(() => {
        return likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },[props.likes])

    return (
        <TableRow ref={rowRef} key={url} onClick={() => setIsClicked(true)}>
            <TableCell>{songIcon}</TableCell>
            <TableCell className='max-w-[400px]'>
                <MarqueeText text={title}/>
            </TableCell>
            <TableCell className='max-w-[100px]'>
                <MarqueeText text={title}/>
            </TableCell>
            <TableCell>{durationFormatted}</TableCell>
            <TableCell className="text-right">{likeFormatted}</TableCell>
        </TableRow>
    )
}

export default SongTile