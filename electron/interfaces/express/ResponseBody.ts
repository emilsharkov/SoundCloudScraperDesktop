interface SqlRow {}

interface Song extends SqlRow {
    song_id: number;
    title: string;
    artist: string;
    song_order: number;
}

interface Playlist extends SqlRow {
    playlist_id: string;
    name: string;
}

interface PlaylistSong extends SqlRow {
    playlist_id: number;
    song_id: number;
    playlist_order: number;
}

interface PlaylistSongData extends SqlRow {
    playlist_id: number;
    song_id: number;
    title: string;
    artist: string;
    playlist_order: number;
}

interface SQLAction extends SqlRow {}

interface SongOrder extends SqlRow {
    song_title: string;
    song_order: string;
}

export type {
    SqlRow,
    Song,
    Playlist,
    PlaylistSong,
    PlaylistSongData,
    SQLAction,
    SongOrder
}