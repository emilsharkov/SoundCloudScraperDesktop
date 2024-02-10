export interface SongNameArgs {
    name: string;
}

export interface SongIDsArgs {
    song_ids: number[];
}

export interface EditMetadataArgs {
    song_id: number;
    title: string;
    artist: string;
    newImagePath: string;
}

export interface SwitchSongOrderArgs {
    to: number;
    from: number;
}

export interface DeleteSongFromAppArgs {
    song_id: number
}

export interface CreatePlaylistArgs {
    name: string;
}

export interface EditPlaylistArgs {
    playlist_id: number;
    name: string;
}

export interface DeletePlaylistArgs {
    playlist_id: number
}

export interface GetSongsInPlaylistArgs {
    playlist_id: number
}

export interface SongURLArgs {
    songURL: string;
}

export interface SwitchPlaylistOrderArgs {
    playlist_id: number;
    to: number;
    from: number;
}

export interface AddSongToPlaylistArgs {
    playlist_id: number;
    song_id: number;
}

export interface DeleteSongInPlaylistArgs {
    playlist_id: number;
    song_id: number;
}

export interface ExportSongsArgs {
    destination: string;
    song_id: number;
}

export interface ChangeSongImageArgs {
    song_id: number;
    newImagePath: string;
}

export interface Song {
	artist: string;
	duration: number;
	id: string;
	likes: number;
	thumbnail: string;
	title: string;
	url: string;
}