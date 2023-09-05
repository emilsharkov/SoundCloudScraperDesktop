import { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { MusicContext } from '@/App'
import { MusicCtxt } from '@/Context/MusicProvider'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import './MusicPlayer.css'

export interface MusicPlayerProps {
    className?: string;
}

export const MusicPlayer = (props: MusicPlayerProps) => {
    const [currentSongIndex,setCurrentSongIndex] = useState<number>(0)
    const {songs,setSongs} = useContext<MusicCtxt>(MusicContext)

    const getMp3Url = useCallback((song: string) => {
        return `http://localhost:3000/songs/${song}.mp3`
    },[songs])

    const source = useMemo(() => {
        return songs.length ? getMp3Url(songs[currentSongIndex]): ''
    },[songs,currentSongIndex])

    const skipForward = useCallback((e: React.SyntheticEvent) => {
        currentSongIndex !== songs.length - 1 ? setCurrentSongIndex(currentSongIndex + 1): null
    },[currentSongIndex])

    const skipBackward = useCallback((e: React.SyntheticEvent) => {
        currentSongIndex !== 0 ? setCurrentSongIndex(currentSongIndex - 1): null
    },[currentSongIndex])

    const songEnded = useCallback((e: Event) => {
        currentSongIndex !== songs.length - 1 ? setCurrentSongIndex(currentSongIndex + 1): null
    },[currentSongIndex])

    return(
        <div className={props.className}>
            <div className='music-bar-container'>
                <AudioPlayer 
                    src={source} 
                    className='audio-player'
                    layout="stacked-reverse" 
                    showJumpControls={false} 
                    showSkipControls={true}
                    onClickPrevious={skipBackward}
                    onClickNext={skipForward}
                    onEnded={songEnded}
                />
            </div>
        </div>
    )
}