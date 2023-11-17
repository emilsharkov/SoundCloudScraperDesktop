import sqlite3 from 'sqlite3';
import { workingDir } from './utils';
import { SqlRow } from '../interfaces/express/ResponseBody';

const setupDatabase = (): sqlite3.Database => {
    const db = new sqlite3.Database(`${workingDir}/soundCloudScraperDesktop.db`, (err) => {
        if (err) {
            console.error('Failed to open the database', err)
            return
        }

        // Table to store songs
        db.run(`
            CREATE TABLE IF NOT EXISTS songs (
                song_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE
                -- Add other song attributes as needed
            );
        `);

        // Table to store playlists
        db.run(`
            CREATE TABLE IF NOT EXISTS playlists (
                playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
                -- Add other playlist attributes as needed
            );
        `);

        // Table to store the relationship between songs and playlists
        db.run(`
            CREATE TABLE IF NOT EXISTS playlist_songs (
                playlist_id INTEGER,
                song_id INTEGER,
                song_order INTEGER,
                PRIMARY KEY (playlist_id, song_id),
                FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
                FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
            );
        `)
    })

    return db
}

const queryAsync = <T extends SqlRow>(db: sqlite3.Database, sql: string, params: any[]): Promise<T[]> => {
    return new Promise<T[]>((resolve, reject) => {
        db.all(sql, params, (err, rows: T[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

export {setupDatabase,queryAsync};