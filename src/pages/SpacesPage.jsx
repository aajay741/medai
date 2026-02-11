import Venues from '../sections/Venues'
import Facilities from '../sections/Facilities'
import BookingBenefits from '../sections/BookingBenefits'
import StageTechnology from '../sections/StageTechnology'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function SpacesPage({ onBookClick }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="spaces-hero">
                <Venues onBookClick={onBookClick} />
            </div>
            <div id="spaces-facilities">
                <Facilities />
            </div>
            <div id="spaces-tech">
                <StageTechnology />
            </div>
            <div id="spaces-benefits">
                <BookingBenefits />
            </div>
            <Footer />
        </motion.div>
    )
}
