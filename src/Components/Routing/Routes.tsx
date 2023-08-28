import { useContext, Children } from "react"
import { RouterContext } from "@/App"
import { RouteProps } from "@/Interfaces/RouteProps"
import { RoutesProps } from "@/Interfaces/RoutesProps"
import { RouterCtxt } from "@/Context/RouterContext"

export const Routes = ({children}: RoutesProps) => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)
    const routes = Children.toArray(children) as React.ReactElement<RouteProps>[]
    const toRender = routes.filter((child) => child.props.path === currentRoute) as React.ReactElement<RouteProps>[]

    return <>{toRender.length === 1 ? toRender[0].props.component: null}</>

}