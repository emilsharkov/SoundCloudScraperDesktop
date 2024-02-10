import { useAppSelector } from "@/Redux/hooks";
import { LucideIcon } from "lucide-react";

interface NavbarButtonProps {
    title: string;
    icon: LucideIcon;
    onClick: () => void
}

const NavbarButton = (props: NavbarButtonProps) => {
    const currentRoute = useAppSelector(state => state.currentRoute.value)

    return (
        <li>
            <button 
                className={`${currentRoute == props.title ? 'translate-x-4' : ''} hover:translate-x-4 flex text-lg font-semibold items-center p-2 py-3 space-x-3 rounded-md transform transition-transform ease-in duration-200`}
                onClick={props.onClick} 
            >
                <props.icon />
                <span className="text-xl font-semibold">{props.title}</span>
            </button>
        </li>
    )
}
export default NavbarButton