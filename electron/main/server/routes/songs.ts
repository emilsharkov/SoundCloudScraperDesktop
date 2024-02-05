import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { body, validationResult } from 'express-validator';
import { queryAsync } from '../database'
import { SongRow } from '../../../interfaces/express/ResponseBody'
import { ErrorWithCode } from '../../../interfaces/express/Error'
import { validateBody } from '../server';

const router = express.Router()

const songsRoute = (db: sqlite3.Database) => {
  
  router.get("/", 
    async (req: Request, res: Response, next: NextFunction) => {  
      try {
        const songs = await queryAsync<SongRow>(
          db,
          `SELECT * FROM songs ORDER BY song_order`,
          []
        )
        res.json(songs)
      } catch (err) {
        next(err)
      }
  })

  router.get("/:song_id", 
    async (req: Request, res: Response, next: NextFunction) => {  
      try {
        const song_id = req.params.song_id
        const songs = await queryAsync<SongRow>(
          db,
          `SELECT * FROM songs WHERE song_id = ?`,
          [song_id]
        )
        res.json(songs[0])
      } catch (err) {
        next(err)
      }
  })

  router.post("/",
    [ 
      body('title').notEmpty(), 
      body('artist').notEmpty(), 
      body('duration_seconds').isNumeric(), 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const body = req.body
        const newSong = await queryAsync<SongRow>(
          db,
          "INSERT INTO songs (title,artist,duration_seconds,song_order) VALUES (?,?,?,-1) RETURNING *",
          [body.title,body.artist,body.duration_seconds]
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
    [
      body('title').notEmpty(), 
      body('artist').notEmpty(), 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const song_id = req.params.song_id
        const body = req.body
        const updatedSong = await queryAsync<SongRow>(
          db,
          "UPDATE songs SET title = ?, artist = ? WHERE song_id = ? RETURNING *",
          [body.title, body.artist, song_id]
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
              db.run(`UPDATE songs SET song_order = -1 WHERE song_order = ?;`, [from])
              db.run(`UPDATE songs SET song_order = song_order + 1 WHERE song_order >= ? AND song_order < ?;`, [to, from])
              db.run(`UPDATE songs SET song_order = ? WHERE song_order = -1;`, [to])
          } else if (to > from) {
              // Moving a song downward
              db.run(`UPDATE songs SET song_order = -1 WHERE song_order = ?;`, [from])
              db.run(`UPDATE songs SET song_order = song_order - 1 WHERE song_order > ? AND song_order <= ?;`, [from, to])
              db.run(`UPDATE songs SET song_order = ? WHERE song_order = -1;`, [to])
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
        const deletedSong = await queryAsync<SongRow>(
          db,
          "DELETE FROM songs WHERE song_id = ? RETURNING *",
          [song_id]
        )
    
        if (deletedSong.length) {
          const deletedSongOrder = deletedSong[0].song_order
          const updatedSong = await queryAsync<SongRow>(
            db,
            "UPDATE songs SET song_order = song_order - 1 WHERE song_order > ? RETURNING *",
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

export default songsRoute
