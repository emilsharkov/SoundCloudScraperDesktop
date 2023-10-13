interface NavbarButtonProps {
    title: string;
    icon: string;
    onClick: () => void
}

const NavbarButtonComponent = (props: NavbarButtonProps) => {
    return (
        <li>
            <button 
                className='flex text-lg font-medium items-center p-2 py-3 space-x-3 rounded-md transform hover:translate-x-2 transition-transform ease-in duration-200'
                onClick={props.onClick} 
            >
                <img className='w-5' src={props.icon}/>
                <span>{props.title}</span>
            </button>
        </li>
    )
}
export default NavbarButtonComponent