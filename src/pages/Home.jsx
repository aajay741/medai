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

export default function Home({ onBookClick, tier, isMobile }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="hero">
                <Hero onBookClick={onBookClick} tier={tier} isMobile={isMobile} />
            </div>

            <div id="stats">
                <Stats tier={tier} isMobile={isMobile} />
            </div>

            <div id="about">
                <Intro onBookClick={onBookClick} tier={tier} isMobile={isMobile} />
            </div>

            <div id="venues">
                <Venues onBookClick={onBookClick} tier={tier} isMobile={isMobile} />
            </div>

            <div id="facilities">
                <Facilities tier={tier} isMobile={isMobile} />
            </div>

            <div id="gallery">
                <Gallery tier={tier} isMobile={isMobile} />
            </div>

            <div id="quote">
                <Quote tier={tier} isMobile={isMobile} />
            </div>

            <div id="contact">
                <ContactSection tier={tier} isMobile={isMobile} />
            </div>

            <Footer tier={tier} isMobile={isMobile} />
        </motion.div>
    )
}
