import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { signInValidation } from "../validation/authValidation"
import { AnimatePresence, motion } from "framer-motion"

function SignIn() {

    const [formData, setFormData] = useState({ email: "", password: "" })
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [toasts, setToasts] = useState([])

    const showToast = (message, type = "error") => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3500)
    }

    const isAdmin = role === "admin"
    const accentButton = isAdmin ? "bg-violet-600 hover:bg-violet-500" : "bg-blue-600 hover:bg-blue-500"
    const accentText = isAdmin ? "text-violet-300" : "text-blue-400"
    const accentBorder = isAdmin ? "border-violet-500/60" : "border-blue-500"
    const accentFocus = isAdmin ? "focus:border-purple-500" : "focus:border-blue-500"
    const pageBackground = isAdmin ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" : "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
    const cardGlow = isAdmin ? "shadow-[0_0_40px_rgba(168,85,247,0.25)]" : "shadow-[0_0_40px_rgba(59,130,246,0.25)]"

    const handleSignin = async (e) => {
        e.preventDefault()

        const result = signInValidation.safeParse(formData)
        if (!result.success) {
            const formatted = result.error.format()
            const errors = [
                formatted.email?._errors[0],
                formatted.password?._errors[0],
            ].filter(Boolean)

            errors.forEach((msg, index) => {
                setTimeout(() => showToast(msg, "error"), index * 800)
            })
            return
        }

        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/v1/${role}/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                showToast(data.message, "error")
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", role)
            navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard")

        } catch (error) {
            console.log(error)
            showToast("Something went wrong. Please try again.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen ${pageBackground} flex items-center justify-center px-4 py-8`}>

        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
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
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="text-slate-400 hover:text-white transition shrink-0"
                            >✕</button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-xl border ${accentBorder} rounded-2xl md:rounded-3xl p-5 md:p-7 ${cardGlow}`}>

                <a href="/" className={`flex items-center gap-1 ${accentText} text-sm mb-4 hover:underline w-fit`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>
                    </svg>
                    Go to Home
                </a>

                <h1 className={`text-3xl font-bold text-center ${accentText}`}>Welcome Back</h1>
                <p className="text-slate-400 text-center mt-3">
                    {isAdmin ? "Manage and publish your courses" : "Start learning from today"}
                </p>

                <div className="flex bg-slate-800 p-1 rounded-xl mt-6 mb-6">
                    <button type="button" onClick={() => setRole("user")}
                        className={`w-1/2 py-2 rounded-lg transition font-medium ${role === "user" ? "bg-blue-600 text-white" : "text-slate-400"}`}>
                        User
                    </button>
                    <button type="button" onClick={() => setRole("admin")}
                        className={`w-1/2 py-2 rounded-lg transition font-medium ${role === "admin" ? "bg-violet-600 shadow-lg shadow-violet-500/20 text-white" : "text-slate-400"}`}>
                        Admin
                    </button>
                </div>

                <form onSubmit={handleSignin} className="mt-6 space-y-4">
                    <div>
                        <input type="email" placeholder="Email-Id" value={formData.email}
                            onChange={(e) => {
                                setFormData({...formData, email: e.target.value})
                            }}
                            className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none ${accentFocus}`}
                        />
                    </div>

                    <div>
                        <input type="password" placeholder="Password" value={formData.password}
                            onChange={(e) => {
                                setFormData({...formData, password: e.target.value})
                            }}
                            className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none ${accentFocus}`}
                        />
                    </div>

                    <button disabled={loading} type="submit"
                        className={`w-fit min-w-[180px] mx-auto flex items-center justify-center gap-2 ${accentButton} transition rounded-xl py-3 font-semibold text-lg disabled:opacity-70`}>
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Signing In...
                            </>
                        ) : "Sign In"}
                    </button>

                </form>

                <p className="text-slate-400 text-center mt-6 text-md">
                    Don't have an account?{" "}
                    <Link to="/signup" className={`${accentText} hover:underline`}>Sign Up</Link>
                </p>

            </div>
        </div>
    )
}

export default SignIn