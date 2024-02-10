import { Button } from "@/Components/ui/button"
import { setIsShuffled } from "@/Redux/Slices/isShuffledSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { Shuffle as ShuffleIcon } from 'lucide-react';
import { useEffect, useState } from "react"

export interface ShuffleProps {
    disabled: boolean;
}

const Shuffle = (props: ShuffleProps) => {
    const {disabled} = props
    const isShuffled = useAppSelector((state) => state.isShuffled.value)
    const dispatch = useAppDispatch()
    
    return (
        <Button
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            onClick={() => dispatch(setIsShuffled(!isShuffled))}
        >
            <ShuffleIcon color={isShuffled ? '#1ed760': 'black'} strokeWidth={1.5}/>
        </Button>
    )
}
export default Shuffle