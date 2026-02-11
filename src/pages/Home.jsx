import Hero from '../sections/Hero'
import About from '../sections/About'
import Features from '../sections/Features'
import NeuralShowcase from '../sections/NeuralShowcase'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function Home({ onBookClick }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="hero">
                <Hero onBookClick={onBookClick} />
            </div>

            <div id="home-about">
                <About />
            </div>

            <div id="home-neural">
                <NeuralShowcase />
            </div>

            <div id="home-features">
                <Features />
            </div>

            {/* Cinematic divider */}
            <section className="py-20 flex justify-center">
                <div className="w-px h-40 bg-gradient-to-b from-[#A78BFA]/40 to-transparent" />
            </section>

            <Footer />
        </motion.div>
    )
}
