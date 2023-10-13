import { useEffect } from "react"

const useMusicQueue = (
        audioRef: React.MutableRefObject<HTMLAudioElement | null>, 
        isPlaying: boolean, 
        replayingType: number,
        musicQueue: string[],
        currentQueueIndex: number,
        setMusicQueue: React.Dispatch<React.SetStateAction<string[]>>,
        setCurrentQueueIndex: React.Dispatch<React.SetStateAction<number>>
    ) => {

    useEffect(() => {
        const handleSongEnded = () => {
            
        }

        audioRef.current?.addEventListener('ended', handleSongEnded)
        return () => audioRef.current?.removeEventListener('ended', handleSongEnded)
    },[audioRef,isPlaying,replayingType])
}
export default useMusicQueue