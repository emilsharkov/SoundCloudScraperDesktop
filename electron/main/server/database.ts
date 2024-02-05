import sqlite3 from 'sqlite3';
import { workingDir } from '../utils';
import { SqlRow } from '../../interfaces/express/ResponseBody';

const setupDatabase = (): sqlite3.Database => {
    const db = new sqlite3.Database(`${workingDir}/soundCloudScraperDesktop.db`, (err) => {
        if (err) {
            console.error('Failed to open the database', err)
            return
        }

        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS songs (
                    song_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    artist TEXT NOT NULL,
                    song_order INTEGER NOT NULL,
                    duration_seconds INTEGER NOT NULL
                );
            `).run(`
                CREATE TABLE IF NOT EXISTS playlists (
                    playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                );
            `).run(`
                CREATE TABLE IF NOT EXISTS playlist_songs (
                    playlist_id INTEGER NOT NULL,
                    song_id INTEGER NOT NULL,
                    playlist_order INTEGER NOT NULL,
                    PRIMARY KEY (playlist_id, song_id),
                    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
                    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
                );
            `).run(`
                CREATE TRIGGER IF NOT EXISTS trg_after_insert_song
                AFTER INSERT ON songs
                BEGIN
                    UPDATE songs
                    SET song_order = (SELECT IFNULL(MAX(song_order), 0) + 1 FROM songs)
                    WHERE song_id = NEW.song_id;
                END;
            `).run(`
                CREATE TRIGGER IF NOT EXISTS trg_after_insert_playlist_song
                AFTER INSERT ON playlist_songs
                BEGIN
                    UPDATE playlist_songs
                    SET playlist_order = (SELECT IFNULL(MAX(playlist_order), 0) + 1 FROM playlist_songs WHERE playlist_id = NEW.playlist_id)
                    WHERE playlist_id = NEW.playlist_id AND song_id = NEW.song_id;
                END;
            `)
        })
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