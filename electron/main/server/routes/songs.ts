import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { body } from 'express-validator';
import { queryAsync } from '../../database'
import { Song } from '../../../interfaces/express/ResponseBody'
import { PostSongBody,PutSongBody } from '../../../interfaces/express/RequestBody'
import { ErrorWithCode } from '../../../interfaces/express/Error'

const router = express.Router()

const songsRoute = (db: sqlite3.Database) => {
  
  router.get("/", 
    async (req: Request, res: Response, next: NextFunction) => {  
      try {
        const songs = await queryAsync<Song>(
          db,
          `SELECT song_id,title,artist,song_order FROM songs ORDER BY song_order`,
          []
        )
        res.json(songs)
      } catch (err) {
        next(err)
      }
  })

  router.post("/", 
    body('title').notEmpty(), 
    body('artist').notEmpty(), 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const body = req.body
        const newSong = await queryAsync<Song>(
          db,
          "INSERT INTO songs (title,artist,song_order) VALUES (?,?,-1) RETURNING song_id,title,artist,song_order",
          [body.title, body.artist]
        )
    
        if (newSong.length) {
          res.json(newSong[0])
        } else {
          throw new ErrorWithCode(500,'Error Creating a New Song')
        }
      } catch (err) {
        next(err)
      }
  })
  

  router.put("/:song_id", 
    body('title').notEmpty(), 
    body('artist').notEmpty(), 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const song_id = req.params.song_id
        const body = req.body
        const updatedSong = await queryAsync<Song>(
          db,
          "UPDATE songs SET title = ?, artist = ? WHERE song_id = ? RETURNING song_id,title,artist,song_order",
          [body.title, body.artist]
        )
    
        if (updatedSong.length) {
          res.json(updatedSong[0])
        } else {
          throw new ErrorWithCode(500,'Error Updating Song')
        }
      } catch (err) {
        next(err)
      }
  })

  router.put("/", 
    body('from').isNumeric(), 
    body('to').isNumeric(), 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const body = req.body
        const {from,to} = body
        db.serialize(() => {
          db.run(`BEGIN TRANSACTION;`);

          if (to < from) {
              // Moving a song upward
              db.run(`UPDATE songs SET song_order = song_order + 1 WHERE song_order >= ? AND song_order < ?;`, [to, from])
              db.run(`UPDATE songs SET song_order = ? WHERE song_order = ?;`, [to, from])
          } else if (to > from) {
              // Moving a song downward
              db.run(`UPDATE songs SET song_order = song_order - 1 WHERE song_order > ? AND song_order <= ?;`, [from, to])
              db.run(`UPDATE songs SET song_order = ? WHERE song_order = ?;`, [to, from + 1]); // Adjust for shifted orders
          }

          db.run(`COMMIT;`)
        })

        res.json({status: "Success"})
      } catch (err) {
        next(err)
      }
  })
  
  router.delete("/:song_id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const song_id = req.params.song_id
        const deletedSong = await queryAsync<Song>(
          db,
          "DELETE FROM songs WHERE song_id = ? RETURNING song_id,title,artist,song_order",
          [song_id]
        )
    
        if (deletedSong.length) {
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

export default songsRoute
