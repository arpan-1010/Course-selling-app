import {FaGithub, FaLinkedin, FaTwitter, FaInstagram} from "react-icons/fa";

function Footer() {
    return (
        <footer className="border-t border-slate-800 px-6 md:px-10 py-12">
            
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12">

                    <div>
                        <h2 className="text-2xl font-bold tracking-white text-white">
                            Learn@Ease
                        </h2>
                        <p className="mt-4 text-slate-300 leading-relaxed">
                            Learn modern development with industry-level courses and real world projects.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg text-white font-semibold">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">
                            <a href="/" className="text-slate-300 hover:text-blue-400 transition">Home</a>
                            <a href="/courses" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 transition">Courses</a>
                            <a href="#reviews" className="text-slate-300 hover:text-blue-400 transition">Reviews</a>
                        </div>

                    </div>

                    <div>
                        <h3 className="text-lg text-white font-semibold">
                            Connect
                        </h3>

                        <div className="flex items-center gap-5 text-2xl mt-4">

                            <a href="https://github.com/arpan-1010" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-blue-500/20 hover:border-blue-400/40 hover:scale-110 transition">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/arpan-mondal03/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-blue-500/20 hover:border-blue-400/40 hover:scale-110 transition">
                                <FaLinkedin />
                            </a>
                            <a href="https://x.com/Arpan_Mondal03" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-blue-500/20 hover:border-blue-400/40 hover:scale-110 transition">
                                <FaTwitter />
                            </a>

                        </div>

                    </div>

                </div>
                <div className="mt-12 pt-6 border-t border-slate-800">
                    <p className="text-center text-slate-400 text-sm">
                        © 2026 Learn@Ease. All rights reserved.
                    </p>
                </div>
            </div>

        </footer>
    )
}

export default Footer