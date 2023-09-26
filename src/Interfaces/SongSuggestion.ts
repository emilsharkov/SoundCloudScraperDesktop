export interface SongSuggestion {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    duration: number;
    playCount: string;
    commentsCount: string;
    likes: string;
    genre: string | null;
    author: {
        name: string;
        username: string;
        url: string;
        avatarURL: string;
        urn: number;
        verified: boolean;
        followers: number;
        following: number;
    };
    publishedAt: string;
    embedURL: string;
    embed: string | null;
    streams: {
        hls: string;
        progressive: string;
    };
    trackURL: string;
    comments: string[];
    streamURL: string | null;
}