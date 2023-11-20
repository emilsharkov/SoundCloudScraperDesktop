import { useContext } from "react"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import DefaultThumbnail from '@/Assets/default-thumbnail.png'

interface CurrentSongThumbnailProps {
    className?: string;
}

const CurrentSongThumbnail = (props: CurrentSongThumbnailProps) => {
    const currentSong = useAppSelector((state) => state.currentSong.value)
    const songImageSource: string = currentSong !== '' ? `http://localhost:11738/songImages/${currentSong}.png`: DefaultThumbnail

    return (
        <div className='flex justify-center w-full'>
            <img className='w-full border-slate-950 border' src={songImageSource} />
        </div>
    )
}
export default CurrentSongThumbnail