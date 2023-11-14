import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useSongDownload } from '@/Hooks/Electron/useDownloadSong';
import { TableCell,TableRow } from '@/Components/ui/table';
import Spinner from './Spinner';

interface SongSuggestionProps {
    title: string;
    thumbnail: string;
    duration: number;
    likes: string;
    artist: string;
    url: string;
}

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60

const SongSuggestionTile = (props: SongSuggestionProps) => {
    const {title,thumbnail,duration,likes,artist,url} = props
    const rowRef = useRef<HTMLTableRowElement>(null)
    const [isClicked,setIsClicked] = useState<boolean>(false)
    const {isDownloaded,setSongURL} = useSongDownload()
    const songIcon = isClicked && !isDownloaded ? <Spinner/>: <img className='h-8' src={thumbnail}/>

    useEffect(() => {
        if(!isClicked) { return }
        const row = rowRef.current
        row!.className = 'bg-gray-300'
        setSongURL(url)
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

export default SongSuggestionTile

    {/* <tr ref={rowRef} className='transition duration-150 hover:bg-gray-200' onClick={() => setIsClicked(true)}>
            <td className='w-2/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500'>
                <div className='w-full justify-center flex'>
                    {(!isDownloaded && isClicked) ? <Spinner />: <img className='h-8' src={props.thumbnail}/>}
                </div>
            </td>
            <td className='w-6/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500 font-semibold'>{props.title}</td>
            <td className='w-2/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500'>{props.artist}</td>
            <td className='w-1/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-center text-black-500'>{durationFormatted}</td>
            <td className='w-1/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-center text-black-500'>{props.likes}</td>
        </tr> */}