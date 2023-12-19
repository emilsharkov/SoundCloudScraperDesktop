  import Skip from "./Skip"
  import Replay from './Replay'
  import Shuffle from './Shuffle'
  import SongSlider from "./SongSlider"
  import Play from "./Play"
  import useMusicQueue from "@/Hooks/useMusicQueue"
  import { useAppSelector, useAppDispatch } from '@/Redux/hooks'

  export type ReplayingType = 'NO_REPLAY' | 'REPLAY_PLAYLIST' | 'REPLAY_SONG'

  export interface MusicPlayerProps {
    className?: string;
  }

  const MusicPlayer = (props: MusicPlayerProps) => {
    useMusicQueue()

    return (
      <div className={`${props.className} self-center mb-2`}>
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <Shuffle/>
            <Skip skipForward={false}/>
            <Play/>
            <Skip skipForward={true}/>
            <Replay/>
          </div>
          <SongSlider/>
        </div>
      </div>
      
    )
  }
  export default MusicPlayer