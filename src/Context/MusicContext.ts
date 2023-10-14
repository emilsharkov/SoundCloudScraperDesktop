export type MusicCtxt = {
    songs: string[];
    setSongs: (routes: string[]) => void;
    currentSong: string;
    setCurrentSong: (currentSong: string) => void;
}