import express, { Request, Response, NextFunction } from 'express'
import songsRoute from './routes/songs'
import playlistsRoute from './routes/playlists'
import playlistSongsRoute from './routes/playlistSongs'
import { setupDatabase } from '../database'
import { ErrorWithCode } from '../../interfaces/express/Error'
import { workingDir } from '../utils'

const app = express()
const cors = require('cors')
const PORT = 11738

const runServer = () => {
  const db = setupDatabase()

  // middleware
  app.use(cors())
  app.use(express.json())
  
  // routes to sqlite db
  app.use('/songs', songsRoute(db))
  app.use('/playlists', playlistsRoute(db))
  app.use('/playlistSongs', playlistSongsRoute(db))

  // routes to song .mp3 and album art .png
  app.use('/songFiles', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache'); // Add cache control header
    express.static(`${workingDir}/songs`)(req, res, next);
  });

  // Serve song images
  app.use('/songImages', (req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache'); // Add cache control header
      express.static(`${workingDir}/images`)(req, res, next);
  });

  // needs to be last middleware
  app.use(errorHandler)

  app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`)
  })
  
  process.on('SIGINT', () => {
    db.close()
    process.exit()
  })
}

const bodyValidator = <T extends object>(type: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const haveSameKeys = (obj1: object, obj2: object): boolean => {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
    
      if (keys1.length !== keys2.length) {
        return false;
      }
      return keys1.every(key => keys2.includes(key));
    }
    
    if (haveSameKeys(type,req.body)) {
      next()
    } else {
      throw new Error('Invalid request body type')
    }
  }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithCode) {
    res.status(err.code).send({ error: err.message });
  } else {
    res.status(500).send({ error: (err as Error).message });
  }
}

export {runServer,bodyValidator}
