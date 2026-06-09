import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { useLocation } from "react-router-dom"

function Navbar() {
    const [hidden, setHidden] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { scrollY } = useScroll()
    const location = useLocation()

    const path = location.pathname
    const isHomePage = path === "/"
    const isCoursesPage = path === "/courses"
    const isDemoPage = path === "/demo"
    const isUserCoursePage = path.startsWith("/user/course/") && !path.endsWith("/learn")
    const isAdminCoursePage = path.startsWith("/admin/course/") && !path.includes("/lessons")
    const isCourseDetailPage = isUserCoursePage || isAdminCoursePage

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious()
        if (latest > previous && latest > 100) setHidden(true)
        else setHidden(false)
    })

    const scrollToSection = (id) => {
        setMobileOpen(false)
        if (path !== "/") window.location.href = `/#${id}`
        else {
            const el = document.getElementById(id)
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: "smooth" })
            }
        }
    }

    return (
        <>
        <motion.nav
            className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-4 bg-slate-950/70 backdrop-blur-xl text-white border-b border-slate-800"
            variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <div className="flex justify-between items-center">
                <a href="/">
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
                        Learn@Ease
                    </h1>
                </a>

                {(isHomePage || isCoursesPage || isDemoPage) ? (
                    <div className="hidden md:flex gap-8 text-slate-300">
                        <a href="/courses" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Courses</a>
                        <a href="#" className="hover:text-white transition" onClick={(e) => { e.preventDefault(); scrollToSection("reviews") }}>Reviews</a>
                    </div>
                ) : null}

                <div className="hidden md:flex items-center gap-3">
                    {isCourseDetailPage ? (
                        <>
                            <a href={isAdminCoursePage ? "/admin/dashboard" : "/user/dashboard"}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                                </svg>
                                Back to Dashboard
                            </a>
                            <a href="/" className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>
                                </svg>
                                Back to Home
                            </a>
                        </>
                    ) : (isDemoPage || isCoursesPage) ? (
                        <a href="/signup" target="_blank" rel="noopener noreferrer">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition font-semibold shadow-lg shadow-blue-500/20">
                                Get Started
                            </motion.button>
                        </a>
                    ) : (
                        <>
                            <a href="/signup" target="_blank" rel="noopener noreferrer">
                                <button className="px-4 py-2 border border-slate-700 rounded-xl hover:bg-slate-800 transition">Sign Up</button>
                            </a>
                            <a href="/signin" target="_blank" rel="noopener noreferrer">
                                <button className="px-4 py-2 border border-slate-700 rounded-xl hover:bg-slate-800 transition">Sign In</button>
                            </a>
                            <a href="/signup" target="_blank" rel="noopener noreferrer">
                                <button className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition">Get Started</button>
                            </a>
                        </>
                    )}
                </div>

                {!isCourseDetailPage && (
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-300 hover:text-white transition">
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                )}

                {isCourseDetailPage && (
                    <div className="flex md:hidden items-center gap-2">
                        <a href={isAdminCoursePage ? "/admin/dashboard" : "/user/dashboard"}
                            className="text-xs px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                            Dashboard
                        </a>
                        <a href="/" className="text-xs px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                            Home
                        </a>
                    </div>
                )}
            </div>

            {mobileOpen && (
                <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-slate-800 pt-4">
                    {(isHomePage || isCoursesPage || isDemoPage) && (
                        <>
                            <a href="/courses" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition py-2">Courses</a>
                            <button onClick={() => scrollToSection("reviews")} className="text-left text-slate-300 hover:text-white transition py-2">Reviews</button>
                        </>
                    )}
                    {(isDemoPage || isCoursesPage) ? (
                        <a href="/signup" target="_blank" rel="noopener noreferrer">
                            <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold">Get Started</button>
                        </a>
                    ) : (
                        <>
                            <a href="/signup" target="_blank" rel="noopener noreferrer">
                                <button className="w-full py-2 border border-slate-700 rounded-xl hover:bg-slate-800 transition">Sign Up</button>
                            </a>
                            <a href="/signin" target="_blank" rel="noopener noreferrer">
                                <button className="w-full py-2 border border-slate-700 rounded-xl hover:bg-slate-800 transition">Sign In</button>
                            </a>
                            <a href="/signup" target="_blank" rel="noopener noreferrer">
                                <button className="w-full py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition">Get Started</button>
                            </a>
                        </>
                    )}
                </div>
            )}
        </motion.nav>
        </>
    )
}

export default Navbar