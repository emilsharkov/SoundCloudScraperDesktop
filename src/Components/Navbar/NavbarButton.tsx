import { useMemo } from 'react'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import './Navbar.css'
import { styles } from './Styles'

export interface NavbarButtonProps {
    currentRoute: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void
}

const NavbarButton = (props: NavbarButtonProps) => {
    const selectedTextClass = useMemo(() => {
        return props.currentRoute === props.label ? styles.selectedNavbarItemButton: {}
    },[props.currentRoute,props.label])

    const selectedIconClass = useMemo(() => {
        return props.currentRoute === props.label ? styles.selectedNavbarItemIcon: {}
    },[props.currentRoute,props.label])

    return(
        <>
            <ListItem disablePadding>
                <ListItemButton sx={{...selectedTextClass,...styles.navbarItemButton}} onClick={props.onClick}>
                    <ListItemIcon sx={selectedIconClass}>{props.icon}</ListItemIcon>
                    <ListItemText primary={props.label} />
                </ListItemButton>
            </ListItem>
        </>
    )
}

export default NavbarButton