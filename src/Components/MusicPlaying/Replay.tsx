import { Button } from "@/Components/ui/button"
import replay from '../../Assets/replay.svg'
import { useState } from "react"

const Replay = () => {
    const [isReplaying,setIsReplaying] = useState<boolean>(false)

    return (
        <Button size="icon" variant="ghost" onClick={() => console.log()}>
            <img src={replay}/>
        </Button>
    )
}
export default Replay