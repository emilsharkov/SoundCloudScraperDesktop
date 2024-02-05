import { useContext, useEffect } from "react"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import DefaultThumbnail from '@/Assets/default-thumbnail.png'
import useElectronHandler from "@/Hooks/useElectronHandler";
import { SongIDsArgs } from "@/Interfaces/electronHandlerInputs";
import MarqueeText from "@/Components/Shared/SongTable/MarqueeText";
import { Skeleton } from "../ui/skeleton";
import { SongRow } from "@/Interfaces/electronHandlerReturns";

interface CurrentSongThumbnailProps {
    className?: string;
}

const currentSongIDThumbnail = (props: CurrentSongThumbnailProps) => {
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSongID = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : -1
    const songImageSource = currentSongID !== -1 ? `http://localhost:11738/songImages/${currentSongID}.png?${new Date().getTime()}`: DefaultThumbnail
    const {result,error,receivedData,setArgs} = useElectronHandler<SongIDsArgs,SongRow[]>('get-mp3-metadata')

    useEffect(() => {
        if(currentSongID !== -1) {
            setArgs({song_ids: [currentSongID]})
        }
    },[currentSongID])


    return (
        <div className={props.className}>
            <div className='flex flex-col justify-end items-center h-full max-w-[100%] w-full'>
                <div className="max-w-[80%] w-[80%] border-slate-950 border rounded">
                    <img className='h-full w-full rounded' src={songImageSource} alt="Song Image" />
                </div>
                <div className="flex flex-col w-[80%] max-w-[80%] items-start justify-start space-y-1 mt-2 mb-3 overflow-hidden whitespace-nowrap">
                    <p className="text-lg font-semibold leading-none w-full">
                        {receivedData && !error && result ? <MarqueeText text={result[0].title} />: <Skeleton className='h-6 w-full'/>}
                    </p>
                    <p className="text-sm text-muted-foreground w-full">
                        {receivedData && !error && result ? <MarqueeText text={result[0].artist} /> : <Skeleton className='h-4 w-full'/>}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default currentSongIDThumbnail