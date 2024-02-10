  import Skip from "./Skip"
  import Replay from './Replay'
  import Shuffle from './Shuffle'
  import SongSlider from "./SongSlider"
  import Play from "./Play"
  import useMusicQueue from "@/Hooks/useMusicQueue"
import { useAppSelector } from "@/Redux/hooks"

  export type ReplayingType = 'NO_REPLAY' | 'REPLAY_PLAYLIST' | 'REPLAY_SONG'

  export interface MusicPlayerProps {
    className?: string;
  }

  const MusicPlayer = (props: MusicPlayerProps) => {
    const audioSrc = useAppSelector((state) => state.audio.value.src)
    const queue = useAppSelector((state) => state.queue)
    const disabled = audioSrc === window.location.href || queue.origin === null
    
    useMusicQueue()

    return (
      <div className={`${props.className} self-center mb-2`}>
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <Shuffle disabled={disabled}/>
            <Skip disabled={disabled} skipForward={false}/>
            <Play disabled={disabled}/>
            <Skip disabled={disabled} skipForward={true}/>
            <Replay disabled={disabled}/>
          </div>
          <SongSlider disabled={disabled}/>
        </div>
      </div>
      
    )
  }
  export default MusicPlayer