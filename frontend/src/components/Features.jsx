import { motion } from "framer-motion"

function Features() {
    return (
        <section id="features" className=" px-6 md:px-10 py-24">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Why Students Love Us
                </h2>

                <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
                    Designed for developers who want real skills, real world projects, and real career growth.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-blue-500/50 transition"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                >
                    <div className="text-5xl mb-6">
                        💻
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                        Project Based Learning
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Build real-world full stack applications from scratch
                    </p>
                </motion.div>

                <motion.div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-blue-500/50 transition"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                >
                    <div className="text-5xl mb-6">
                        🧠
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                        Interview Preparation
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Prepare yourself for your next interview
                    </p>
                </motion.div>

                <motion.div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-blue-500/50 transition"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                >
                    <div className="text-5xl mb-6">
                        🚀
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                        Industry Mentorship
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Get ideas from our industry experts
                    </p>
                </motion.div>
            </div>
           
        </section>
    )
}

export default Features