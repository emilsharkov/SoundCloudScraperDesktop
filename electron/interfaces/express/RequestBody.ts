interface ReqBody {}

class PostSongBody implements ReqBody {
    public title: string;

    constructor(){
        this.title = '';
    }
}

class PutSongBody implements ReqBody {
    public newTitle: string;
    
    constructor(){
        this.newTitle = '';
    }
}

class PostPlaylistBody implements ReqBody {
    public name: string;

    constructor(){
        this.name = '';
    }
}

class PutPlaylistBody implements ReqBody {
    public newName: string;
    
    constructor(){
        this.newName = '';
    }
}

class PostPlaylistSongsBody implements ReqBody {
    public songTitle: string;
    public playlistName: string;
    public songOrder: string;

    constructor(){
        this.songTitle = '';
        this.playlistName = '';
        this.songOrder = '';
    }
}

interface PutPlaylistSongBodyItem {
    songTitle: string;
    songOrder: number
}

class PutPlaylistSongsBody implements ReqBody {
    public songOrderings: PutPlaylistSongBodyItem[]

    constructor(){
        this.songOrderings = [];
    }
}

export {
    PostSongBody,
    PutSongBody,
    PostPlaylistBody,
    PutPlaylistBody,
    PostPlaylistSongsBody,
    PutPlaylistSongsBody
}

export type { 
    PutPlaylistSongBodyItem 
}
