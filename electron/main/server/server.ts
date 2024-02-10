import express, { Request, Response, NextFunction } from 'express'
import songsRoute from './routes/songs'
import playlistsRoute from './routes/playlists'
import playlistSongsRoute from './routes/playlistSongs'
import { setupDatabase } from './database'
import { BodyError, ErrorWithCode } from '../../interfaces/express/Error'
import { workingDir } from '../utils'
import { validationResult } from 'express-validator'

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

  // serve mp3 files
  app.use('/songFiles', (req, res, next) => {
    express.static(`${workingDir}/songs`)(req, res, next)
  })

  // serve album art
  app.use('/songImages', (req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache')
      express.static(`${workingDir}/images`)(req, res, next)
  })

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

const validateBody = (req: Request) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new BodyError(errors.array())
  }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithCode) {
    // Handle custom errors with specific status codes
    res.status(err.code).send({ error: err.message })
  } else if (err instanceof BodyError) {
    // Type guard to check for a specific structure indicating validation errors
    res.status(400).send({ message: err.message, error: err.errors })
  } else if (err instanceof Error) {
    // Generic error handler for other types of errors
    res.status(500).send({ error: err.message })
  } else {
    // Fallback for when error is not an instance of Error
    res.status(500).send({ error: 'An unknown error occurred.' })
  }
}

export {runServer,validateBody}
