import { Children } from "react"
import { useAppSelector, useAppDispatch } from '@/Redux/hooks'
import { RouteProps } from "./Route"

export interface RoutesProps {
    className?: string;
    children?: React.ReactNode;
}

export const Routes = (props: RoutesProps) => {
    const currentRoute = useAppSelector((state) => state.currentRoute.value)
    const routes = Children.toArray(props.children) as React.ReactElement<RouteProps>[]
    const toRender = routes.filter((child) => child.props.path === currentRoute) as React.ReactElement<RouteProps>[]

    return (
        <div className={props.className}>
            {toRender.length === 1 ? toRender[0].props.component: null}
        </div>
    )
}