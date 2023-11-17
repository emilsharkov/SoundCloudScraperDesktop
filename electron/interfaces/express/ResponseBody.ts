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

export type {
    SqlRow,
    SongTitle,
    PlaylistName,
    PlaylistSongsNames
}