import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

export function Navbar() {
    
    const {isLoggedIn, userData} = useContext(UserContext);

    return (
        <header className="w-full fixed top-0 z-[999] bg-blue-500 h-16 flex justify-between items-center gap-4 px-4 sm:px-10">
            <Link to={'/'} className="font-bold text-white text-lg flex items-center gap-2"><span className="w-3 h-3 block rounded-full bg-white animate-pulse"></span> Note Live</Link>

            {!isLoggedIn && 
            <nav>
                <Link className="text-sm text-slate-800 hover:text-white" to={'/auth'}>Login/Signup</Link>
            </nav>
            }

            {isLoggedIn && userData?.name &&
                <img src={`https://ui-avatars.com/api/?background=fff&color=000&name=${userData?.name}&font-size=0.4&size=36&bold=true&format=png&rounded=true`} alt={userData?.name} />
            }


        </header>
    )
}
