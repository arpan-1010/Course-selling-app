import { useEffect, useState } from "react"
import { API_URL } from "../config"
import ViewCourseCard from "../components/ViewCourseCard"
import Navbar from "../components/Navbar"

export default function Courses() {

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/course/bulk`)
            const data = await response.json()
            if (response.ok) setCourses(data.courses || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">

            <Navbar />

            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Explore Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Courses
                    </span>
                </h2>
                <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                    Learn DSA, Full Stack, AI and much more with our premium curated courses
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 pt-4 pb-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-blue-950/20 border border-slate-800/40 rounded-2xl overflow-hidden animate-pulse">
                                <div className="w-full h-48 bg-slate-800/60" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-800/60 rounded w-3/4" />
                                    <div className="h-3 bg-slate-800/60 rounded w-full" />
                                    <div className="h-3 bg-slate-800/60 rounded w-2/3" />
                                    <div className="h-8 bg-slate-800/60 rounded-lg mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-slate-400 text-lg">No courses available yet.</p>
                        <p className="text-slate-500 text-sm mt-2">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <ViewCourseCard
                                key={course._id}
                                id={course._id}
                                title={course.title}
                                description={course.description}
                                price={course.price}
                                imageUrl={course.imageUrl}
                            />
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}