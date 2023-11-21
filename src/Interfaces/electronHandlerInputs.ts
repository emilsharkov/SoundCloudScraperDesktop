export interface Mp3Metadata {
    title: string;
    artist: string | null;
    imgPath: string | null;
}

export interface SongNameArgs {
    songName: string;
}

export interface SongURLArgs {
    songURL: string;
}

export interface PlaylistNameArgs {
    playlistName: string;
}

export interface ChangePlaylistNameArgs {
    oldPlaylistName: string;
    newPlaylistName: string;
}

export interface AddSongToPlaylistArgs {
    playlistName: string;
    songTitle: string;
    songOrder: number;
}

export interface ReorderSongsArgs {
    playlistName: string;
    songOrderings: PutPlaylistSongBodyItem[];
}

export interface PutPlaylistSongBodyItem {
    songTitle: string;
    songOrder: number
}

export interface DeletePlaylistSongArgs {
    playlistName: string;
    songTitle: string;
}