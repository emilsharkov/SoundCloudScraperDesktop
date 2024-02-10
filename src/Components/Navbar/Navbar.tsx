import NavbarButton from './NavbarButton'
import { LucideIcon, Search } from 'lucide-react';
import { Download } from 'lucide-react';
import { Folders } from 'lucide-react';
import { setCurrentRoute } from '@/Redux/Slices/currentRouteSlice';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';

interface NavbarProps {
    className?: string;
}

export interface NavbarItemData {
    title: string;
    icon: LucideIcon;
}

const navbarItemList: NavbarItemData[] = [
    {title: 'Search', icon: Search},
    {title: 'Downloads', icon: Download},
    {title: 'Playlists', icon: Folders}
]

const Navbar = (props: NavbarProps) => {
    const dispatch = useAppDispatch()

    return (
        <div className={props.className}>
            <div className='flex flex-col justify-between m-3 bg-white overflow-auto'>
                <div className='space-y-4'>
                    <div className='flex items-center'>
                        <h2 className='text-xl font-bold'>SoundCloudScraper</h2>
                    </div>
                    <div className='flex-1'>
                        <ul className='mt-2 space-y-3 text-sm'>
                            {navbarItemList.map((navbarItem: NavbarItemData) => {
                                return (
                                    <NavbarButton 
                                        key={navbarItem.title} 
                                        title={navbarItem.title} 
                                        icon={navbarItem.icon}
                                        onClick={() => dispatch(setCurrentRoute(navbarItem.title))}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Navbar