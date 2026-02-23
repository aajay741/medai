import Experience from '../sections/Experience'
import ShowProcess from '../sections/ShowProcess'
import CreativeRoadmap from '../sections/CreativeRoadmap'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function ExperiencePage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="experience-hero">
                <Experience />
            </div>
            <div id="experience-process">
                <ShowProcess />
            </div>
            <div id="experience-roadmap">
                <CreativeRoadmap />
            </div>
            <Footer />
        </motion.div>
    )
}
