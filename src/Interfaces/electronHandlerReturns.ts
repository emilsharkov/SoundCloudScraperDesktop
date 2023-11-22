export interface OpenDialogReturnValue {
    canceled: boolean;
    filePaths: string[];
    bookmarks?: string[];
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

export interface SongTitle {
    title: string;
}

export interface PlaylistName {
    name: string;
}

export interface SongOrder {
    song_title: string;
    song_order: string;
}

export interface PlaylistSongsNames {
    playlist_name: string;
    song_title: string;
    song_order: number;
}