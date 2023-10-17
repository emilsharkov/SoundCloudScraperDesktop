import { useState, useEffect, useContext, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'

const useMusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    if(audioRef.current === null) {
        audioRef.current = new Audio()
    }

    const songs = useAppSelector((state) => state.songs.value)
    const [musicQueue,setMusicQueue] = useState<string[]>([])
    const [currentQueueIndex,setCurrentQueueIndex] = useState<number>(0)

    useEffect(() => {
        setMusicQueue(songs)
    },[songs])

    return {audioRef,musicQueue,currentQueueIndex,setMusicQueue,setCurrentQueueIndex}
}
export default useMusicPlayer