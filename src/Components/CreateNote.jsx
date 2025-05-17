import { useState } from "react";
import toast from "react-hot-toast";
import {FaSpinner} from "react-icons/fa";
import { createNote } from "../Api/noteApi";

export function CreateNote({setNewData}) {

    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, content } = formData;

        if (!title.trim() || !content.trim()) {
            toast.error("All fields are required.");
            return;
        }
        
        try {
            setLoading(true);
            const res = await createNote(formData);
            toast.success(res?.data?.message);
            setNewData(res?.data?.data);
            setFormData({ title: "", content: "" });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full fade-in max-w-sm bg-white p-3 sm:p-6 rounded sm:shadow-md space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                    placeholder="My Note Title Here"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring min-h-20"
                    placeholder="Write Note Contents here..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full button-press bg-blue-600 flex items-center justify-center text-white py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? <FaSpinner className="animate-spin" /> : "Create"}
            </button>

        </form>
    );
}
