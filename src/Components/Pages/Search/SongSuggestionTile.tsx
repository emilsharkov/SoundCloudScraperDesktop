import { useCallback, useState, useMemo } from 'react'

interface SongSuggestionProps {
    title: string;
    thumbnail: string;
    duration: number;
    likes: string;
    artist: string;
}

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60

const SongSuggestionTile = (props: SongSuggestionProps) => {
    
    const durationFormatted = useMemo(() => {
        const durationInSeconds = Math.trunc(props.duration / MILLISECONDS_PER_SECOND)
        const minutes = Math.trunc(durationInSeconds / SECONDS_PER_MINUTE)
        const seconds = durationInSeconds % SECONDS_PER_MINUTE
        return `${minutes}:${seconds}`
    },[props.duration])

    return (
        <tr className=''>
            <td className='h-10 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left'><img className='h-8' src={props.thumbnail}/></td>
            <td className='h-10 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left'>{props.title}</td>
            <td className='h-10 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left'>{props.artist}</td>
            <td className='h-10 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left'>{durationFormatted}</td>
            <td className='h-10 border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left'>{props.likes}</td>
        </tr>
    )
}

export default SongSuggestionTile