import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { queryAsync } from '../../database'
import { PlaylistSong, PlaylistSongData, SQLAction, SongOrder } from '../../../interfaces/express/ResponseBody'
import { ErrorWithCode } from '../../../interfaces/express/Error'
import { body } from 'express-validator'
import { validateBody } from '../server'

const router = express.Router()

const playlistSongsRoute = (db: sqlite3.Database) => {
  
  router.get("/:playlist_id", 
    async (req: Request, res: Response, next: NextFunction) => {  
      try {
        const playlist_id = req.params.playlist_id
        const playlist = await queryAsync<PlaylistSongData>(
          db,
          `SELECT ps.playlist_id,s.song_id,s.title,s.artist,ps.playlist_order
          FROM playlist_songs ps
          JOIN songs s ON ps.song_id = s.song_id
          WHERE ps.playlist_id = ?
          ORDER BY playlist_order`,
          [playlist_id]
        )
        res.json(playlist)
      } catch (err) {
        next(err)
      }
  })

  router.post("/", 
    [
      body('playlist_id').isNumeric(), 
      body('song_id').isNumeric(), 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const body = req.body
        const newPlaylist = await queryAsync<PlaylistSong>(
          db,
          `INSERT INTO playlist_songs (playlist_id,song_id,playlist_order) VALUES (?,?,-1) 
          RETURNING playlist_id,song_id;`,
          [body.playlist_id,body.song_id]
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
  
  router.put("/", 
    [
      body('from').isNumeric(), 
      body('to').isNumeric(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const body = req.body
        const {from,to} = body

        db.serialize(() => {
          db.run(`BEGIN TRANSACTION;`);

          if (to < from) {
              // Moving a song upward
              db.run(`UPDATE playlist_songs SET playlist_order = -1 WHERE playlist_order = ?;`, [from])
              db.run(`UPDATE playlist_songs SET playlist_order = playlist_order + 1 WHERE playlist_order >= ? AND playlist_order < ?;`, [to, from])
              db.run(`UPDATE playlist_songs SET playlist_order = ? WHERE playlist_order = -1;`, [to])
          } else if (to > from) {
              // Moving a song downward
              db.run(`UPDATE playlist_songs SET playlist_order = -1 WHERE playlist_order = ?;`, [from])
              db.run(`UPDATE playlist_songs SET playlist_order = playlist_order - 1 WHERE playlist_order > ? AND playlist_order <= ?;`, [from, to])
              db.run(`UPDATE playlist_songs SET playlist_order = ? WHERE playlist_order = -1;`, [to])
          }

          db.run(`COMMIT;`)
        })

        res.json({status: "Success"})
      } catch (err) {
        next(err)
      }
  })

  router.delete("/:playlist_id/:song_id", 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const playlist_id = req.params.playlist_id
        const song_id = req.params.song_id
        const deletedSong = await queryAsync<PlaylistSong>(
          db,
          `DELETE FROM playlist_songs 
          WHERE playlist_id = ? AND song_id = ? 
          RETURNING playlist_id,song_id,playlist_order;`,
          [playlist_id,song_id]
        )
    
        if (deletedSong.length) {
          const deletedSongOrder = deletedSong[0].playlist_order
          const updatedSong = await queryAsync<PlaylistSong>(
            db,
            "UPDATE playlist_songs SET playlist_order = playlist_order - 1 WHERE playlist_order > ?",
            [deletedSongOrder]
          )
          res.json(deletedSong[0])
        } else {
          throw new ErrorWithCode(500,'Error Deleting Song')
        }
      } catch (err) {
        next(err)
      }
    })

  return router
}

export default playlistSongsRoute
