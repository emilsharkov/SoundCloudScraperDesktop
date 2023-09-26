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
        <tr>
            <td className='w-2/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500'><div className='w-full justify-center flex'><img className='h-8' src={props.thumbnail}/></div></td>
            <td className='w-6/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500 font-semibold'>{props.title}</td>
            <td className='w-2/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-left text-black-500'>{props.artist}</td>
            <td className='w-1/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-center text-black-500'>{durationFormatted}</td>
            <td className='w-1/12 h-14 border-t-0 align-middle border-l-0 border-r-0 text-xs truncate text-center text-black-500'>{props.likes}</td>
        </tr>
    )
}

export default SongSuggestionTile