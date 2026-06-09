import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../config"
import { FaStar } from "react-icons/fa"
import Navbar from "../components/Navbar"

export default function CourseDetails() {

    const [toast, setToast] = useState({ show: false, message: "", type: "" })
    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000)
    }

    const navigate = useNavigate()
    const { courseId } = useParams()

    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [purchased, setPurchased] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [reviews, setReviews] = useState([])
    const [hover, setHover] = useState(0)
    const [reviewLoading, setReviewLoading] = useState(false)
    const [reviewError, setReviewError] = useState("")
    const [deleteReviewModal, setDeleteReviewModal] = useState(false)
    const [deleteReviewId, setDeleteReviewId] = useState(null)
    
    const [lessonCount, setLessonCount] = useState(0)

    const [currentPage, setCurrentPage] = useState(1)
    const reviewsPerPage = 3

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    const fetchCourse = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/course/${courseId}`)
            const data = await response.json()
            setCourse(data.course)
        } catch (error) { 
            console.log(error) 
        }
    }

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/review/${courseId}`)
            const data = await response.json()
            setReviews(data.reviews || [])
        } catch (error) { 
            console.log(error) 
        }
    }

    const checkPurchase = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return
            const response = await fetch(
                `${API_URL}/api/v1/course/check-purchase/${courseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const data = await response.json()
            if (response.ok) setPurchased(data.purchased)
        } catch (error) { 
            console.log(error) 
        }
    }

    const fetchLessonCount = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/course/${courseId}/lesson-count`
            )
            const data = await response.json()
            if (response.ok) setLessonCount(data.count || 0)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCourse()
        fetchReviews()
        checkPurchase()
        fetchLessonCount()
    }, [courseId])

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        )
    }

    const handleEnroll = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                showToast("Please sign in to purchase this course.", "error")
                return
            }

            const response = await fetch(`${API_URL}/api/v1/course/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ courseId })
            })

            const data = await response.json()

            if (response.ok) {
                setPurchased(true)
                window.open(`/user/course/${courseId}/learn`, "_blank")
            } else if (response.status === 409) {
                setPurchased(true)
                window.open(`/user/course/${courseId}/learn`, "_blank")
            } else {
                showToast(data.message || "Something went wrong.", "error")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    

    const handleReview = async () => {
        if (rating === 0) {
            showToast("Please select a rating.", "error")
            return
        }
        if (!comment.trim()) {
            showToast("Please write a comment.", "error")
            return
        }

        try {
            setReviewLoading(true)
            setReviewError("")

            const response = await fetch(`${API_URL}/api/v1/review/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    courseId, rating, comment 
                })
            })

            const data = await response.json()

            if (response.ok) {
                showToast("Review submitted successfully!", "success")
                setComment("")
                setRating(0)
                await fetchReviews()
            } else {
                showToast(data.message || "Failed to submit review.", "error")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setReviewLoading(false)
        }
    }

    const isAdmin = localStorage.getItem("role") === "admin"

    const confirmDeleteReview = (reviewId) => {
        setDeleteReviewId(reviewId)
        setDeleteReviewModal(true)
    }

    const handleDeleteReview = async () => {
        if (!deleteReviewId) return
        try {
            const response = await fetch(`${API_URL}/api/v1/review/${deleteReviewId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.ok) {
                showToast("Review deleted.", "success")
                setDeleteReviewModal(false)
                setDeleteReviewId(null)
                await fetchReviews()
            } else {
                const data = await response.json()
                showToast(data.message || "Failed to delete.", "error")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden pb-10">

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
                    <p className="text-sm font-medium">{toast.message}</p>
                    <button onClick={() => setToast({ show: false, message: "", type: "" })}
                        className="ml-2 text-slate-400 hover:text-white transition shrink-0">✕</button>
                </div>
            )}
            
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    <div>
                        <img src={course.imageUrl} alt={course.title}
                            className="w-full h-[250px] md:h-[380px] object-cover rounded-2xl shadow-2xl"
                        />
                    </div>

                    <div className="flex flex-col justify-center">

                        <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
                        <p className="text-slate-400 mt-4 text-base leading-relaxed">{course.description}</p>

                        {averageRating && (
                            <div className="flex items-center gap-2 mt-4">
                                <FaStar className="text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{averageRating}</span>
                                <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
                            </div>
                        )}

                        <p className="text-green-400 text-3xl font-bold mt-6">INR {course.price}</p>

                        <div className="mt-8 flex flex-col gap-4">

                            {isAdmin ? (
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-fit">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{lessonCount}</p>
                                        <p className="text-slate-400 text-sm">{lessonCount === 1 ? "Lesson" : "Lessons"} available</p>
                                    </div>
                                </div>
                            ) : (
                                purchased ? (
                                    <button
                                        onClick={() => window.open(`/user/course/${courseId}/learn`, "_blank")}
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] w-fit"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </span>
                                        Start Learning
                                        <svg className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={handleEnroll} disabled={loading}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl transition font-semibold text-lg shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] disabled:opacity-60 w-fit"
                                    >
                                        {loading ? "Purchasing..." : "Buy Course"}
                                    </button>
                                )
                            )}

                        </div>

                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {purchased && (
                            <div className="bg-transparent border border-purple-500/20 rounded-2xl p-6">
                                <h2 className="text-4xl font-bold mb-6">Write a Review</h2>

                                {reviewError && (
                                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                        {reviewError}
                                    </div>
                                )}

                                <div className="mb-5">
                                    <label className="block text-slate-400 mb-3 text-2xl font-medium">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar key={star} size={32}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className={`cursor-pointer transition drop-shadow-sm ${
                                                    star <= (hover || rating) ? "text-yellow-400 scale-110" : "text-slate-500/60 hover:text-yellow-400/50"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <p className="text-slate-400 text-lg mt-2">{rating}/5</p>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-slate-400 mb-2 text-2xl font-medium">Your Review</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => {
                                            setReviewError("")
                                            setComment(e.target.value)
                                        }}
                                        placeholder="Please share your experience..."
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 min-h-[180px] focus:outline-none focus:border-purple-500/50 text-slg resize-none placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={handleReview} disabled={reviewLoading}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition font-semibold disabled:opacity-60"
                                    >
                                        {reviewLoading ? "Submitting..." : "Submit"}
                                    </button>
                                    <button
                                        onClick={() => { setRating(0); setComment(""); setReviewError("") }}
                                        disabled={reviewLoading}
                                        className="flex-1 py-3 rounded-xl border border-purple-500/40 text-slate-300 hover:bg-white/5 transition font-semibold disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={purchased ? "" : "lg:col-span-2"}>
                            <h2 className="text-2xl text-center font-bold mb-6">
                                Reviews{" "}
                                {reviews.length > 0 && (
                                    <span className="text-slate-400 text-lg font-normal">({reviews.length})</span>
                                )}
                            </h2>

                            {reviews.length === 0 ? (
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
                                    <p className="text-slate-400">No reviews yet.</p>
                                    <p className="text-slate-500 text-sm mt-1">Be the first to review this course!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {review.userId?.firstName?.[0]}{review.userId?.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {review.userId?.firstName} {review.userId?.lastName}
                                                        </p>
                                                        <div className="flex gap-0.5 mt-0.5">
                                                            {[1,2,3,4,5].map(star => (
                                                                <FaStar key={star} size={12}
                                                                    className={star <= review.rating ? "text-yellow-400" : "text-slate-600"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {isAdmin && (
                                                    <button
                                                        onClick={() => confirmDeleteReview(review._id)}
                                                        className="text-slate-500 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-500/10"
                                                        title="Delete review"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <polyline points="3 6 5 6 21 6"/>
                                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                            <path d="M10 11v6M14 11v6"/>
                                                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
            </div>

            {deleteReviewModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-8 w-full max-w-sm mx-6 shadow-2xl shadow-amber-900/20 backdrop-blur-xl">

                        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-center text-white mb-2">
                            Delete Review
                        </h3>
                        <p className="text-slate-400 text-center text-sm mb-8">
                            Are you sure you want to delete this review? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setDeleteReviewModal(false)
                                    setDeleteReviewId(null)
                                }}
                                className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition font-medium text-amber-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteReview}
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