import { useContext, useState } from "react"
import { UserContext } from "../Context/UserContext";
import { FaNoteSticky } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { CreateNote } from "../Components/CreateNote";
import { MyNotes } from "../Components/MyNotes";
import { SharedNotes } from "../Components/SharedNotes";
import toast from "react-hot-toast";
import { shareNote } from "../Api/noteApi";
import { FaSpinner } from "react-icons/fa";

export function HomePage() {

    const { isLoggedIn, userData } = useContext(UserContext);
    const [newData, setNewData] = useState({});

    const [formData, setFormData] = useState({
        noteId:'',
        userEmail:'',
        permission:''
    });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleInvite = async(e) => {
        e.preventDefault();

        if(!emailRegex.test(formData.userEmail)){
            toast.error("Please provide valid email");
            return;
        }

        try {
            setLoading(true);
            const response = await shareNote(formData);
            toast.success(response?.data?.message+'. Refresh to see latest data.')
            setFormData({noteId:"", email:"", permission:""});
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <section className="w-full min-h-screen py-10 px-4 sm:px-10">

            <h1 className="text-center text-2xl text-blue-600 font-extrabold mb-4">Welcome {isLoggedIn ? `${userData?.name} 😃` : 'to Live Note Platform'}</h1>

            {!isLoggedIn &&
                <div className="flex fade-in flex-col justify-center items-center gap-2 my-10">
                    <p className="text-center text-sm">Please do login to get features of creating notes, live editing & many more...</p>
                    <Link to={'/auth'} className="px-5 button-press py-1 rounded-md text-white bg-blue-600 font-semibold">Login</Link>
                </div>}

            {isLoggedIn &&
                <div className="w-full flex flex-col gap-2">
                    <h2 className="font-bold text-xl flex items-center gap-2"><FaNoteSticky /> My Notes</h2>
                    <MyNotes newData={newData} setInviteForm={setFormData}  />
                </div>}

            {isLoggedIn &&
                <div className="w-full flex flex-col gap-2">
                    <h2 className="font-bold text-xl flex items-center gap-2"><FaNoteSticky /> Shared With Me</h2>
                    <SharedNotes />
                </div>}

            {isLoggedIn &&
                <div className="w-full flex flex-col gap-2">
                    <h2 className="font-bold text-xl flex items-center gap-2"><FaNoteSticky /> Create New Note</h2>
                    <CreateNote setNewData={setNewData} />
                </div>}

            {/* Modal for Inviting Collaborators  */}
            {formData.noteId && 
            <div className="w-screen fade-in h-screen flex justify-center items-center bg-[#00000094] backdrop-blur-xs fixed left-0 top-0 z-[9999]">
                <form onSubmit={handleInvite} className="w-11/12 sm:w-[300px] fade-in max-h-90vh bg-white rounded-lg p-4 flex flex-col gap-2">

                    <div>
                        <label className="block text-sm font-medium mb-1">Collaborator Email *</label>
                        <input
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleChange}
                            className="w-full border px-3 py-1 rounded focus:outline-none focus:ring"
                            placeholder="example@mail.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Permission *</label>
                        <select
                            name="permission"
                            value={formData.permission}
                            onChange={handleChange}
                            className="w-full border px-3 py-1 rounded focus:outline-none focus:ring"
                            required
                        >
                            <option value="">--Select Option--</option>
                            <option value="Read">Can Read Only</option>
                            <option value="Write">Can Read & Write Both</option>
                        </select>
                    </div>

                    <button disabled={loading}
                    className="w-full button-press bg-blue-600 text-white rounded-md text-sm font-medium py-1.5" type="submit">
                        {loading ? <FaSpinner className="animate-spin my-1 m-auto" /> : '+ Invite'}
                    </button>
                    <button disabled={loading} onClick={()=> setFormData({noteId:"",email:"",permission:""})}
                    type="button" className="w-full button-press bg-red-500 text-white rounded-md text-sm font-medium py-1">Cancel</button>

                </form>
            </div>
            }


        </section>
    )
}
