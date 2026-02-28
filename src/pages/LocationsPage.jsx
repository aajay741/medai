import Venues from '../sections/Venues'
import Stats from '../sections/Stats'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function LocationsPage({ onBookClick, tier = 2, isMobile = false }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div className="pt-20">
                <Stats tier={tier} isMobile={isMobile} />
                <Venues onBookClick={onBookClick} tier={tier} isMobile={isMobile} />
            </div>
            <Footer tier={tier} isMobile={isMobile} />
        </motion.div>
    )
}
