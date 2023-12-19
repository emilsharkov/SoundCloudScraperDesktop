import { useContext } from "react"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import DefaultThumbnail from '@/Assets/default-thumbnail.png'

interface CurrentSongThumbnailProps {
    className?: string;
}

const CurrentSongThumbnail = (props: CurrentSongThumbnailProps) => {
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : ''
    const songImageSource = currentSong !== '' ? `http://localhost:11738/songImages/${currentSong}.png`: DefaultThumbnail

    return (
        <div className='flex justify-center w-full'>
            <img className='w-full border-slate-950 border' src={songImageSource} />
        </div>
    )
}
export default CurrentSongThumbnail