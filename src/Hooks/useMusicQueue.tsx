import { MusicContext } from "@/App"
import { ReplayingType } from "@/Components/MusicPlaying/MusicPlayer"
import { MusicCtxt } from "@/Context/MusicContext"
import { useContext, useEffect } from "react"

const useMusicQueue = (
        audioRef: React.MutableRefObject<HTMLAudioElement | null>, 
        isPlaying: boolean, 
        replayingType: ReplayingType,
        musicQueue: string[],
        currentQueueIndex: number,
        setCurrentQueueIndex: React.Dispatch<React.SetStateAction<number>>
    ) => {
    
    const { setCurrentSong } = useContext<MusicCtxt>(MusicContext)

    useEffect(() => {
        if(audioRef.current && musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1) {
            const currentSong = musicQueue[currentQueueIndex]
            audioRef.current.src = `http://localhost:3000/songs/${currentSong}`
            setCurrentSong(currentSong)
        } else {
            setCurrentSong('')
        }
    },[audioRef,musicQueue,currentQueueIndex])

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