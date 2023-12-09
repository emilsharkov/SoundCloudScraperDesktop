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
                playlist_id INTEGER NOT NULL,
                song_id INTEGER NOT NULL,
                song_order INTEGER NOT NULL,
                PRIMARY KEY (playlist_id, song_id),
                FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
                FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
            );
        `)
    })

    /*
    is there some sqlite magic that when a song gets deleted from songs the playlist_songs fixes its ordering to be sequential once again. For example in songs ordering 1,2,3,4,5 song 2 gets removed and song 3 becomes song 2 and song 4 becomes song 3 and song 5 becomes song 4 with new ordering of 1,2,3,4
    */

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