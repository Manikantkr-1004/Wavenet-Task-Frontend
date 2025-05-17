import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import {Navigate} from "react-router-dom"

export function NonPrivateRoute({children}) {
    
    const {isLoggedIn} = useContext(UserContext);

    if(isLoggedIn) return <Navigate to={'/'} />

    return children;
}
