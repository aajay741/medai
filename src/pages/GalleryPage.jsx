import Gallery from '../sections/Gallery'
import ArtistPerspective from '../sections/ArtistPerspective'
import VisualArchive from '../sections/VisualArchive'
import DomeGallerySection from '../sections/DomeGallerySection'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function GalleryPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="gallery-main">
                <Gallery />
            </div>
            <div id="gallery-perspective">
                <ArtistPerspective />
            </div>
            <div id="gallery-archive">
                <DomeGallerySection />
                <VisualArchive />
            </div>
            <Footer />
        </motion.div>
    )
}
