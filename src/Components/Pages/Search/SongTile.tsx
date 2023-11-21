import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import useElectronHandler from '@/Hooks/useElectronHandler';
import { TableCell,TableRow } from '@/Components/ui/table';
import Spinner from './Spinner';
import { SongURLArgs } from '@/Interfaces/electronHandlerInputs';

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
    const songIcon = isClicked && receivedData && !error ? <Spinner/>: <img className='h-8' src={thumbnail}/>

    useEffect(() => {
        if(!isClicked) { return }
        const row = rowRef.current
        row!.className = 'bg-gray-300'
        setArgs({ songURL: url })
    },[isClicked])

    const durationFormatted = useMemo(() => {
        const durationInSeconds = Math.trunc(props.duration / MILLISECONDS_PER_SECOND)
        const minutes = Math.trunc(durationInSeconds / SECONDS_PER_MINUTE)
        const seconds = durationInSeconds % SECONDS_PER_MINUTE
        return `${minutes}:${seconds}`
    },[props.duration])

    return (
        <TableRow ref={rowRef} key={url} onClick={() => setIsClicked(true)}>
            <TableCell className="font-medium">{songIcon}</TableCell>
            <TableCell>{title}</TableCell>
            <TableCell>{artist}</TableCell>
            <TableCell>{durationFormatted}</TableCell>
            <TableCell className="text-right">{likes}</TableCell>
        </TableRow>
    )
}

export default SongTile