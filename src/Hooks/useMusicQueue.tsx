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

    const prevIsShuffled = useRef<boolean>(false)
    const prevDefaultQueue = useRef<number[]>([])

    useEffect(() => {
        if (isShuffled !== prevIsShuffled.current || defaultQueue !== prevDefaultQueue.current) {
            if (audio.src && defaultQueue.length) {
                if (isShuffled) {
                    const songsWithoutCurrent = musicQueue.filter((song_id) => song_id !== musicQueue[currentQueueIndex])
                    const shuffledSongs: number[] = songsWithoutCurrent
                        .map((value: number) => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value)
                    const newMusicQueue = [musicQueue[currentQueueIndex], ...shuffledSongs]
                    dispatch(setMusicQueue(newMusicQueue))
                    dispatch(setCurrentQueueIndex(0))
                } else {
                    const indexOfCurrentSong = defaultQueue.indexOf(musicQueue[currentQueueIndex])
                    dispatch(setMusicQueue(defaultQueue))
                    dispatch(setCurrentQueueIndex(indexOfCurrentSong))
                }
            }
            if(isShuffled !== prevIsShuffled.current){
                prevIsShuffled.current = isShuffled
            } else if(defaultQueue !== prevDefaultQueue.current ) {
                prevDefaultQueue.current = defaultQueue
            }
        }
    },[isShuffled,defaultQueue,currentQueueIndex,musicQueue])

    useEffect(() => {
        if(musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1) {
            const currentSong = musicQueue[currentQueueIndex]
            dispatch(setCurrentSong(currentSong))
        } else {
            dispatch(clearSource())
        }
    },[musicQueue,currentQueueIndex])

    useEffect(() => {
        const handleCanPlay = () => {
            if(isPlaying) {
                dispatch(play())
            }
        }
        audio.addEventListener('canplay', handleCanPlay)
        return () => audio.removeEventListener('canplay', handleCanPlay)
    },[audio.src,isPlaying])

    const listenQueuedSong = () => {
        let newMusicQueue = [...musicQueue]
        newMusicQueue.splice(currentQueueIndex + 1, 0, queuedSongs[0])
        const newQueuedSongs = queuedSongs.length > 0 ? queuedSongs.slice(1) : [];
        dispatch(setMusicQueue(newMusicQueue))
        dispatch(setQueuedSongs(newQueuedSongs))
        dispatch(setCurrentQueueIndex(currentQueueIndex + 1))
    }

    const rewindSong = () => {
        audio.currentTime = 0
        dispatch(play())
    }

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
                        if(musicQueue.length === 1) {
                            rewindSong()
                        } else {
                            dispatch(setCurrentQueueIndex(0))
                        }
                    } else {
                        dispatch(setCurrentQueueIndex(currentQueueIndex + 1))
                    }
                } else {
                    rewindSong()
                }
            }
        }
        audio.addEventListener('ended', handleSongEnded)
        return () => audio.removeEventListener('ended', handleSongEnded)
    },[audio,isPlaying,replayingType,musicQueue,currentQueueIndex,queuedSongs])
}
export default useMusicQueue