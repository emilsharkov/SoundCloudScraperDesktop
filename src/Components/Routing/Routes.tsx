import { useContext, Children } from "react"
import { RouterContext } from "@/App"
import { RouterCtxt } from "@/Context/RouterContext"
import { RouteProps } from "./Route";

export interface RoutesProps {
    className?: string;
    children?: React.ReactNode;
}

export const Routes = (props: RoutesProps) => {
    const {currentRoute,setCurrentRoute} = useContext<RouterCtxt>(RouterContext)
    const routes = Children.toArray(props.children) as React.ReactElement<RouteProps>[]
    const toRender = routes.filter((child) => child.props.path === currentRoute) as React.ReactElement<RouteProps>[]

    return (
        <div className={props.className}>
            {toRender.length === 1 ? toRender[0].props.component: null}
        </div>
    )
}