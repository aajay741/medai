import Gallery from '../sections/Gallery'
import ArtistPerspective from '../sections/ArtistPerspective'
import VisualArchive from '../sections/VisualArchive'
import DomeGallerySection from '../sections/DomeGallerySection'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function GalleryPage({ tier = 2, isMobile = false }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="gallery-main">
                <Gallery tier={tier} isMobile={isMobile} />
            </div>
            <div id="gallery-perspective">
                <ArtistPerspective tier={tier} isMobile={isMobile} />
            </div>
            <div id="gallery-archive">
                <DomeGallerySection />
                <VisualArchive tier={tier} isMobile={isMobile} />
            </div>
            <Footer tier={tier} isMobile={isMobile} />
        </motion.div>
    )
}
