import { useContext, useEffect } from "react"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import DefaultThumbnail from '@/Assets/default-thumbnail.png'
import useElectronHandler from "@/Hooks/useElectronHandler";
import { Mp3Metadata, SongNameArgs } from "@/Interfaces/electronHandlerInputs";
import MarqueeText from "@/Components/Shared/SongTable/MarqueeText";
import { Skeleton } from "../ui/skeleton";

interface CurrentSongThumbnailProps {
    className?: string;
}

const CurrentSongThumbnail = (props: CurrentSongThumbnailProps) => {
    const currentQueueIndex = useAppSelector((state) => state.currentQueueIndex.value)
    const musicQueue = useAppSelector((state) => state.queue.musicQueue)
    const currentSong = musicQueue.length && currentQueueIndex < musicQueue.length && currentQueueIndex >= 0 ? musicQueue[currentQueueIndex] : ''
    const songImageSource = currentSong !== '' ? `http://localhost:11738/songImages/${currentSong}.png?${new Date().getTime()}`: DefaultThumbnail
    const { result,error,receivedData,setArgs } = useElectronHandler<SongNameArgs,Mp3Metadata>('get-mp3-metadata')

    useEffect(() => {
        if(currentSong !== '') {
            setArgs({songName: currentSong})
        }
    },[currentSong])


    return (
        <div className={props.className}>
            <div className='flex flex-col justify-end items-center h-full max-w-[100%] w-full'>
                <div className="max-w-[80%] w-[80%] border-slate-950 border rounded">
                    <img className='h-full w-full rounded' src={songImageSource} alt="Song Image" />
                </div>
                <div className="flex flex-col w-[80%] max-w-[80%] items-start justify-start space-y-1 mt-2 mb-3 overflow-hidden whitespace-nowrap">
                    <p className="text-lg font-semibold leading-none w-full">
                        {receivedData && !error && result ? <MarqueeText text={result.title} />: <Skeleton className='h-6 w-full'/>}
                    </p>
                    <p className="text-sm text-muted-foreground w-full">
                        {receivedData && !error && result ? <MarqueeText text={result.artist} /> : <Skeleton className='h-4 w-full'/>}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default CurrentSongThumbnail