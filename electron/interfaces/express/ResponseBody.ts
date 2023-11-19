interface SqlRow {}

interface SongTitle extends SqlRow {
    title: string;
}

interface PlaylistName extends SqlRow {
    name: string;
}

interface PlaylistSongsNames extends SqlRow {
    playlist_name: string;
    song_title: string;
}

interface SQLAction extends SqlRow {}

interface SongOrder extends SqlRow {
    song_title: string;
    song_order: string;
}

interface ErrorResponse {
    
}

export type {
    SqlRow,
    SongTitle,
    PlaylistName,
    PlaylistSongsNames,
    SQLAction,
    SongOrder
}