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

    constructor(){
        this.songTitle = '';
        this.playlistName = '';
    }
}

export {
    PostSongBody,
    PutSongBody,
    PostPlaylistBody,
    PutPlaylistBody,
    PostPlaylistSongsBody
}