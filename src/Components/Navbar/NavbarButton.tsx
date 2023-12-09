import { LucideIcon } from "lucide-react";

    interface NavbarButtonProps {
    title: string;
    icon: LucideIcon;
    onClick: () => void
}

const NavbarButton = (props: NavbarButtonProps) => {
    return (
        <li>
            <button 
                className='flex text-lg font-medium items-center p-2 py-3 space-x-3 rounded-md transform hover:translate-x-2 transition-transform ease-in duration-200'
                onClick={props.onClick} 
            >
                <props.icon />
                <span>{props.title}</span>
            </button>
        </li>
    )
}
export default NavbarButton