export default function ProfileCard({ profile, role }) {

    const isAdmin = role === "admin"

    const accentColor = isAdmin ? "from-violet-600 to-purple-600" : "from-blue-600 to-cyan-600"
    const accentText = isAdmin ? "text-violet-400" : "text-blue-400"
    const accentBorder = isAdmin ? "border-violet-500/20" : "border-blue-500/20"
    const accentBadgeBg = isAdmin ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-blue-500/10 border-blue-500/20 text-blue-300"

    const initials = `${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}`.toUpperCase()

    const joinDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
        : "N/A"

    return (
        <div className={`bg-slate-900/80 backdrop-blur-xl border ${accentBorder} rounded-2xl p-6 shadow-lg`}>

            <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${accentColor} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                    {initials}
                </div>
                <div>
                    <h3 className="text-white font-semibold text-lg leading-tight">
                        {profile?.firstName} {profile?.lastName}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${accentBadgeBg} mt-1 inline-block`}>
                        {isAdmin ? "Admin" : "Student"}
                    </span>
                </div>
            </div>

            <div className="border-t border-slate-700/50 mb-4" />

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="text-slate-300 text-sm truncate">{profile?.email}</span>
                </div>

                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-slate-300 text-sm">Joined {joinDate}</span>
                </div>

                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="text-slate-300 text-sm">{profile?.firstName} {profile?.lastName}</span>
                </div>
            </div>

        </div>
    )
}