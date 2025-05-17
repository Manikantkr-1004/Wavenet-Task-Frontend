import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchMyNotes } from "../Api/noteApi";
import { Link } from "react-router-dom";
import { handleCheckPermission } from "../Utils/PermissionCheck";
import {UserContext} from "../Context/UserContext"

export function SharedNotes() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    const {userData} = useContext(UserContext);
    
    useEffect(() => {
        fetchNotesData();
    }, [page])

    const fetchNotesData = async () => {
        try {
            setLoading(true);
            const response = await fetchMyNotes({ owner: 'shared', page, limit });
            setData(response?.data?.data?.data);
            setTotalPages(response?.data?.data?.totalPages);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
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
                <p className="font-medium text-blue-600 text-sm pb-5">Nobody has shared notes with you as of now.</p>
            }

            {!loading && data.length > 0 &&
                <div className="w-full fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-3">
                    {
                        data?.map((ele) => (
                            <div key={ele?._id} className="w-full rounded-lg place-self-start bg-slate-200 border border-slate-400 shadow-md p-2 flex flex-col justify-start items-start">
                                <h3 className="font-bold line-clamp-1">{ele?.title}</h3>
                                <p className="text-sm line-clamp-2">{ele?.content}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Permission:</span> {`${handleCheckPermission(ele?.collaborators, userData?.id)==='Read'?'Read Only':'Read & Write Both'}`}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Created At:</span> {new Date(ele?.createdAt).toLocaleString('en')}</p>
                                <p className="text-sm"><span className="font-medium text-blue-600">Last Updated</span> {new Date(ele?.updatedAt).toLocaleString('en')}</p>
                                <Link to={`/note/${ele?._id}`} className="w-full flex justify-center items-center bg-blue-600 text-white text-sm py-1 font-medium rounded-md mt-2">
                                    {handleCheckPermission(ele?.collaborators, userData?.id)==='Read'?'View Note':'View / Update Note'}
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
