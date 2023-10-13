import { useContext } from "react"
import { MusicContext } from "@/App"
import { MusicCtxt } from "@/Context/MusicContext"
import DefaultThumbnail from '@/Assets/default-thumbnail.png'

interface CurrentSongThumbnailProps {
    className?: string;
}

const CurrentSongThumbnail = (props: CurrentSongThumbnailProps) => {
    const {songs,setSongs} = useContext<MusicCtxt>(MusicContext)
    const songImageSource: string = songs.length ? `http://localhost/${songs[currentSongIndex]}`: DefaultThumbnail

    return (
        <div className='flex justify-center w-full'>
            <img className='w-full border-slate-950 border' src={songImageSource} />
        </div>
    )
}
export default CurrentSongThumbnail