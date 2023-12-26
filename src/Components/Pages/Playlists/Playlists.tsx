import React, { useState } from "react";
import Playlist from "./Playlist";
import PlaylistsTable from "./PlaylistsTable";

const Playlists = () => {
  const [playlistName, setPlaylistName] = useState<string>('');

  return (
    <>
      {playlistName === '' ? (
        <PlaylistsTable setPlaylistName={setPlaylistName} />
      ) : (
        <Playlist
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
        />
      )}
    </>
  );
};

export default Playlists;
