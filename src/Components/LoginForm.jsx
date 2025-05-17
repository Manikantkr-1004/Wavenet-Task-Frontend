import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "../Api/userApi";
import {UserContext} from "../Context/UserContext"
import {FaSpinner} from "react-icons/fa";

export function LoginForm({setDoLogin}) {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [loading, setLoading] = useState(false);
    const {UserLogin} = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email.trim() || !password.trim()) {
            toast.error("All fields are required.");
            return;
        }

        if(!emailRegex.test(email)){
            toast.error("Please provide valid email");
            return;
        }

        try {
            setLoading(true);
            const res = await loginUser(formData);
            toast.success(res?.data?.message);
            UserLogin(res?.data?.data?.user, res?.data?.data?.token);
            setFormData({ email: "", password: "" });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full fade-in max-w-sm mx-auto mt-5 sm:mt-20 bg-white p-6 rounded sm:shadow-md space-y-4"
        >
            <h2 className="text-xl font-semibold text-center">Login</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                    placeholder="example@mail.com"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                    placeholder="********"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full button-press bg-blue-600 flex justify-center items-center text-white py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? <FaSpinner className="animate-spin" /> : "Login"}
            </button>

            <p className="text-xs text-blue-600 text-center">New User? <span onClick={()=> setDoLogin(false)} className="text-black cursor-pointer">Register here</span></p>
        </form>
    );
}
