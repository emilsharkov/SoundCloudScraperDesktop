export interface SqlRow {}

export interface SongTitle extends SqlRow {
    title: string;
}

export interface PlaylistName extends SqlRow {
    name: string;
}

export interface PlaylistSongsNames extends SqlRow {
    name: string;
    title: string;
}