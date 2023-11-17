  import express, { Request, Response, NextFunction } from 'express'
  import sqlite3 from 'sqlite3'
  import { bodyValidator } from '../server'
  import { queryAsync } from '../../database'
  import { PlaylistSongsNames } from '../../../interfaces/express/ResponseBody'
  import { PostPlaylistSongsBody, PutPlaylistSongsBody, PutPlaylistSongBodyItem } from '../../../interfaces/express/RequestBody'

  const router = express.Router()

  const playlistSongsRoute = (db: sqlite3.Database) => {
    
    router.get("/:playlistName", async (req: Request, res: Response, next: NextFunction) => {  
      const playlistName = req.params.playlistName
      
      try {
        const playlist = await queryAsync<PlaylistSongsNames>(
          db,
          `SELECT name as playlist_name, title as song_title
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
          INSERT INTO playlist_songs (playlist_id, song_id, song_order)
          VALUES (
              (SELECT song_id FROM song),
              (SELECT playlist_id FROM playlist),
              ?
          )
          RETURNING
          (SELECT title FROM song) as song_title,
          (SELECT name FROM playlist) as playlist_name
          song_order;`,
          [body.songTitle,body.playlistName,body.songOrder]
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
          (SELECT title FROM song) as song_title,
          (SELECT name FROM playlist) as playlist_name;`,
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

    router.put("/:playlistName", bodyValidator(new PutPlaylistSongsBody), async (req: Request, res: Response, next: NextFunction) => {
      try {
        const playlistName = req.params.playlistName
        const body: PutPlaylistSongsBody = req.body

        await db.run('BEGIN TRANSACTION');
        await db.run(`
          WITH songsInPlaylist as (
            SELECT song_id, playlist_id, name as playlist_name, title as song_title
            FROM playlist_songs ps
            JOIN playlists p ON ps.playlist_id = p.playlist_id
            JOIN songs s ON ps.song_id = s.song_id
            WHERE p.name = ?
          )
        `,[playlistName])
        
        for (const songData of body.putPlaylistSongBodyItems) {
          const { songTitle, songOrder }: PutPlaylistSongBodyItem = songData

          await db.run(`
            UPDATE playlist_songs
            SET song_order = ?
            WHERE song_id = (SELECT song_id from songsInPlaylist where title = ?)
          `, [songOrder, songTitle])
        }

        await db.run('COMMIT')
      } catch (err) {
        await db.run('ROLLBACK')
        next(err)
      }
    })

    return router
  }

  export default playlistSongsRoute
