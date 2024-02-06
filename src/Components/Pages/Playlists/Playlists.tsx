import React, { useState } from "react";
import Playlist from "./Playlist";
import PlaylistsTable from "./PlaylistsTable";

const Playlists = () => {
  const [playlistID, setPlaylistID] = useState<number>(-1);

  return (
    <>
      {playlistID === -1 ? (
        <PlaylistsTable setPlaylistID={setPlaylistID} />
      ) : (
        <Playlist
          playlistID={playlistID}
          setPlaylistID={setPlaylistID}
        />
      )}
    </>
  );
};

export default Playlists;
