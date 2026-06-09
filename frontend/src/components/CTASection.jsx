import { motion } from "framer-motion"

function CTASection() {
    return (
        <section id="cta" className="px-6 md:px-10 pb-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 120 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-[40px] border border-slate-800 bg-gradient-to-r from-blue-600 to-purple-600 p-12 md:p-20 text-center shadow-2xl"
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Start Your Coding Journey Today
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Learn modern development skills and build projects that make your resume stand out.
                        </p>
                        <a href="/signup" target="_blank" rel="noopener noreferrer">
                            <button className="mt-10 px-10 py-4 rounded-2xl bg-white text-black text-lg font-semibold hover:scale-105 transition-transform">
                                Join Now
                            </button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CTASection