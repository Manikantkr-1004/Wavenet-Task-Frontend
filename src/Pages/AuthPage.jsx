import { useState } from "react"
import { LoginForm } from "../Components/LoginForm";
import { SignupForm } from "../Components/SignupForm";

export function AuthPage() {
    
    const [doLogin, setDoLogin] =useState(true);

    return (
        <>
            {
                doLogin ? <LoginForm setDoLogin={setDoLogin} /> : <SignupForm setDoLogin={setDoLogin} />
            }
        </>
    )
}
