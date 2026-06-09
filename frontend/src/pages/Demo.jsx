import { useEffect, useState } from "react"
import { API_URL } from "../config"
import Navbar from "../components/Navbar"

const DEMO_LESSON_ID = import.meta.env.VITE_DEMO_LESSON_ID
const DEMO_COURSE_ID = import.meta.env.VITE_DEMO_COURSE_ID

export default function Demo() {

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchDemoLesson = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/course/${DEMO_COURSE_ID}/demo-lesson`
            )
            const data = await response.json()

            if (response.ok && data.lesson) {
                const courseRes = await fetch(`${API_URL}/api/v1/user/course/${DEMO_COURSE_ID}`)
                const courseData = await courseRes.json()
                setLesson({ ...data.lesson, courseTitle: courseData.course?.title || "Learn@Ease" })
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getVideoSrc = (lesson) => {
        if (!lesson) return ""
        if (lesson.videoType === "file" && lesson.videoFile) {
            const normalized = lesson.videoFile.replace(/\\/g, "/")
            return `${API_URL}/${normalized}`
        }
        return lesson.videoUrl || ""
    }

    useEffect(() => {
        fetchDemoLesson()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">

            <Navbar />

            <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Get a taste on what You'll{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                            Learn
                        </span>
                    </h1>
                </div>

                {loading ? (
                    <div className="w-full h-[420px] bg-white/5 border border-white/10 rounded-3xl animate-pulse flex items-center justify-center">
                        <p className="text-slate-500">Loading demo...</p>
                    </div>
                ) : !lesson ? (
                    <div className="w-full h-[420px] bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
                        <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 9v9A2.25 2.25 0 004.5 18.75z"/>
                        </svg>
                        <p className="text-slate-400">No demo available yet.</p>
                        <p className="text-slate-500 text-sm">Check back once courses are uploaded.</p>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/30">
                        <video
                            src={getVideoSrc(lesson)}
                            controls
                            autoPlay
                            className="w-full max-h-[480px] bg-black"
                        />
                        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">
                                    From — {lesson.courseTitle}
                                </p>
                                <h3 className="text-xl font-bold">{lesson.title}</h3>
                                <p className="text-slate-400 text-sm mt-1">
                                    This is a free preview lesson. Enroll to access all content.
                                </p>
                            </div>
                            <a href="/courses" target="_blank" rel="noopener noreferrer">
                                <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl font-semibold transition shadow-lg">
                                    Browse Courses →
                                </button>
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}