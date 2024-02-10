import { useState } from "react"
import Marquee from "react-fast-marquee"

export interface MarqueeTextProps {
    text: string;
    speed?: number;
    classname?: string;
}

const MarqueeText = (props: MarqueeTextProps) => {
    const {text,speed,classname} = props
    const [isHovered,setIsHovered] = useState<boolean>(false)

    const onMouseEnter = () => {
        setIsHovered(true)
    }

    const onMouseLeave = () => {
        setIsHovered(false)
    }

    return(
        <div 
            className={`${classname} whitespace-nowrap overflow-hidden`} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
        >
            {isHovered ? 
                <Marquee style={{ overflowY: 'hidden' }} speed={speed ?? 30}>{text}</Marquee>: 
                <span>{text}</span>}
        </div>
    )
}

export default MarqueeText