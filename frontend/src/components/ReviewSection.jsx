import { useEffect, useRef, useState } from "react"
import { API_URL } from "../config"

const staticReviews = [
    {
        name: "Aarav Sharma",
        role: "Web Developer",
        avatar: "AS",
        rating: 5,
        review: "The courses here completely transformed my career. The content is well structured and easy to follow even for beginners.",
        course: "Full Stack Web Development"
    },
    {
        name: "Priya Mehta",
        role: "UI/UX Designer",
        avatar: "PM",
        rating: 5,
        review: "I loved how practical every lesson was. Within weeks I had a portfolio project I was actually proud to show employers.",
        course: "React & Tailwind Mastery"
    },
    {
        name: "Rohan Verma",
        role: "Backend Engineer",
        avatar: "RV",
        rating: 4,
        review: "Solid content and great explanations. The instructor breaks down complex topics in a way that actually sticks.",
        course: "Node.js & Express Bootcamp"
    },
    {
        name: "Sneha Iyer",
        role: "Freelance Developer",
        avatar: "SI",
        rating: 5,
        review: "Worth every rupee. I landed my first freelance client two weeks after finishing the JavaScript course.",
        course: "JavaScript from Zero to Hero"
    },
    {
        name: "Karan Patel",
        role: "CS Student",
        avatar: "KP",
        rating: 5,
        review: "As a student this platform gave me real world skills my college never taught. Highly recommend to anyone starting out.",
        course: "Data Structures & Algorithms"
    },
    {
        name: "Meera Nair",
        role: "Product Manager",
        avatar: "MN",
        rating: 4,
        review: "Even as a non-technical person I could follow along easily. The explanations are clear and the pacing is perfect.",
        course: "Tech for Non-Tech Professionals"
    },
]

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star}
                    className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

function ReviewCard({ review }) {
    return (
        <div className="flex-shrink-0 w-80 bg-slate-900/20 backdrop-blur-xl border border-purple-500/10 rounded-2xl p-6 mx-3 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.avatar}
                </div>
                <div>
                    <p className="text-white font-semibold text-sm">{review.name}</p>
                    <p className="text-slate-400 text-xs">{review.role}</p>
                </div>
            </div>

            <StarRating rating={review.rating} />

            <p className="text-slate-300 text-sm leading-relaxed mt-3 mb-4">
                "{review.review}"
            </p>

            <div className="border-t border-slate-700/50 pt-3">
                <p className="text-violet-400 text-xs font-medium truncate">
                    📚 {review.course}
                </p>
            </div>
        </div>
    )
}

function ReviewsSection() {
    const trackRef = useRef(null)
    const [isPaused, setIsPaused] = useState(false)
    const animationRef = useRef(null)
    const positionRef = useRef(0)
    const [allReviews, setAllReviews] = useState(staticReviews)

    const fetchAllReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/review/all`)
            const data = await response.json()

            if (response.ok && data.reviews?.length > 0) {
                const realReviews = data.reviews.map((r) => ({
                    name: `${r.userId?.firstName || "User"} ${r.userId?.lastName || ""}`.trim(),
                    role: "Verified Student",
                    avatar: `${r.userId?.firstName?.[0] || "U"}${r.userId?.lastName?.[0] || ""}`.toUpperCase(),
                    rating: r.rating,
                    review: r.comment,
                    course: r.courseId?.title || "Learn@Ease Course",
                    isReal: true
                }))

                setAllReviews([...realReviews, ...staticReviews])
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllReviews()
    }, [])

    const duplicated = [...allReviews, ...allReviews]

    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        const cardWidth = 332
        const totalWidth = cardWidth * allReviews.length

        positionRef.current = 0

        const animate = () => {
            if (!isPaused) {
                positionRef.current += 0.5
                if (positionRef.current >= totalWidth) {
                    positionRef.current = 0
                }
                track.style.transform = `translateX(-${positionRef.current}px)`
            }
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationRef.current)
    }, [isPaused, allReviews])

    return (
        <section id="reviews" className="py-20 overflow-hidden">
            <div className="text-center mb-12 px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    What Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                        Students Say
                    </span>
                </h2>
                <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                    Thousands of learners have transformed their skills with our courses
                </p>
            </div>

            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-slate-950 via-purple-950/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-950 via-purple-950/50 to-transparent z-10 pointer-events-none" />

                <div
                    ref={trackRef}
                    className="flex will-change-transform"
                    style={{ width: "max-content" }}
                >
                    {duplicated.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ReviewsSection