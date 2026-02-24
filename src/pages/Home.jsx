import Hero from '../sections/Hero'
import Stats from '../sections/Stats'
import Intro from '../sections/Intro'
import Venues from '../sections/Venues'
import Facilities from '../sections/Facilities'
import Gallery from '../sections/Gallery'
import Quote from '../sections/Quote'
import ContactSection from '../sections/ContactSection'
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

            <div id="stats">
                <Stats />
            </div>

            <div id="about">
                <Intro onBookClick={onBookClick} />
            </div>

            <div id="venues">
                <Venues onBookClick={onBookClick} />
            </div>

            <div id="facilities">
                <Facilities />
            </div>

            <div id="gallery">
                <Gallery />
            </div>

            <div id="quote">
                <Quote />
            </div>

            <div id="contact">
                <ContactSection />
            </div>

            <Footer />
        </motion.div>
    )
}
