  import Skip from "./Skip"
  import Replay from './Replay'
  import Shuffle from './Shuffle'
  import SongSlider from "./SongSlider"
  import useMusicPlayer from "@/Hooks/useMusicPlaying"
  import Play from "./Play"
  import useMusicQueue from "@/Hooks/useMusicQueue"
  import { useAppSelector, useAppDispatch } from '@/Redux/hooks'

  export type ReplayingType = 'NO_REPLAY' | 'REPLAY_PLAYLIST' | 'REPLAY_SONG'

  export interface MusicPlayerProps {
    className?: string;
  }

  const MusicPlayer = (props: MusicPlayerProps) => {
    const {
      audioRef,
      musicQueue,
      currentQueueIndex,
      setMusicQueue,
      setCurrentQueueIndex
    } = useMusicPlayer()

    const songs = useAppSelector((state) => state.songs.value)
    const isPlaying = useAppSelector((state) => state.isPlaying.value)
    const replayingType = useAppSelector((state) => state.replayingType.value)

    useMusicQueue(
      audioRef,
      isPlaying,
      replayingType,
      musicQueue,
      currentQueueIndex,
      setCurrentQueueIndex
    )

    return (
      <div className={`${props.className} self-center mb-2`}>
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
              inSongTableRow={false}
            />
            <Skip 
              skipForward={true}
              musicQueue={musicQueue}
              currentQueueIndex={currentQueueIndex}
              setCurrentQueueIndex={setCurrentQueueIndex}
            />
            <Replay/>
          </div>
          <SongSlider audioRef={audioRef}/>
        </div>
      </div>
      
    )
  }
  export default MusicPlayer