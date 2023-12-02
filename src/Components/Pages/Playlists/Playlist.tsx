import ReactDragListView from 'react-drag-listview';
import { DragListViewProps } from 'react-drag-listview'
import { SongOrder, SongTitle } from "@/Interfaces/electronHandlerReturns";
import { PutPlaylistSongBodyItem, ReorderSongsArgs } from "@/Interfaces/electronHandlerInputs";
import useElectronHandler from '@/Hooks/useElectronHandler';

const Playlist = () => {
    const {
        result: songOrder,
        error: songOrderError,
        receivedData: receivedSongOrderData,
        setArgs: setSongOrderArgs
    } = useElectronHandler<ReorderSongsArgs,SongOrder[]>('edit-song-order')

    const [songTitles,setSongTitles] = useState<SongTitle[]>([])

    useEffect(() => {
        setSongsArgs({})
    },[])

    useEffect(() => {
        if(receivedSongsData && !songsError && songs) {
            setSongTitles(songs)
        }
    },[receivedSongsData,songsError,songs])

    const onDragEnd = (fromIndex: number, toIndex: number): void => {
        const updatedSongTitles = [...songTitles as SongTitle[]];
        const draggedItem = updatedSongTitles.splice(fromIndex, 1)[0]
        updatedSongTitles.splice(toIndex, 0, draggedItem)
        const songOrderings: PutPlaylistSongBodyItem[] = updatedSongTitles.map((songTitle: SongTitle, index: number) => {
            return { songTitle: songTitle.title, songOrder: index}
        })
        setSongOrderArgs({
            playlistName: playlist,
            songOrderings: songOrderings
        })
    }
    
    const dragProps: DragListViewProps = {
        onDragEnd,
        nodeSelector: 'tr',
        handleSelector: 'div',
    }

    return(
        <ReactDragListView {...dragProps}>
            {/* <SongTable songMetadata={}/> */}
        </ReactDragListView>
    )
}