import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ViewCourseCard from "../components/ViewCourseCard"
import { API_URL } from "../config";
import ProfileCard from "../components/ProfileCard";

export default function UserDashboard() {
    const [courses, setCourses] = useState([])
    
    const navigate = useNavigate()
    
    const [profile, setProfile] = useState(null)
    
    const [showProfile, setShowProfile] = useState(false)

    const [purchases, setPurchases] = useState([])
    
    const [loading, setLoading] = useState(true)

    const [logoutLoading, setLogoutLoading] = useState(false)

    const [deleteAccountModal, setDeleteAccountModal] = useState(false)

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/me`, {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                }
            })
            const data = await response.json()

            if(response.ok) setProfile(data.user)
            
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCourses = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/v1/user/course/bulk`,
            )

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/signin");
                return;
            }

            const data = await response.json()
            setCourses(data.courses || [])
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPurchases = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/purchases`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })

            if (response.status === 401) {
                localStorage.removeItem("token")
                navigate("/signin")
                return
            }

            const data = await response.json()
            setPurchases(data.purchases || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            await Promise.all([fetchCourses(), fetchPurchases(), fetchProfile()])
            setLoading(false)
        }
        loadAll()
    }, [])

    const purchasedCourseIds = purchases.map((p) => p.courseId?.toString())
    const purchasedCourses = courses.filter((c) =>
        purchasedCourseIds.includes(c._id?.toString())
    )

    const handleLogout = async () => {
        try {
            setLogoutLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000))
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            navigate("/")

        } catch (error) {
            console.log(error);
        } finally {
            setLogoutLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/user/delete-account`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })

            if (response.ok) {
                localStorage.removeItem("token")
                localStorage.removeItem("role")
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const skeletonCards = [...Array(3)].map((_, i) => (
        <div key={i} className="bg-blue-950/20 border border-slate-800/40 rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-slate-800/60" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-800/60 rounded w-3/4" />
                <div className="h-3 bg-slate-800/60 rounded w-full" />
                <div className="h-8 bg-slate-800/60 rounded-lg mt-4" />
            </div>
        </div>
    ))

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
            
            <nav className="border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Learn@Ease
                        </h1>

                        <div className="flex items-center gap-4">
                            <a href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>
                                </svg>
                                Go to Home
                            </a>
                            <div className="hidden sm:block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                                User Dashboard
                            </div>
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition"
                                >
                                    {profile
                                        ? `${profile.firstName?.[0]}${profile.lastName?.[0]}`.toUpperCase()
                                        : "U"
                                    }
                                </button>

                                {showProfile && profile && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                                        <div className="absolute right-0 mt-2 w-72 z-50">
                                            <ProfileCard profile={profile} role="user" />
                                            <button
                                                onClick={() => { setShowProfile(false); setDeleteAccountModal(true) }}
                                                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                    <path d="M10 11v6M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                </svg>
                                                Delete Account
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button onClick={handleLogout} disabled={logoutLoading}
                                className="px-4 py-2 border border-slate-700 rounded-2xl hover:bg-red-500 transition disabled:opacity-60 flex items-center gap-2">
                                {logoutLoading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Logging out...
                                    </>
                                ) : "Logout"}
                            </button>

                        </div>
                    </div>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">My Courses 🎓</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                        {purchasedCourses.length} enrolled
                    </span>
                </div>
                <p className="text-slate-400 mb-6">Courses you have purchased</p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skeletonCards}
                    </div>
                ) : purchasedCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-slate-800/50 rounded-2xl bg-blue-950/10">
                        <p className="text-slate-400">You haven't purchased any courses yet.</p>
                        <p className="text-slate-500 text-sm mt-1">Browse all courses below and start learning!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchasedCourses.map((course) => (
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
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="border-t border-slate-800/60" />
            </div>

            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">Explore More 🚀</h2>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                        {courses.length} available
                    </span>
                </div>
                <p className="text-slate-400 mb-6">Learn DSA, Full Stack, AI and much more</p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skeletonCards}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-slate-800/50 rounded-2xl bg-blue-950/10">
                        <p className="text-slate-400">No courses available yet.</p>
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

            {deleteAccountModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/5 border border-red-500/30 rounded-2xl p-8 w-full max-w-sm mx-6 shadow-2xl backdrop-blur-xl">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-center text-white mb-2">Delete Account</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">
                            Are you sure you want to delete your account?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteAccountModal(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
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