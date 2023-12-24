import { ToastAction } from "@/Components/ui/toast"
import { useToast } from "@/Components/ui/use-toast"
import { useAppSelector } from "@/Redux/hooks"
import { useEffect } from "react"

const useToastError = () => {
    const { toast } = useToast()
    const error = useAppSelector((state) => state.toastError.value)

    useEffect(() => {
        if(error !== '') {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error,
                action: <ToastAction altText="Try again">Ignore</ToastAction>,
            })
        }
    },[error])
}

export default useToastError