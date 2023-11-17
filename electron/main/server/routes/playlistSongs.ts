import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { bodyValidator } from '../server'
import { queryAsync } from '../../database'
import { PlaylistSongsNames } from '../../../interfaces/express/ResponseBody'
import { PostPlaylistSongsBody } from '../../../interfaces/express/RequestBody'

const router = express.Router()

const playlistSongsRoute = (db: sqlite3.Database) => {
  
  router.get("/", async (req: Request, res: Response, next: NextFunction) => {  
    try {
      const playlists = await queryAsync<PlaylistSongsNames>(
        db,
        `SELECT name as playlist_name, title as song_title
        FROM playlists_songs ps
        JOIN playlists p ON ps.playlist_id = p.playlist_id
        JOIN songs s ON ps.song_id = s.song_id`,
        []
      )
  
      if (playlists.length) {
        res.json(playlists)
      } else {
        res.status(404).json({ message: 'Playlist Not Found' })
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
        INSERT INTO playlist_songs (playlist_id, song_id)
        VALUES (
            (SELECT song_id FROM song),
            (SELECT playlist_id FROM playlist)
        )
        RETURNING
        (SELECT title FROM song),
        (SELECT name FROM playlist);`,
        [body.songTitle,body.songTitle]
      )
  
      if (newPlaylist.length) {
        res.json(newPlaylist[0])
      } else {
        res.status(500).json({ message: 'Error creating a new Playlist' })
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
        (SELECT title FROM song),
        (SELECT name FROM playlist);`,
        [songTitle,playlistName]
      )
  
      if (deletedPlaylist.length) {
        res.json(deletedPlaylist[0])
      } else {
        res.status(404).json({ message: 'Playlist Not Found' })
      }
    } catch (err) {
      next(err)
    }
  })
  

  return router
}

export default playlistSongsRoute
