import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { useParams, useNavigate } from "react-router-dom"

export default function CoursePlayer() {

    const { courseId } = useParams()
    const navigate = useNavigate()

    const [lessons, setLessons] = useState([])
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [course, setCourse] = useState(null)

    const fetchLessons = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/course/${courseId}/lessons`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            if (response.status === 401) {
                localStorage.removeItem("token")
                navigate("/signin")
                return
            }

            const data = await response.json()
            setLessons(data.lessons || [])

            if (data.lessons?.length > 0) {
                setSelectedLesson(data.lessons[0])
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCourse = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/course/${courseId}`)
            const data = await response.json()
            if (response.ok) setCourse(data.course)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchLessons()
        fetchCourse()
    }, [courseId])

    const getVideoSrc = (lesson) => {
        if (!lesson) return ""
        if (lesson.videoType === "file" && lesson.videoFile) {
            const normalizedPath = lesson.videoFile.replace(/\\/g, "/")
            return `${API_URL}/${normalizedPath}`
        }
        return lesson.videoUrl || ""
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">

            <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Learn@Ease
                </h1>
                {course && (
                    <p className="text-slate-400 text-sm">{course.title}</p>
                )}
                <button
                    onClick={() => navigate("/user/dashboard")}
                    className="text-sm text-slate-400 hover:text-white transition"
                >
                    ← Back to Dashboard
                </button>
            </nav>

            {loading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <p className="text-slate-400">Loading lessons...</p>
                </div>
            ) : lessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                    <p className="text-slate-400 text-lg">No lessons available yet.</p>
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-4 h-auto lg:h-[calc(100vh-65px)]">

                    <div className="lg:col-span-3 p-4 md:p-6 overflow-y-auto">
                        <video
                            key={getVideoSrc(selectedLesson)}
                            controls
                            className="w-full rounded-xl bg-black"
                            src={getVideoSrc(selectedLesson)}
                        />
                        {selectedLesson && (
                            <div className="mt-4">
                                <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Lesson {lessons.findIndex(l => l._id === selectedLesson._id) + 1} of {lessons.length}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto max-h-[400px] lg:max-h-none">
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="font-semibold text-sm text-slate-300">
                                Course Content
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">{lessons.length} lessons</p>
                        </div>

                        {lessons.map((lesson, index) => (
                            <div
                                key={lesson._id}
                                onClick={() => setSelectedLesson(lesson)}
                                className={`p-4 border-b border-slate-800 cursor-pointer transition
                                    ${selectedLesson?._id === lesson._id
                                        ? "bg-purple-600/20 border-l-2 border-l-purple-500"
                                        : "hover:bg-slate-800"
                                    }`}
                            >
                                <p className="text-xs text-slate-500 mb-1">Lesson {index + 1}</p>
                                <p className="text-sm font-medium leading-snug">{lesson.title}</p>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}