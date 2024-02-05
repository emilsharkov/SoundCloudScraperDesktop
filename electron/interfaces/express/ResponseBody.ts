interface SqlRow {}

interface SongRow extends SqlRow {
    song_id: number;
    title: string;
    artist: string;
    song_order: number;
    duration_seconds: number;
}

interface PlaylistRow extends SqlRow {
    playlist_id: number;
    name: string;
}

interface PlaylistSongRow extends SqlRow {
    playlist_id: number;
    song_id: number;
    playlist_order: number;
}

interface PlaylistSongDataRow extends SqlRow {
    playlist_id: number;
    song_id: number;
    title: string;
    artist: string;
    playlist_order: number;
    duration_seconds: number;
}

interface SQLAction extends SqlRow {
    status: string;
}

export type {
    SqlRow,
    SongRow,
    PlaylistRow,
    PlaylistSongRow,
    PlaylistSongDataRow,
    SQLAction,
}