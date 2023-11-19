  import express, { Request, Response, NextFunction } from 'express'
  import sqlite3 from 'sqlite3'
  import { bodyValidator } from '../server'
  import { queryAsync } from '../../database'
  import { PlaylistSongsNames, SQLAction, SongOrder } from '../../../interfaces/express/ResponseBody'
  import { PostPlaylistSongsBody, PutPlaylistSongsBody, PutPlaylistSongBodyItem } from '../../../interfaces/express/RequestBody'
  import { ErrorWithCode } from '../../../interfaces/express/Error'

  const router = express.Router()

  const playlistSongsRoute = (db: sqlite3.Database) => {
    
    router.get("/:playlistName", async (req: Request, res: Response, next: NextFunction) => {  
      const playlistName = req.params.playlistName
      
      try {
        const playlist = await queryAsync<PlaylistSongsNames>(
          db,
          `SELECT song_order, title as song_title
          FROM playlist_songs ps
          JOIN playlists p ON ps.playlist_id = p.playlist_id
          JOIN songs s ON ps.song_id = s.song_id
          WHERE p.name = ?
          ORDER BY song_order`,
          [playlistName]
        )

        if (playlist.length) {
          res.json(playlist)
        } else {
          throw new ErrorWithCode(404,'Playlist Songs Not Found')
        }
      } catch (err) {
        next(err)
      }
    })

    router.post("/", bodyValidator(new PostPlaylistSongsBody), async (req: Request, res: Response, next: NextFunction) => {
      try {
        const body: PostPlaylistSongsBody = req.body
        const newPlaylist = await queryAsync<PlaylistSongsNames>(
          db,
          `WITH song AS (
            SELECT * FROM songs WHERE title = ?
          ),
          playlist AS (
            SELECT * FROM playlists WHERE name = ?
          )
          INSERT INTO playlist_songs (playlist_id, song_id, song_order)
          VALUES (
              (SELECT playlist_id FROM playlist),
              (SELECT song_id FROM song),
              ?
          )
          RETURNING
          (SELECT name FROM playlist) as playlist_name,
          (SELECT title FROM song) as song_title,
          song_order;`,
          [body.songTitle,body.playlistName,body.songOrder]
        )
    
        if (newPlaylist.length) {
          res.json(newPlaylist[0])
        } else {
          throw new ErrorWithCode(500,'Error Adding Songs')
        }
      } catch (err) {
        next(err)
      }
    })
    
    router.delete("/:playlistName/:songTitle", async (req: Request, res: Response, next: NextFunction) => {
      const playlistName = req.params.playlistName
      const songTitle = req.params.songTitle
    
      try {
        const deletedPlaylist = await queryAsync<PlaylistSongsNames>(
          db,
          `WITH song AS (
            SELECT * FROM songs WHERE title = ?
          ),
          playlist AS (
            SELECT * FROM playlists WHERE name = ?
          )
          DELETE FROM playlist_songs 
          WHERE playlist_id = (SELECT song_id FROM song)
          AND song_id = (SELECT playlist_id FROM playlist)
          RETURNING
          (SELECT title FROM song) as song_title,
          (SELECT name FROM playlist) as playlist_name;`,
          [songTitle,playlistName]
        )
    
        if (deletedPlaylist.length) {
          res.json(deletedPlaylist[0])
        } else {
          throw new ErrorWithCode(500,'Error Deleting Song')
        }
      } catch (err) {
        next(err)
      }
    })

    router.put("/:playlistName", bodyValidator(new PutPlaylistSongsBody), async (req: Request, res: Response, next: NextFunction) => {
      try {
        const playlistName = req.params.playlistName
        const body: PutPlaylistSongsBody = req.body

        const beginTransaction = await queryAsync<SQLAction>(db,`BEGIN TRANSACTION`,[])
        const createTempTable = await queryAsync<SQLAction>(
          db,
          `CREATE TEMPORARY TABLE IF NOT EXISTS songsInPlaylist AS
            SELECT ps.song_id, ps.playlist_id, p.name, s.title
            FROM playlist_songs ps
            JOIN playlists p ON ps.playlist_id = p.playlist_id
            JOIN songs s ON ps.song_id = s.song_id
            WHERE p.name = ?`,
          [playlistName]
        )
        
        let updatedSongs: SongOrder[] = []
        for (const songData of body.songOrderings) {
          const { songTitle, songOrder }: PutPlaylistSongBodyItem = songData
          const updatedSong = await queryAsync<SongOrder>(
            db,
            `UPDATE playlist_songs
            SET song_order = ?
            WHERE song_id = (SELECT song_id from songsInPlaylist where title = ?)
            RETURNING song_order, ? as song_title`, 
            [songOrder, songTitle, songTitle]
          )
          updatedSongs.push(...updatedSong)
        }

        const commit = await queryAsync<SQLAction>(db,`COMMIT`,[])
        res.json(updatedSongs)
      } catch (err) {
        const rollback = await queryAsync<SQLAction>(db,`ROLLBACK`,[])
        next(err)
      }
    })

    return router
  }

  export default playlistSongsRoute
