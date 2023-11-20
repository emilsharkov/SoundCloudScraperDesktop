import { ReplayingType } from "@/Components/MusicPlaying/MusicPlayer"
import { setCurrentSong } from "@/Redux/Slices/currentSongSlice"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { useContext, useEffect } from "react"

const useMusicQueue = (
        audioRef: React.MutableRefObject<HTMLAudioElement | null>, 
        isPlaying: boolean, 
        replayingType: ReplayingType,
        musicQueue: string[],
        currentQueueIndex: number,
        setCurrentQueueIndex: React.Dispatch<React.SetStateAction<number>>
    ) => {
    
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(audioRef.current && musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1 && musicQueue[currentQueueIndex] !== '') {
            const currentSong = musicQueue[currentQueueIndex]
            audioRef.current.src = `http://localhost:11738/songFiles/${currentSong}.mp3`
            dispatch(setCurrentSong(currentSong))
        } else {
            if(audioRef.current){
                audioRef.current.src = ''
            }
            dispatch(setCurrentSong(''))
        }
    },[musicQueue,currentQueueIndex])

    useEffect(() => {
        const handleSongEnded = () => {
            if(audioRef.current && isPlaying && musicQueue.length){
                if(replayingType === 'NO_REPLAY') {
                    if(currentQueueIndex < musicQueue.length - 1) {
                        setCurrentQueueIndex(currentQueueIndex + 1)
                    }
                } else if(replayingType === 'REPLAY_PLAYLIST') {
                    if(currentQueueIndex === musicQueue.length - 1) {
                        setCurrentQueueIndex(0)
                    } else {
                        setCurrentQueueIndex(currentQueueIndex + 1)
                    }
                } else {
                    audioRef.current.currentTime = 0
                }
            }
        }
        audioRef.current?.addEventListener('ended', handleSongEnded)
        return () => audioRef.current?.removeEventListener('ended', handleSongEnded)
    },[audioRef,isPlaying,replayingType,musicQueue,currentQueueIndex])
}
export default useMusicQueue