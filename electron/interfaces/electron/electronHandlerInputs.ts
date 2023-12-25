import { PutPlaylistSongBodyItem } from "../express/RequestBody";

export interface Mp3Metadata {
    title: string;
    artist: string;
    imgPath: string;
    duration: number;
}

export interface EditMetadataArgs {
    originalTitle: string;
    metadata: Mp3Metadata;
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

export interface DeletePlaylistSongArgs {
    playlistName: string;
    songTitle: string;
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