import sqlite3 from 'sqlite3'
import { workingDir } from './utils'

export const setupDatabase = (): sqlite3.Database => {
    const db = new sqlite3.Database(`${workingDir}/soundCloudScraperDesktop.db`, (err) => {
      if (err) {
        console.error('Failed to open the database', err)
        return;
      }

      db.run(`
        CREATE TABLE IF NOT EXISTS songs (
          song_id INTEGER PRIMARY KEY,
          song_name TEXT UNIQUE
        )
      `)

      db.run(`
        CREATE TABLE IF NOT EXISTS playlists (
          playlist_id INTEGER PRIMARY KEY,
          playlist_name TEXT UNIQUE,
          song_id INTEGER,
          FOREIGN KEY (song_id) REFERENCES songs (song_id) ON DELETE CASCADE
        )
      `)
    })
    return db
}

export default setupDatabase