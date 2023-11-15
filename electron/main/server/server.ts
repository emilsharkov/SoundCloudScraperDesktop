import express, { Request, Response, NextFunction } from 'express';
import sqlite3 from 'sqlite3';
import songsRoute from './routes/songs';
import playlistsRoute from './routes/playlists';
import playlistSongsRoute from './routes/playlistSongs';
import { setupDatabase } from '../database';

const app = express();
const cors = require('cors')
const PORT = 11738;

const runServer = () => {
  const db = setupDatabase()

  app.use(cors());
  app.use(express.json())
  
  app.use('/songs', songsRoute(db))
  app.use('/playlists', playlistsRoute(db))
  app.use('/playlistSongs', playlistSongsRoute(db))
  
  app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`)
  })
  
  process.on('SIGINT', () => {
    db.close()
    process.exit()
  })
}

const bodyValidator = (requiredType: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body instanceof requiredType) {
      next();
    } else {
      res.status(404).json({ error: 'Invalid request body type' });
    }
  }
}

export {runServer,bodyValidator}
