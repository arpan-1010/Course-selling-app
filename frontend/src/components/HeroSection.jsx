import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

import course1 from "../assets/fst.png"
import course2 from "../assets/dsa.png"
import course3 from "../assets/backend.png"
import course4 from "../assets/frontend.png"

function HeroSection() {

    const courses = [
        {
            title : "Full Stack Bootcamp",
            tech : "React • Node.js • MongoDB",
            badge : "Bestseller",
            image : course1
        },
        {
            title : "DSA Mastery",
            tech : "Graphs • DP • Trees",
            badge : "Popular",
            image : course2
        },
        {
            title : "Backend Engineering",
            tech : "JWT • Express • APIs",
            badge : "Advanced",
            image : course3
        },
        {
            title : "Frontend Pro",
            tech : "React • Tailwind • Motion",
            badge : "Trending",
            image : course4
        }
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
            (prev + 1) % courses.length
            )
        }, 3000)

        return () => clearInterval(interval)

    }, [])

    return (
        <section id="features" className="relative px-6 md:px-10 py-16 lg:py-24 overflow-hidden max-w-7xl mx-auto">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-3xl rounded-full"></div>

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                    <div className="flex flex-col justify-center h-full text-center lg:text-left">
                        <h1 className="text-3xl md:text-5xl lg:text-7xl text-white font-bold leading-tight">
                            Master
                            <span className="text-blue-500"> DSA </span>
                            <br />
                            & Full Stack
                            <br /> 
                            Development
                        </h1>
                        <p className="mt-8 text-lg text-slate-300 leading-relaxed">
                            Learn industry-level development with premium curated courses,
                            real-world projects, and hands-on coding experience.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                            <a href="/courses" target="_blank" rel="noopener noreferrer">
                                <button className="px-8 py-4 rounded-2xl text-slate-300 bg-blue-600 hover:bg-blue-500 transition text-lg font-semibold shadow-2xl shadow-blue-500/30">
                                    Explore Courses
                                </button>
                            </a>
                            <a href="/demo" target="_blank" rel="noopener noreferrer">
                                <button className="px-8 py-4 rounded-2xl text-slate-300 border border-slate-600 hover:border-slate-400 hover:bg-slate-800 transition text-lg font-semibold">
                                    Watch Demo
                                </button>
                            </a>
                        </div>
                        
                        <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg border-t border-white/10 pt-8 mx-auto lg:mx-0">

                            <div className="hover:translate-y-[-2px] transition">
                                <h2 className="text-3xl font-bold text-slate-300">
                                    100+
                                </h2>
                                <p className="text-slate-400 mt-1">
                                    Students
                                </p>
                            </div>

                            <div className="hover:translate-y-[-2px] transition">
                                <h2 className="text-3xl font-bold text-slate-300">
                                    10+
                                </h2>
                                <p className="text-slate-400 mt-1">
                                    Courses
                                </p>
                            </div>

                            <div className="hover:translate-y-[-2px] transition">
                                <h2 className="text-3xl font-bold text-slate-300">
                                    4.5⭐
                                </h2>
                                <p className="text-slate-400 mt-1">
                                    Ratings
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="relative flex lg:justify-end items-start">
                    
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="relative w-full max-w-lg lg:max-w-xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-6 shadow-2xl"
                            >
                                <img src={courses[currentIndex].image} alt={courses[currentIndex].title} 
                                    className="rounded-2xl w-full h-[380px] object-cover"/>

                                <h3 className="px-2 py-2 text-2xl text-white font-bold">
                                    {courses[currentIndex].title}
                                </h3>
                                <div className="px-2 mt-3 flex items-center justify-between">
                                    <p className="text-slate-300 mt-1">
                                        {courses[currentIndex].tech}
                                    </p>
                                    <div className="mt-4 inline-block px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-blue-400 text-sm">
                                        {courses[currentIndex].badge}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>

                </div>

        </section>
    )
}

export default HeroSection