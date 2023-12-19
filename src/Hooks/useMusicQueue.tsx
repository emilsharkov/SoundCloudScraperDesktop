import { clearSource, play, setCurrentSong } from '@/Redux/Slices/audioSlice'
import { setCurrentQueueIndex } from '@/Redux/Slices/currentQueueIndexSlice'
import { setMusicQueue } from '@/Redux/Slices/queueSlice'
import { setQueuedSongs } from '@/Redux/Slices/queuedSongsSlice'
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { useEffect, useRef } from "react"

const useMusicQueue = () => {
    const audio = useAppSelector((state) => state.audio.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const defaultQueue = useAppSelector((state) => state.queue.defaultQueue)
    const queuedSongs = useAppSelector((state) => state.queuedSongs.value)
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const replayingType = useAppSelector((state) => state.replayingType.value)
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const isShuffled = useAppSelector((state) => state.isShuffled.value)
    
    const dispatch = useAppDispatch()
    const latestSongRef = useRef<string>('')

    const listenQueuedSong = () => {
        const firstHalf = musicQueue.length > 1 ? musicQueue.slice(0,currentQueueIndex): []
        const secondHalf = musicQueue.length > 1 ? musicQueue.slice(currentQueueIndex): []
        const newMusicQueue = [...firstHalf,queuedSongs[0],...secondHalf]
        const newQueuedSongs = queuedSongs.length > 1 ? queuedSongs.slice(1): []
        dispatch(setMusicQueue(newMusicQueue))
        dispatch(setQueuedSongs(newQueuedSongs))
        dispatch(setCurrentQueueIndex(currentQueueIndex + 1))
    }

    useEffect(() => {
        if(audio.src && defaultQueue.length) {
            if(isShuffled){
                const songsWithoutCurrent = musicQueue.filter(song => song !== musicQueue[currentQueueIndex])
                const shuffledSongs: string[] = songsWithoutCurrent
                    .map((value: string) => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)
                setMusicQueue( [musicQueue[currentQueueIndex],...shuffledSongs] ) 
                dispatch(setCurrentQueueIndex(0))
            } else {
                const indexOfCurrentSong = defaultQueue.indexOf(musicQueue[currentQueueIndex])
                dispatch(setMusicQueue(defaultQueue))
                dispatch(setCurrentQueueIndex(indexOfCurrentSong))
            }
        }
    },[isShuffled,defaultQueue,currentQueueIndex,musicQueue])

    useEffect(() => {
        if(musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1) {
            const currentSong = musicQueue[currentQueueIndex]
            dispatch(setCurrentSong(currentSong))
            latestSongRef.current = currentSong
        } else {
            dispatch(clearSource())
            latestSongRef.current = ''
        }
    },[musicQueue,currentQueueIndex])

    useEffect(() => {
        if(isPlaying) {
            if(musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1) {
                const currentSong = musicQueue[currentQueueIndex]
                if() {
                    
                }
            }
        }
    },[latestSongRef.current,musicQueue,currentQueueIndex])

    useEffect(() => {
        const handleSongEnded = () => {
            if(isPlaying && musicQueue.length){
                if(replayingType === 'NO_REPLAY') {
                    if(queuedSongs.length) {
                        listenQueuedSong()
                    }
                    else if(currentQueueIndex < musicQueue.length - 1) {
                        dispatch(setCurrentQueueIndex(currentQueueIndex + 1))
                    }
                } else if(replayingType === 'REPLAY_PLAYLIST') {
                    if(queuedSongs.length) {
                        listenQueuedSong()
                    }
                    else if(currentQueueIndex === musicQueue.length - 1) {
                        dispatch(setCurrentQueueIndex(0))
                    } else {
                        dispatch(setCurrentQueueIndex(currentQueueIndex + 1))
                    }
                } else {
                    audio.currentTime = 0
                    dispatch(play())
                }
            }
        }
        audio.addEventListener('ended', handleSongEnded)
        return () => audio.removeEventListener('ended', handleSongEnded)
    },[audio,isPlaying,replayingType,musicQueue,currentQueueIndex])
}
export default useMusicQueue