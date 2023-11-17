import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { bodyValidator } from '../server'
import { queryAsync } from '../../database'
import { SongTitle } from '../../../interfaces/express/ResponseBody'
import { PostSongBody,PutSongBody } from '../../../interfaces/express/RequestBody'

const router = express.Router()

const songsRoute = (db: sqlite3.Database) => {
  
  router.get("/", async (req: Request, res: Response, next: NextFunction) => {  
    try {
      const songs = await queryAsync<SongTitle>(
        db,
        "SELECT title FROM songs",
        []
      )
  
      if (songs.length) {
        res.json(songs)
      } else {
        res.status(404).json({ message: 'Song Not Found' })
      }
    } catch (err) {
      next(err)
    }
  })

  router.post("/", bodyValidator(new PostSongBody), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: PostSongBody = req.body
      const newSong = await queryAsync<SongTitle>(
        db,
        "INSERT INTO songs (title) VALUES (?) returning title",
        [body.title]
      )
  
      if (newSong.length) {
        res.json(newSong[0])
      } else {
        res.status(500).json({ message: 'Error creating a new song' })
      }
    } catch (err) {
      next(err)
    }
  })
  

  router.put("/:title", bodyValidator(new PutSongBody), async (req: Request, res: Response, next: NextFunction) => {
    const oldTitle = req.params.title
  
    try {
      const body: PutSongBody = req.body
      const updatedSong = await queryAsync<SongTitle>(
        db,
        "UPDATE songs SET title = ? WHERE title = ? returning title",
        [body.newTitle, oldTitle]
      )
  
      if (updatedSong.length) {
        res.json(updatedSong[0])
      } else {
        res.status(404).json({ message: 'Song Not Found' })
      }
    } catch (err) {
      next(err)
    }
  })
  
  router.delete("/:title", async (req: Request, res: Response, next: NextFunction) => {
    const title = req.params.title
  
    try {
      const deletedSong = await queryAsync<SongTitle>(
        db,
        "DELETE FROM songs WHERE title = ? returning title",
        [title]
      )
  
      if (deletedSong.length) {
        res.json(deletedSong[0])
      } else {
        res.status(404).json({ message: 'Song Not Found' })
      }
    } catch (err) {
      next(err)
    }
  })
  

  return router
}

export default songsRoute
