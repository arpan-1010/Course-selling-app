import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function CourseLessons() {

    const { courseId } = useParams()
    const navigate = useNavigate()

    const [lessons, setLessons] = useState([])
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteLessonId, setDeleteLessonId] = useState(null)
    const [toast, setToast] = useState({ show: false, message: "", type: "" })
    const [previewLesson, setPreviewLesson] = useState(null)

    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500)
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

    const fetchLessons = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/admin/course/${courseId}/lessons`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            const data = await response.json()
            setLessons(data.lessons || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourse()
        fetchLessons()
    }, [courseId])

    const confirmDelete = (lessonId) => {
        setDeleteLessonId(lessonId)
        setDeleteModal(true)
    }

    const handleDeleteLesson = async () => {
        if (!deleteLessonId) return
        try {
            const response = await fetch(
                `${API_URL}/api/v1/admin/course/${courseId}/lesson/${deleteLessonId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            if (response.ok) {
                showToast("Lesson deleted successfully.", "success")
                setDeleteModal(false)
                setDeleteLessonId(null)
                if (previewLesson?._id === deleteLessonId) setPreviewLesson(null)
                await fetchLessons()
            } else {
                const data = await response.json()
                showToast(data.message || "Failed to delete.", "error")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getVideoSrc = (lesson) => {
        if (!lesson) return ""
        if (lesson.videoType === "file" && lesson.videoFile) {
            return `${API_URL}/${lesson.videoFile.replace(/\\/g, "/")}`
        }
        return lesson.videoUrl || ""
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">

            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl max-w-sm
                    ${toast.type === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-green-500/10 border-green-500/30 text-green-400"
                    }`}
                >
                    {toast.type === "error" ? (
                        <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    )}
                    <p className="text-sm font-medium flex-1">{toast.message}</p>
                    <button onClick={() => setToast({ show: false, message: "", type: "" })}
                        className="text-slate-400 hover:text-white transition shrink-0">✕</button>
                </div>
            )}

            <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Learn@Ease
                </h1>
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

                <div className="mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-3">
                        Course Lessons
                    </div>
                    <h2 className="text-3xl font-bold">{course?.title || "Loading..."}</h2>
                    <p className="text-slate-400 mt-1">
                        {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} uploaded
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                                <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-slate-800 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-slate-400">No lessons uploaded yet.</p>
                        <p className="text-slate-500 text-sm mt-1">Go to the dashboard and upload content.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lessons.map((lesson, index) => (
                            <div key={lesson._id} className="flex flex-col gap-2">

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{lesson.title}</p>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                {lesson.videoType === "file" ? "📁 Local File" : "🔗 Video URL"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPreviewLesson(
                                                previewLesson?._id === lesson._id ? null : lesson
                                            )}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                            {previewLesson?._id === lesson._id ? "Close" : "Preview"}
                                        </button>

                                        <button
                                            onClick={() => confirmDelete(lesson._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                <path d="M10 11v6M14 11v6"/>
                                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {previewLesson?._id === lesson._id && (
                                    <div className="rounded-xl overflow-hidden bg-black border border-white/10">
                                        <video
                                            key={getVideoSrc(previewLesson)}
                                            src={getVideoSrc(previewLesson)}
                                            controls
                                            autoPlay
                                            className="w-full max-h-[400px]"
                                        />
                                        <div className="px-4 py-3 border-t border-white/10">
                                            <p className="text-white font-medium text-sm">{previewLesson.title}</p>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                {previewLesson.videoType === "file" ? "📁 Local File" : "🔗 Video URL"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-8 w-full max-w-sm mx-6 shadow-2xl backdrop-blur-xl">
                        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-center text-white mb-2">Delete Lesson</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">
                            Are you sure you want to delete this lesson? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setDeleteModal(false); setDeleteLessonId(null) }}
                                className="flex-1 py-3 rounded-xl bg-amber-950/60 border border-amber-900/40 hover:bg-amber-900/60 transition font-medium text-amber-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteLesson}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-medium text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
