import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteNote, fetchMyNotes } from "../Api/noteApi";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export function MyNotes({newData, setInviteForm}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    const [deleteId, setDeleteId] = useState('');
    
    useEffect(() => {
        fetchNotesData();
    }, [page])

    useEffect(() => {
        if(Object.keys(newData).length>0){
            setData((prev)=> ([newData, ...prev]));
        }
    }, [newData])

    const fetchNotesData = async () => {
        try {
            setLoading(true);
            const response = await fetchMyNotes({ owner: 'owner', page, limit });
            setData(response?.data?.data?.data);
            setTotalPages(response?.data?.data?.totalPages);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteNote = async (id) => {
        try {
            setDeleteId(id);
            const response = await deleteNote(id);
            toast.success(response?.data?.message)
            fetchNotesData();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }finally{
            setDeleteId('');
        }
    }

    return (
        <div className="w-full py-3">

            {loading &&
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-3">
                    {
                        [1, 2, 3, 4].map((ele) => (
                            <div key={ele} className="h-[200px] animate-pulse bg-slate-200 rounded-md"></div>
                        ))
                    }
                </div>
            }

            {!loading && data.length === 0 &&
                <p className="font-medium text-blue-600 text-sm pb-5">You don't have created any notes.</p>
            }

            {!loading && data.length > 0 &&
                <div className="w-full fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-3">
                    {
                        data?.map((ele) => (
                            <div key={ele?._id} className="w-full rounded-lg place-self-start bg-slate-200 border border-slate-400 shadow-md p-2 flex flex-col justify-start items-start">
                                <h3 className="font-bold line-clamp-1">{ele?.title}</h3>
                                <p className="text-sm line-clamp-2">{ele?.content}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Total Collaborators:</span> {ele?.collaborators?.length}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Created At:</span> {new Date(ele?.createdAt).toLocaleString('en')}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Last Updated</span> {new Date(ele?.updatedAt).toLocaleString('en')}</p>
                                <div className="w-full flex justify-between items-center gap-2 text-white font-medium mt-2">
                                    <button onClick={()=> setInviteForm((prev)=> ({...prev, noteId: ele?._id}))}
                                    className="w-1/2 button-press py-1 text-sm rounded-md bg-blue-600">Invite Collaborator</button>
                                    <button disabled={deleteId} onClick={()=> handleDeleteNote(ele?._id)} 
                                    className="w-1/2 button-press py-1 text-sm rounded-md bg-red-500">
                                        {deleteId===ele?._id ? <FaSpinner className="animate-spin my-0.5 mx-auto" />: 'Delete'}
                                    </button>
                                </div>
                                <Link to={`/note/${ele?._id}`} className="w-full flex justify-center items-center bg-slate-700 text-white text-sm py-1 font-medium rounded-md mt-2">
                                    View / Update
                                </Link>
                            </div>
                        ))
                    }
                </div>
            }

            {!loading && data.length > 0 &&
            <div className="w-full fade-in flex flex-wrap justify-center items-center gap-2 my-5">
                {
                    new Array(totalPages).fill(0).map((_, ind)=> (
                        <button onClick={()=> setPage(ind+1)} key={ind} 
                        className={`text-xs button-press ${page===ind+1 ? 'bg-blue-500 cursor-not-allowed text-white':'bg-blue-300 cursor-pointer text-slate-600'} font-medium px-3 py-1.5 rounded-lg border-2 border-blue-500`}>
                            {ind+1}
                        </button>
                    ))
                }
            </div>
            }

        </div>
    )
}
