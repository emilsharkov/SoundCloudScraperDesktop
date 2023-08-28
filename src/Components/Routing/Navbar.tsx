import { useState, useContext } from 'react';
import { RouterContext } from '@/App';
import { RouterCtxt } from '@/context/RouterContext';
const { ipcRenderer } = window.require('electron');

export const Navbar = () => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)

    return (
        <nav>
            <button onClick={() => setCurrentRoute('SearchSongs')}>Search Songs</button>
            <button onClick={() => setCurrentRoute('Downloads')}>Downloads</button>
            <button onClick={() => setCurrentRoute('Playlists')}>Playlists</button>
        </nav>
    )
}

export default Navbar;