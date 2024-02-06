import { Input } from "../ui/input";

export interface SearchBarProps {
    className?: string;
    placeholder: string;
    searchQuery: string;
    setSearchQuery: (value: React.SetStateAction<string>) => void;
}

const SearchBar = (props: SearchBarProps) => {
    const {className,placeholder,searchQuery,setSearchQuery} = props

    return (
        <Input 
            className={className}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    )
}

export default SearchBar