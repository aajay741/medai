import BookingBenefits from '../sections/BookingBenefits'
import StageTechnology from '../sections/StageTechnology'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function SpacesPage({ onBookClick, tier = 2, isMobile = false }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="spaces-tech" className="pt-20">
                <StageTechnology tier={tier} isMobile={isMobile} />
            </div>
            <div id="spaces-benefits">
                <BookingBenefits tier={tier} isMobile={isMobile} />
            </div>
            <Footer tier={tier} isMobile={isMobile} />
        </motion.div>
    )
}
