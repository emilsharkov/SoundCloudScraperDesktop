import { useEffect } from "react"
import { useSongLibrary } from "@/Hooks/useSongLibrary"
import MusicTile from './MusicTile'
import './Downloads.css'

const Downloads = () => {
    const {songs,setReceivedSongs} = useSongLibrary()

    useEffect(() => setReceivedSongs(false),[])

    return(
        <div>
            <>Downloads</>
            {songs.map(song => {
                return (
                    <MusicTile 
                        key={song} 
                        songName={song}
                        onClickQueue={[song]}
                    />
                ) 
            })}
        </div>
        
    )
}

export default Downloads