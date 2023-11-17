import express, { Request, Response, NextFunction } from 'express'
import sqlite3 from 'sqlite3'
import { bodyValidator } from '../server'
import { queryAsync } from '../../database'
import { PlaylistName } from '../../../interfaces/express/ResponseBody'
import { PostPlaylistBody,PutPlaylistBody } from '../../../interfaces/express/RequestBody'

const router = express.Router()

const playlistsRoute = (db: sqlite3.Database) => {
  
  router.get("/", async (req: Request, res: Response, next: NextFunction) => {  
    try {
      const playlists = await queryAsync<PlaylistName>(
        db,
        "SELECT name FROM playlists",
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

  router.post("/", bodyValidator(new PostPlaylistBody), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: PostPlaylistBody = req.body
      const newPlaylist = await queryAsync<PlaylistName>(
        db,
        "INSERT INTO playlists (name) VALUES (?) returning name",
        [body.name]
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
  

  router.put("/:name", bodyValidator(new PutPlaylistBody), async (req: Request, res: Response, next: NextFunction) => {
    const oldname = req.params.name
  
    try {
      const body: PutPlaylistBody = req.body
      const updatedPlaylist = await queryAsync<PlaylistName>(
        db,
        "UPDATE playlists SET name = ? WHERE name = ? returning name",
        [body.newName, oldname]
      )
  
      if (updatedPlaylist.length) {
        res.json(updatedPlaylist[0])
      } else {
        res.status(404).json({ message: 'Playlist Not Found' })
      }
    } catch (err) {
      next(err)
    }
  })
  
  router.delete("/:name", async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name
  
    try {
      const deletedPlaylist = await queryAsync<PlaylistName>(
        db,
        "DELETE FROM playlists WHERE name = ? returning name",
        [name]
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

export default playlistsRoute
