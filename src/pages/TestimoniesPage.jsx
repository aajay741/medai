import Voices from '../sections/Voices'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function TestimoniesPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div className="pt-20">
                <Voices />
            </div>
            <Footer />
        </motion.div>
    )
}
