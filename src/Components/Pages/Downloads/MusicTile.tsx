import { MusicContext } from "@/App";
import { MusicCtxt } from "@/Context/MusicProvider";
import { useGetMp3Metadata } from "@/Hooks/useGetMp3Metadata"
import { useContext, useEffect, useMemo } from "react";
import { Song } from "soundcloud-scraper";

export interface MusicTileProps {
    songName: string;
    onClickQueue: string[];
}

const MusicTile = (props: MusicTileProps) => {
    const {mp3Metadata,setSongName} = useGetMp3Metadata()
    const {songs,setSongs} = useContext<MusicCtxt>(MusicContext)

    useEffect(() => setSongName(props.songName),[props.songName])

    const imagePath = useMemo(() => {
        return `http://localhost:3000/images/${props.songName}`
    },[props.songName])

    return(
        <div className='' onClick={() => setSongs(props.onClickQueue)}>
            <img className='downloads-song-image' src={imagePath}/>
            <p className='downloads-title-text'>title{mp3Metadata?.title}</p>
            <p className='downloads-artist-text'>artist{mp3Metadata?.artist}</p>
        </div>
    )
}

export default MusicTile