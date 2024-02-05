import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { body } from 'express-validator';
import { queryAsync } from '../database'
import { PlaylistRow } from '../../../interfaces/express/ResponseBody'
import { ErrorWithCode } from '../../../interfaces/express/Error'
import { validateBody } from '../server';

const router = express.Router()

const playlistsRoute = (db: sqlite3.Database) => {
  
  router.get("/", 
    async (req: Request, res: Response, next: NextFunction) => {  
      try {
        const playlists = await queryAsync<PlaylistRow>(
          db,
          "SELECT * FROM playlists ORDER BY playlist_id",
          []
        )
        res.json(playlists)
      } catch (err) {
        next(err)
      }
  })

  router.post("/", 
    [
      body('name').notEmpty(), 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const body = req.body
        const newPlaylist = await queryAsync<PlaylistRow>(
          db,
          "INSERT INTO playlists (name) VALUES (?) RETURNING *",
          [body.name]
        )
    
        if (newPlaylist.length) {
          res.json(newPlaylist[0])
        } else {
          throw new ErrorWithCode(500,'Error Creating Playlist')
        }
      } catch (err) {
        next(err)
      }
  })
  

  router.put("/:playlist_id", 
    [
      body('name').notEmpty(), 
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateBody(req)
        const playlist_id = req.params.playlist_id
        const body = req.body
        const updatedPlaylist = await queryAsync<PlaylistRow>(
          db,
          "UPDATE playlists SET name = ? WHERE playlist_id = ? RETURNING *",
          [body.name,playlist_id]
        )
    
        if (updatedPlaylist.length) {
          res.json(updatedPlaylist[0])
        } else {
          throw new ErrorWithCode(500,'Error Updating Playlist')
        }
      } catch (err) {
        next(err)
      }
  })
  
  router.delete("/:playlist_id", 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const playlist_id = req.params.playlist_id
        const deletedPlaylist = await queryAsync<PlaylistRow>(
          db,
          "DELETE FROM playlists WHERE playlist_id = ? RETURNING *",
          [playlist_id]
        )
    
        if (deletedPlaylist.length) {
          res.json(deletedPlaylist[0])
        } else {
          throw new ErrorWithCode(500,'Error Deleting Playlist')
        }
      } catch (err) {
        next(err)
      }
  })

  return router
}

export default playlistsRoute
