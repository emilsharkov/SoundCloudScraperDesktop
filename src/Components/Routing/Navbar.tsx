import { useState, useContext } from 'react';
import { RouterContext } from '@/App';
import { RouterCtxt } from '@/Context/RouterContext';

export interface NavbarProps {
    className?: string;
}

export const Navbar = (props: NavbarProps) => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)

    return (
        <nav className={props.className}>
            <button onClick={() => setCurrentRoute('SearchSongs')}>Search Songs</button>
            <button onClick={() => setCurrentRoute('Downloads')}>Downloads</button>
            <button onClick={() => setCurrentRoute('Playlists')}>Playlists</button>
        </nav>
    )
}

export default Navbar;