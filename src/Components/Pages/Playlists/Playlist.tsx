import ReactDragListView from 'react-drag-listview';
import { DragListViewProps } from 'react-drag-listview'
import { SongOrder, SongTitle } from "@/Interfaces/electronHandlerReturns";
import { Mp3Metadata, PlaylistNameArgs, PutPlaylistSongBodyItem, ReorderSongsArgs, SongNamesArgs } from "@/Interfaces/electronHandlerInputs";
import useElectronHandler from '@/Hooks/useElectronHandler';
import SongTable from '@/Components/Shared/SongTable/SongTable';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { refreshPlaylist } from '@/Redux/Slices/refreshDataSlice';

export interface PlaylistProps {
    playlistName: string;
    setPlaylistName: (playlistName: string) => void;
}

const Playlist = (props: PlaylistProps) => {
    const {playlistName,setPlaylistName} = props
    const refreshPlaylistData = useAppSelector((state) => state.refreshData.playlist)
    const dispatch = useAppDispatch()
    
    const {
        result: songs,
        error: songsError,
        receivedData: receivedSongsData,
        setArgs: setSongsArgs
    } = useElectronHandler<PlaylistNameArgs,SongOrder[]>('get-songs-in-playlist')

    const {
        result: songsMetadata,
        error: songsMetadataError,
        receivedData: receivedSongsMetadata,
        setArgs: setSongsMetadataArgs
    } = useElectronHandler<SongNamesArgs,Mp3Metadata[]>('get-all-mp3-metadata')

    const {
        result: songOrder,
        error: songOrderError,
        receivedData: receivedSongOrderData,
        setArgs: setSongOrderArgs
    } = useElectronHandler<ReorderSongsArgs,SongOrder[]>('edit-song-order')

    useEffect(() => { dispatch(refreshPlaylist()) },[])
    useEffect(() => setSongsArgs({ playlistName: playlistName }),[refreshPlaylistData])

    useEffect(() => {
        if(songs && !songsError && receivedSongsData) {
            const songNames: string[] = songs
                .sort((a, b) => (a.song_order > b.song_order) ? 1 : -1)
                .map(song => song.song_title)
            setSongsMetadataArgs({songNames: songNames})
        }
    },[songs,songsError,receivedSongsData])

    const onDragEnd = (fromIndex: number, toIndex: number): void => {
        if(!songsMetadata) { return }
        const updatedSongTitles: Mp3Metadata[] = [...songsMetadata];
        const draggedItem = updatedSongTitles.splice(fromIndex, 1)[0]
        updatedSongTitles.splice(toIndex, 0, draggedItem)
        const songOrderings: PutPlaylistSongBodyItem[] = updatedSongTitles.map((metadata: Mp3Metadata, index: number) => {
            return { songTitle: metadata.title, songOrder: index}
        })
        setSongOrderArgs({
            playlistName: playlistName,
            songOrderings: songOrderings
        })
    }

    useEffect(() => {
        if(songOrder && !songOrderError && receivedSongOrderData) {
            dispatch(refreshPlaylist())
        }
    },[songOrder,songOrderError,receivedSongOrderData])
    
    const dragProps: DragListViewProps = {
        onDragEnd: onDragEnd,
        nodeSelector: 'tr',
        handleSelector: 'a',
    }

    return(
        !receivedSongsMetadata && !songsMetadataError && songsMetadata &&
            <ReactDragListView {...dragProps}>
                <SongTable 
                    songMetadata={songsMetadata} 
                    isPlaylist={true}
                />
            </ReactDragListView>
    )
}

export default Playlist