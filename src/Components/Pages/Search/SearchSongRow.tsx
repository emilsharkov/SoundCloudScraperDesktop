import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import useElectronHandler from '@/Hooks/useElectronHandler';
import { TableCell,TableRow } from '@/Components/ui/table';
import Spinner from './Spinner';
import { SongURLArgs } from '@/Interfaces/electronHandlerInputs';
import Marquee from "react-fast-marquee";
import MarqueeText from '@/Components/Shared/SongTable/MarqueeText';
import { SongRow } from '@/Interfaces/electronHandlerReturns';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { setDefaultQueue, setMusicQueue } from '@/Redux/Slices/queueSlice';

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

const SearchSongRow = (props: SongSuggestionProps) => {
    const {title,thumbnail,duration,likes,artist,url} = props
    const rowRef = useRef<HTMLTableRowElement>(null)
    const [isClicked,setIsClicked] = useState<boolean>(false)
    const {result,error,receivedData,setArgs} = useElectronHandler<SongURLArgs,SongRow>('download-song')
    const queue = useAppSelector((state) => state.queue)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(receivedData && !error && result) {
            if(queue.origin === 'Downloads') {
                const newDefaultQueue: number[] = [...queue.defaultQueue,result.song_id]
                const newMusicQueue: number[] = [...queue.musicQueue,result.song_id]
                dispatch(setDefaultQueue(newDefaultQueue))
                dispatch(setMusicQueue(newMusicQueue))
            }
        }
    },[receivedData,error,result])

    useEffect(() => {
        if(isClicked) {
            const row = rowRef.current
            row!.className = 'bg-gray-300'
            setArgs({ songURL: url })
        }        
    },[isClicked])

    const durationFormatted = () => {
        const durationInSeconds = Math.trunc(duration / MILLISECONDS_PER_SECOND)
        const minutes = Math.trunc(durationInSeconds / SECONDS_PER_MINUTE)
        const seconds = String(durationInSeconds % SECONDS_PER_MINUTE).padStart(2,'0')
        return `${minutes}:${seconds}`
    }

    const likeFormatted = useMemo(() => {
        return likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },[props.likes])

    return (
        <TableRow ref={rowRef} key={url} onClick={() => setIsClicked(true)}>
            <TableCell>{isClicked && !receivedData && result !== undefined ? <Spinner/>: <img className='h-10 w-10 max-w-none' src={thumbnail}/>}</TableCell>
            <TableCell><MarqueeText classname="font-semibold" text={title}/></TableCell>
            <TableCell><MarqueeText text={artist}/></TableCell>
            <TableCell>{durationFormatted()}</TableCell>
            <TableCell className="text-center">{likeFormatted}</TableCell>
        </TableRow>
    )
}

export default SearchSongRow