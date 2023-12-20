import { clearSource, play, setCurrentSong } from '@/Redux/Slices/audioSlice'
import { setCurrentQueueIndex } from '@/Redux/Slices/currentQueueIndexSlice'
import { setIsPlaying } from '@/Redux/Slices/isPlayingSlice'
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

    const prevIsShuffled = useRef<boolean | null>(null)

    useEffect(() => {
      if (isShuffled !== prevIsShuffled.current) {
        if (audio.src && defaultQueue.length) {
          if (isShuffled) {
            const songsWithoutCurrent = musicQueue.filter((song) => song !== musicQueue[currentQueueIndex])
            const shuffledSongs: string[] = songsWithoutCurrent
              .map((value: string) => ({ value, sort: Math.random() }))
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
        prevIsShuffled.current = isShuffled
      }
    },[isShuffled,defaultQueue,currentQueueIndex,musicQueue])

    useEffect(() => {
        if(musicQueue.length && currentQueueIndex >= 0 && currentQueueIndex <= musicQueue.length - 1) {
            console.log('here')
            const currentSong = musicQueue[currentQueueIndex]
            dispatch(setCurrentSong(currentSong))
        } else {
            console.log('here2')
            dispatch(clearSource())
        }
    },[musicQueue,currentQueueIndex])

    useEffect(() => {
        const handleCanPlay = () => {
            if(isPlaying) {
                console.log(isPlaying)
                dispatch(play())
            }
        }
        audio.addEventListener('canplay', handleCanPlay)
        return () => audio.removeEventListener('canplay', handleCanPlay)
    },[audio.src,isPlaying])

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