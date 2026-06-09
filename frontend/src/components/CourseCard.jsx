export default function CourseCard({
    id, title, description, price, imageUrl, onDelete, onEdit, onUpload
}) {
    return (
        <div className="border border-white/10 bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="w-full h-48 overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover object-center" />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white">
                    {title}
                </h3>
                <p className="text-slate-400 mt-2">
                    {description}
                </p>
                <p className="text-purple-400 font-bold text-lg mt-4 mb-4">
                    INR {price}
                </p>
                <div className="flex gap-3 mt-auto mt-5">
                    <button onClick={onEdit} 
                        className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-lg py-2 transition">
                        Edit
                    </button>
                    <button onClick={() => onDelete(id)} 
                        className="flex-1 bg-red-600 hover:bg-red-500 rounded-lg py-2 transition">
                        Delete
                    </button>
                </div>
                <button onClick={() => onUpload(id)}
                    className="w-full mt-3 bg-green-600 hover:bg-green-500 rounded-lg py-2 transition text-white font-medium"    
                >
                    Upload Content
                </button>

                <a href={`/admin/course/${id}/lessons`} target="_blank" rel="noopener noreferrer" className="block mt-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg py-2 transition text-purple-300 hover:text-white font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.259a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                        </svg>
                        Manage Lessons
                    </button>
                </a>

                <a href={`/admin/course/${id}`} target="_blank" rel="noopener noreferrer" className="block mt-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-lg py-2 transition text-slate-300 hover:text-white font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Go to Course
                    </button>
                </a>
            </div>

        </div>
    )
}