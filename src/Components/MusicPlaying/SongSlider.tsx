import { Slider } from "@/Components/ui/slider"

interface SongSliderProps {
    second: number;
    duration: number;
    onSliderSeek: ( value: number[] ) => void;
}

const SongSlider = (props: SongSliderProps) => {
    return (
        <Slider 
            className="flex-1" 
            defaultValue={[props.second]}
            max={props.duration}
            step={1}
            onValueChange={(value) => props.onSliderSeek(value)}
        />
    )
}
export default SongSlider