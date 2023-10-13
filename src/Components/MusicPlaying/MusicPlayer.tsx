import { Slider } from "@/Components/ui/slider"
import { Button } from "@/Components/ui/button"
import Skip from "./Skip"
import Replay from './Replay'
import Shuffle from './Shuffle'
import SongSlider from "./SongSlider"
import useMusicPlayer from "@/Hooks/useMusicPlaying"
import Play from "./Play"
import { useEffect, useState } from "react"
import useMusicQueue from "@/Hooks/useMusicQueue"

export interface MusicPlayerComponentProps {
  className?: string;
}

const MusicPlayerComponent = (props: MusicPlayerComponentProps) => {
  const {
    audioRef,
    songs,
    musicQueue,
    currentQueueIndex,
    setMusicQueue,
    setCurrentQueueIndex
  } = useMusicPlayer()

  const [isPlaying,setIsPlaying] = useState<boolean>(false)
  const [replayingType,setReplayingType] = useState<number>(0)

  useMusicQueue(
    audioRef,
    isPlaying,
    replayingType,
    musicQueue,
    currentQueueIndex,
    setMusicQueue,
    setCurrentQueueIndex
  )

  return (
    <div className={props.className}>
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Shuffle 
            songs={songs}
            musicQueue={musicQueue}
            currentQueueIndex={currentQueueIndex}
            setMusicQueue={setMusicQueue}
            setCurrentQueueIndex={setCurrentQueueIndex}
          />
          <Skip 
            skipForward={false}
            musicQueue={musicQueue}
            currentQueueIndex={currentQueueIndex}
            setCurrentQueueIndex={setCurrentQueueIndex}
          />
          <Play
            audioRef={audioRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          <Skip 
            skipForward={true}
            musicQueue={musicQueue}
            currentQueueIndex={currentQueueIndex}
            setCurrentQueueIndex={setCurrentQueueIndex}
          />
          <Replay 
            replayingType={replayingType}
            setReplayingType={setReplayingType}
          />
        </div>
        <SongSlider audioRef={audioRef}/>
      </div>
    </div>
    
  )
}
export default MusicPlayerComponent