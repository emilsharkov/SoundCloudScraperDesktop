import { Button } from "@/Components/ui/button"
import { Shuffle as ShuffleIcon } from 'lucide-react';
import { useEffect, useState } from "react"

interface ShuffleProps {
    songs: string[];
    musicQueue: string[];
    currentQueueIndex: number;
    setMusicQueue: (musicQueue: string[]) => void;
    setCurrentQueueIndex: (currentQueueIndex: number) => void;
}

const Shuffle = (props: ShuffleProps) => {
    const {
        songs,
        musicQueue,
        currentQueueIndex,
        setMusicQueue,
        setCurrentQueueIndex
    } = props
    const [isShuffled,setIsShuffled] = useState<boolean>(false)

    useEffect(() => {
        if(musicQueue.length) {
            if(isShuffled) {
                const songsWithoutCurrent = musicQueue.filter(song => song !== musicQueue[currentQueueIndex])
                const shuffledSongs: string[] = songsWithoutCurrent
                    .map((value: string) => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)
                setMusicQueue( [musicQueue[currentQueueIndex],...shuffledSongs] ) 
            } else {
                const indexOfSong = songs.indexOf(musicQueue[currentQueueIndex])
                setCurrentQueueIndex(indexOfSong)
                setMusicQueue(songs)
            }
        }
    },[songs,isShuffled])

    return (
        <Button size="icon" variant="ghost" onClick={() => setIsShuffled(!isShuffled)}>
            <ShuffleIcon color={isShuffled ? '#1ed760': 'black'} strokeWidth={1.5}/>
        </Button>
    )
}
export default Shuffle