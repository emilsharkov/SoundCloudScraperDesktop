import { Request, Response, NextFunction } from 'express';
import { workingDir, sendSongImage } from './utils'
import sqlite3 from 'sqlite3'
const cors = require('cors')
const express = require('express');

export const setupServer = (db: sqlite3.Database) => {
    const port = 11738
    const app = express()

    app.use(cors())
    app.use(express.json())

    app.use('/song',express.static(`${workingDir}/songs`));
    app.use('/images/:fileName', (req: Request, res: Response, next: NextFunction) => sendSongImage(req,res,next))
    
    // CRUD operations for songs

    // Get all songs
    app.get('/songs', (req: Request, res: Response) => {
        db.all('SELECT song_name FROM songs', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });
    
    // Create a new song
    app.post('/songs', (req: Request, res: Response) => {
        const { song_name } = req.body;
        db.run('INSERT INTO songs (song_name) VALUES (?)', [song_name], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Song added successfully' });
        });
    });
    
    // Delete a song
    app.delete('/songs/:songName', (req: Request, res: Response) => {
        const songName = req.params.songName;
        db.run('DELETE FROM songs WHERE song_name = ?', [songName], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Song deleted successfully' });
        });
    });
    
    // Update a song
    app.put('/songs/:previousName', (req: Request, res: Response) => {
        const previousName = req.params.previousName;
        const { newSongName } = req.body;
        db.run('UPDATE songs SET song_name = ? WHERE song_name = ?', [previousName, newSongName], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Song updated successfully' });
        });
    });
    
    // CRUD operations for playlists
    
    // Get all playlists
    app.get('/playlists', (req: Request, res: Response) => {
        db.all('SELECT playlist_name FROM playlists', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    app.get('/playlists/:playlistName', (req: Request, res: Response) => {
        const playlist_name = req.params.playlistName;
        db.all('SELECT song_name FROM playlists WHERE playlist_name = ?', [playlist_name], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });
    
    // Create a new playlist
    app.post('/playlists', (req: Request, res: Response) => {
        const { playlist_name, song_name } = req.body;
        db.run('INSERT INTO playlists (playlist_name, song_name) VALUES (?, ?)', [playlist_name, song_name], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Playlist added successfully' });
        });
    });
    
    // Delete a playlist
    app.delete('/playlists/:playlistName/:songName', (req: Request, res: Response) => {
        const { playlistName, songName } = req.params;
        db.run('DELETE FROM playlists WHERE playlist_name = ? and song_name = ?', [playlistName,songName], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Playlist deleted successfully' });
        });
    });

    // Delete a playlist
    app.delete('/playlists/:playlistName', (req: Request, res: Response) => {
        const playlistName = req.params.playlistName;
        db.run('DELETE FROM playlists WHERE playlist_name = ?', [playlistName], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Playlist deleted successfully' });
        });
    });
    
    // Update a playlist
    app.put('/playlists/:previousPlaylistName', (req: Request, res: Response) => {
        const previousPlaylistName = req.params.previousPlaylistName;
        const { playlist_name } = req.body;
        db.run('UPDATE playlists SET playlist_name = ? WHERE playlist_name = ?', [playlist_name, previousPlaylistName], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Playlist updated successfully' });
        });
    });
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
