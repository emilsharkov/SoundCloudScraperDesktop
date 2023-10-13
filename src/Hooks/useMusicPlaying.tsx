import { MusicContext } from '@/App'
import { MusicCtxt } from '@/Context/MusicContext'
import { useState, useEffect, useContext, useRef } from 'react'

const useMusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    if(audioRef.current === null) {
        audioRef.current = new Audio()
    }

    const {songs} = useContext<MusicCtxt>(MusicContext)
    const [musicQueue,setMusicQueue] = useState<string[]>([])
    const [currentQueueIndex,setCurrentQueueIndex] = useState<number>(0)

    useEffect(() => {
        setMusicQueue(songs)
    },[songs])

    return {audioRef,songs,musicQueue,currentQueueIndex,setMusicQueue,setCurrentQueueIndex}
}
export default useMusicPlayer