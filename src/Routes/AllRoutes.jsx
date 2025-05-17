import {Routes, Route} from "react-router-dom";
import {HomePage} from "../Pages/HomePage";
import {AuthPage} from "../Pages/AuthPage";
import {EditNotePage} from "../Pages/EditNotePage";
import { NonPrivateRoute } from "./NonPrivateRoute";
import { PrivateRoute } from "./PrivateRoute";

export function AllRoutes() {
    

    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path='/auth' element={<NonPrivateRoute><AuthPage /></NonPrivateRoute>}></Route>
            <Route path="/note/:id" element={<PrivateRoute><EditNotePage /></PrivateRoute>}></Route>
        </Routes>
    )
}
