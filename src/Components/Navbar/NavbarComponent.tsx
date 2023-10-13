import React, { useContext } from 'react';
import NavbarButtonComponent from '../Navbar/NavbarButtonComponent'
import Search from '../../Assets/search.svg'
import Downloads from '../../Assets/downloads.svg'
import Playlists from '../../Assets/playlists.svg'
import { RouterCtxt } from '@/Context/RouterContext';
import { RouterContext } from '@/App';
import CurrentSongThumbnail from './CurrentSongThumbnail';

interface NavbarComponentProps {
    className?: string;
}

export interface NavbarItemData {
    title: string;
    icon: string;
}

const navbarItemList: NavbarItemData[] = [
    {title: 'Search', icon: Search},
    {title: 'Downloads', icon: Downloads},
    {title: 'Playlists', icon: Playlists}
]

const NavbarComponent = (props: NavbarComponentProps) => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)

    return (
        <div className={props.className}>
            <div className='flex flex-col justify-between h-screen p-3 bg-white overflow-auto'>
                <div className='space-y-3'>
                    <div className='flex items-center'>
                        <h2 className='text-xl font-bold'>SoundCloudScraper</h2>
                    </div>
                    <div className='flex-1'>
                        <ul className='pt-2 pb-4 space-y-1 text-sm'>
                            {navbarItemList.map((navbarItem: NavbarItemData) => {
                                return (
                                    <NavbarButtonComponent 
                                        title={navbarItem.title} 
                                        icon={navbarItem.icon}
                                        onClick={() => setCurrentRoute(navbarItem.title)}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <CurrentSongThumbnail />
            </div>
        </div>
    )
}
export default NavbarComponent