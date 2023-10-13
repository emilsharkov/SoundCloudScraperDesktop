import { Slider } from "@/Components/ui/slider"
import { Button } from "@/Components/ui/button"
import Play from '../../Assets/play.svg'
import Skip from "./Skip"
import Replay from './Replay'
import Shuffle from './Shuffle'
import SongSlider from "./SongSlider"
import useMusicPlayer from "@/Hooks/useMusicPlaying"

export interface MusicPlayerComponentProps {
  className?: string;
}

const MusicPlayerComponent = (props: MusicPlayerComponentProps) => {
  const {
    songs,
    musicQueue,
    currentQueueIndex,
    setMusicQueue,
    setCurrentQueueIndex
  } = useMusicPlayer()

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
          <Skip skipForward={false}/>
          <Button className="p-2" size="icon" variant="ghost">
            <img src={Play}/>
          </Button>
          <Skip skipForward={true}/>
          <Replay />
        </div>
        <SongSlider second={0} duration={100} onSliderSeek={(value) => console.log(value)}/>
      </div>
    </div>
    
  )
}
export default MusicPlayerComponent