import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../Api/userApi";


export const UserContext = createContext();

export const UserProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        checkUserAuth();
    }, [])

    const checkUserAuth = async() => {
        try {
            const response = await checkAuth();
            setIsLoggedIn(true);
            setUserData(response?.data?.data);            
        } catch (error) {
            console.error('Got error while checking User auth', error);
        }
    }

    const UserLogin = (data, token) => {
        sessionStorage.setItem("authToken", token);
        setIsLoggedIn(true);
        setUserData(data);
    }

    return <UserContext.Provider value={{isLoggedIn, userData, UserLogin}}>
        {children}
    </UserContext.Provider>
}