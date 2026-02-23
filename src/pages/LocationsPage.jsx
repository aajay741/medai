import Venues from '../sections/Venues'
import Stats from '../sections/Stats'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function LocationsPage({ onBookClick }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div className="pt-20">
                <Stats />
                <Venues onBookClick={onBookClick} />
            </div>
            <Footer />
        </motion.div>
    )
}
