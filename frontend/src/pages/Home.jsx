import { useEffect } from "react"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import Features from "../components/Features"
import CTASection from "../components/CTASection"
import Footer from "../components/Footer"
import ReviewsSection from "../components/ReviewSection"

function Home() {

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
        const id = hash.replace("#", "")

        const tryScroll = (attempts = 0) => {
            const el = document.getElementById(id)
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: "smooth" })
            } else if (attempts < 10) {
                setTimeout(() => tryScroll(attempts + 1), 200)  // retry every 200ms up to 10 times
            }
        }

        setTimeout(() => tryScroll(), 500)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-x-hidden">

      <Navbar />
      <HeroSection />
      <Features />
      <ReviewsSection />
      <CTASection />
      <Footer />

    </div>
  )
}

export default Home