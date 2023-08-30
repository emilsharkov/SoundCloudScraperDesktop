import { useState, useContext } from 'react'
import { MusicContext } from '@/App'
import { MusicCtxt } from '@/Context/MusicProvider'
import pause from '../../Assets/pause.svg'
import play from '../../Assets/play.svg'
import repeat from '../../Assets/repeat.svg'
import shuffle from '../../Assets/shuffle.svg'
import skipForward from '../../Assets/skip-forward.svg'
import skipBackward from '../../Assets/skip-backward.svg'
import './MusicPlayer.css'

export const MusicPlayer = () => {
    const [currentSongIndex,setCurrentSongIndex] = useState<number|null>(null)
    const [playing,setPlaying] = useState<boolean>(false)
    const {songs,setSongs} = useContext<MusicCtxt>(MusicContext)

    return(
        <div>
            <audio controls>
                <source src="http://localhost:3000/songs/Im Gonna Rip Out Your Spine!.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <img src='http://localhost:3000/images/Im Gonna Rip Out Your Spine!.jpg'></img>
            {/* <img onClick={() => play()} src={pause} alt="Pause" />
            <img onClick={() => play()} src={play} alt="Play" />
            <img onClick={() => play()} src={repeat} alt="Repeat" />
            <img onClick={() => play()} src={shuffle} alt="Shuffle" />
            <img onClick={() => play()} src={skipForward} alt="Skip Forward" />
            <img onClick={() => play()} src={skipBackward} alt="Skip Backward" /> */}
        </div>
    )
}