import VisualArchive from '../sections/VisualArchive'
import DomeGallerySection from '../sections/DomeGallerySection'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function ImagesPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div className="pt-20">
                <DomeGallerySection />
                <VisualArchive />
            </div>
            <Footer />
        </motion.div>
    )
}
