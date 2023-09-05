import React, { useState, useContext } from 'react';
import { RouterContext } from '@/App';
import { RouterCtxt } from '@/Context/RouterContext';
import { List, Divider } from '@mui/material';
import { FileDownload,Search,LibraryMusicOutlined } from '@mui/icons-material'
import NavbarButton from './NavbarButton';
import Logo from './Logo';
import { styles } from './Styles';
import './Navbar.css'

export interface NavbarProps {
    className?: string;
}

interface NavbarItemData {
    label: string;
    icon: React.ReactNode;
}

const navbarItemList: NavbarItemData[] = [
    {label: 'Search', icon: <Search/>},
    {label: 'Downloads', icon: <FileDownload/>},
    {label: 'Playlists', icon: <LibraryMusicOutlined/>}
]

export const Navbar = (props: NavbarProps) => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)

    return (
        <div className={props.className}>
            <Logo/>
            <Divider/>
            <List sx={styles.navbarList}>
                {navbarItemList.map((navbarItem) => (
                    <NavbarButton 
                        key={navbarItem.label}
                        currentRoute={currentRoute}
                        label={navbarItem.label}
                        icon={navbarItem.icon}
                        onClick={() => setCurrentRoute(navbarItem.label)}
                    />
                ))}
            </List>
        </div>
    )
}

export default Navbar;