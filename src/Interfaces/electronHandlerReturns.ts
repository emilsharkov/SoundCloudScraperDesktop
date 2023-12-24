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

export interface SoundcloudTrackV2 {
    comment_count: number;
    full_duration: number;
    downloadable: boolean;
    created_at: string;
    description: string | null;
    media: {
        transcodings: object[];
    };
    title: string;
    publisher_metadata: {
        urn: string;
        contains_music: boolean;
        id: number;
    };
    duration: number;
    has_downloads_left: boolean;
    artwork_url: string;
    public: boolean;
    streamable: boolean;
    tag_list: string;
    genre: string;
    id: number;
    reposts_count: number;
    state: "processing" | "failed" | "finished";
    label_name: string | null;
    last_modified: string;
    commentable: boolean;
    policy: string;
    visuals: string | null;
    kind: string;
    purchase_url: string | null;
    sharing: "private" | "public";
    uri: string;
    secret_token: string | null;
    download_count: number;
    likes_count: number;
    urn: string;
    license: object;
    purchase_title: string | null;
    display_date: string;
    embeddable_by: "all" | "me" | "none";
    release_date: string;
    user_id: number;
    monetization_model: string;
    waveform_url: string;
    permalink: string;
    permalink_url: string;
    user: {
        avatar_url: string;
        city: string;
        comments_count: number;
        country_code: number | null;
        created_at: string;
        creator_subscriptions: object[];
        creator_subscription: object;
        description: string;
        followers_count: number;
        followings_count: number;
        first_name: string;
        full_name: string;
        groups_count: number;
        id: number;
        kind: string;
        last_modified: string;
        last_name: string;
        likes_count: number;
        playlist_likes_count: number;
        permalink: string;
        permalink_url: string;
        playlist_count: number;
        reposts_count: number | null;
        track_count: number;
        uri: string;
        urn: string;
        username: string;
        verified: boolean;
        visuals: {
            urn: string;
            enabled: boolean;
            visuals: object[];
            tracking: null;
        };
    };
    playback_count: number;
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