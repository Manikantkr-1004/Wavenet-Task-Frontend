import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast";
import { getSingleNote } from "../Api/noteApi";
import { UserContext } from "../Context/UserContext";
import { FaArrowLeftLong } from "react-icons/fa6";
import { handleCheckPermission } from "../Utils/PermissionCheck";
import {io} from "socket.io-client";

export function EditNotePage() {

    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const [permission, setPermission] = useState("Read");
    const [formData, setFormData]= useState({newTitle:'',newContent:""})

    const navigate = useNavigate();
    const debounceTimer = useRef(null);
    const socket = io(import.meta.env.VITE_BACKEND_IO)

    const { isLoggedIn, userData } = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) return;

        fetchSingleData();
    }, [id, isLoggedIn])

    useEffect(() => {
        const permit = handleCheckPermission(data?.collaborators, userData?.id);
        setPermission(permit);

        setFormData({
            newTitle: data?.title,
            newContent: data?.content
        })
    }, [data])

    useEffect(() => {
        if(!isLoggedIn || Object.keys(data)===0 || !id) return;

        socket.connect();

        socket.emit('join_event', {noteId: id, userId: userData.id, name: userData.name});

        const handleJoiner = (data)=> {
            toast.success(data?.name+ ' Joined this Note')
        }

        const handleUpdate = (data) => {
            toast.success(data?.data?.name + " Updated this Note");
            setData(data?.note);
            setFormData({
                newTitle: data?.newTitle,
                newContent: data?.newContent
            });
        }

        socket.on('joiner_update', handleJoiner);
        socket.on('receive_update', handleUpdate);

        return () => {
            socket.off('joiner_update');
            socket.off('receive_update');
            socket.disconnect();
        }
    }, [isLoggedIn, id])

    const fetchSingleData = async () => {
        try {
            setLoading(true);
            const response = await getSingleNote(id);
            setData(response?.data?.data);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

     const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            emitUpdateToSocket();
        }, 1000); // 1 sec debounce
    };

    const emitUpdateToSocket = () => {
        socket.emit("send_update", {
            noteId: id,
            userId: userData.id,
            name: userData.name,
            newContent: formData.newContent,
            newtitle: formData.newTitle
        });
        toast.success("You updated the Note...")
    };


    return (
        <section className="w-full sm:w-[400px] mx-auto max-h-screen py-10 px-4 sm:px-10">

            <button onClick={() => navigate(-1)}
                className="bg-slate-100 button-press border cursor-pointer hover:bg-slate-300 border-slate-300 text-slate-800 px-4 py-1 font-medium rounded-md text-sm my-3 flex items-center gap-2"><FaArrowLeftLong /> Go Back</button>

            {loading &&
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full h-20 animate-pulse rounded-md bg-slate-200"></div>
                    <div className="w-full h-52 animate-pulse rounded-md bg-slate-200"></div>
                </div>
            }

            {(userData?.id !== data?.createdBy) && (permission === 'Read') && !loading &&
                <div className="w-full fade-in flex flex-col justify-start items-start gap-3">
                    <h3 className="font-bold text-xl">{data?.title}</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{data?.content}</p>
                </div>}

            {(userData?.id === data?.createdBy || permission === 'Write') && !loading &&
                <div className="w-full fade-in flex flex-col justify-start items-start gap-3">

                    <input value={formData.newTitle} onChange={handleChange} 
                    className="w-full font-bold p-2"
                    type="text" name="newTitle" placeholder="Note Title" />

                    <textarea value={formData.newContent} onChange={handleChange} 
                    className="w-full min-h-48 p-2"
                    name="newContent" placeholder="Note Content" />

                    <p className="text-xs text-center text-blue-600 my-4">You can change the title and content by clicking on it and write new. It'll auto save after 1 sec since your last type.</p>
                    
                </div>}

        </section>
    )
}
