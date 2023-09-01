import { useState, useEffect, useContext } from 'react'
import { MusicContext } from '@/App'
import { MusicCtxt } from '@/Context/MusicProvider'
import pause from '../../Assets/pause.svg'
import play from '../../Assets/play.svg'
import repeat from '../../Assets/repeat.svg'
import shuffle from '../../Assets/shuffle.svg'
import skipForward from '../../Assets/skip-forward.svg'
import skipBackward from '../../Assets/skip-backward.svg'
import './MusicPlayer.css'

export interface MusicPlayerProps {
    className?: string;
}

export const MusicPlayer = (props: MusicPlayerProps) => {
    const [currentSongIndex,setCurrentSongIndex] = useState<number|null>(null)
    const [playing,setPlaying] = useState<boolean>(false)
    const {songs,setSongs} = useContext<MusicCtxt>(MusicContext)

    const getMp3Url = (song: string) => {
        return `http://localhost:3000/songs/${song}.mp3`
    }

    return(
        <div className={props.className}>
            <div className='music-bar-container'>
                <audio className='music-bar' controls>
                    <source src={songs.length ? getMp3Url(songs[0]): ''} type='audio/mpeg' />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    )
}

{/* <img src='http://localhost:3000/images/Im Gonna Rip Out Your Spine!.jpg'></img> */}
