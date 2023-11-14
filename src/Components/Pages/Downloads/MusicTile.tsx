import { useGetMp3Metadata } from "@/Hooks/Electron/useGetMp3Metadata"
import { useContext, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { setSongs } from "@/Redux/Slices/songsSlice";

export interface MusicTileProps {
    songName: string;
    onClickQueue: string[];
}

const MusicTile = (props: MusicTileProps) => {
    const { songName,onClickQueue } = props
    const {mp3Metadata,setSongName} = useGetMp3Metadata()
    const songs = useAppSelector((state) => state.songs.value)
    const dispatch = useAppDispatch()
    
    useEffect(() => { 
        setSongName(props.songName)
    },[songName])

    const imagePath = useMemo(() => {
        return `http://localhost:11738/images/${props.songName}`
    },[songName])

    return(
        <div className='' onClick={() => dispatch(setSongs(onClickQueue))}>
            <img className='' src={imagePath}/>
            <p className=''>title{mp3Metadata?.title}</p>
            <p className=''>artist{mp3Metadata?.artist}</p>
        </div>
    )
}

export default MusicTile