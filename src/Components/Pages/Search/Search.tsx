import { useState, useEffect, useMemo } from "react"
import { useSearchSong } from "@/Hooks/useSearchSong"
import { useDebounce } from "@/Hooks/useDebounce"
import { Autocomplete, AutocompleteItem } from '@mantine/core';

const Search = () => {
    const [searchBarInput,setSearchBarInput] = useState<string>('')
    const debouncedValue = useDebounce(searchBarInput)
    const {songSuggestions,receivedSuggestions,setSongName} = useSearchSong()

    const autoCompleteData = useMemo(() => {
        const suggestions = songSuggestions.map(song => {
            return {value: song.title, id: song.id} as AutocompleteItem
        })
        return suggestions
        // return suggestions.length ? suggestions: ['No results found. Please try using the exact song name from SoundCloud.']
    },[songSuggestions])

    useEffect(() => {
        console.log(autoCompleteData)
    },[songSuggestions])

    useEffect(() => {
        if(debouncedValue != null) {
            setSongName(debouncedValue)
        }
    },[debouncedValue])

    return(
        <div>
            <Autocomplete
                // value={searchBarInput}
                onChange={setSearchBarInput}
                placeholder="SoundCloud Song Name"
                itemComponent={({ value, id }) => <div>{value}</div>}
                data={autoCompleteData}
                filter={(value): boolean => true}
                limit={10}
            />
            <pre>{JSON.stringify(autoCompleteData,null,4)}</pre>
        </div>
    )
}

export default Search