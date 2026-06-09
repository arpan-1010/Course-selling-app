export default function ViewCourseCard({
    id, title, description, price, imageUrl
}) {

    const getCourseUrl = () => {
        const role = localStorage.getItem("role")
        if (role === "admin") return `/admin/course/${id}`
        if (role === "user") return `/user/course/${id}`
        return `/course/${id}`
    }

    return (

        <div className="border border-white/10 bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden">

            <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 object-cover"
            />

            <div className="p-5">
                <h3 className="text-xl font-bold">
                    {title}
                </h3>

                <p className="text-slate-400 mt-2">
                    {description}
                </p>

                <p className="text-green-400 font-bold text-lg mt-4">
                    INR {price}
                </p>

                <a href={getCourseUrl()} rel="noopener noreferrer" className="block w-full">
                    <button className="w-full mt-5 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition">
                        View Course
                    </button>
                </a>
            </div>

        </div>
    );
}