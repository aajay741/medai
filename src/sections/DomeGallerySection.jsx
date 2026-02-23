import { motion } from 'framer-motion'
import DomeGallery from '../components/ReactBits/DomeGallery'

// Importing images from the specified folders
// Using standard glob patterns or manual imports based on known lists
// Since we are in a Vite environment, we can use import.meta.glob

const bangaloreImages = Object.values(import.meta.glob('../assets/medai-bangalore/*.{jpg,png,jpeg}', { eager: true, as: 'url' }));
const chennaiImages = Object.values(import.meta.glob('../assets/medai-chennai/*.{jpg,png,jpeg}', { eager: true, as: 'url' }));
const coimbatoreImages = Object.values(import.meta.glob('../assets/medai-coimbatore/*.{jpg,png,jpeg}', { eager: true, as: 'url' }));

const allImages = [...bangaloreImages, ...chennaiImages, ...coimbatoreImages].map(src => ({ src, alt: 'Medai Performance' }));

export default function DomeGallerySection() {
    return (
        <section className="relative w-full bg-[#030303] overflow-hidden flex flex-col pt-32 pb-10">
            {/* Header Content - Now Above the Image */}
            <div className="z-20 text-center mb-16 px-6">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[#A78BFA] font-black tracking-[0.5em] text-[10px] md:text-xs uppercase mb-4 block"
                >
                    The Vault / Archive
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter"
                >
                    Performance <span className="text-white/20 italic">Curations.</span>
                </motion.h2>
            </div>

            <div className="w-full h-screen relative">
                <div className="absolute inset-0">
                    <DomeGallery
                        images={allImages}
                        fit={1.1}
                        minRadius={800}
                        maxVerticalRotationDeg={0}
                        segments={34}
                        dragDampening={2}
                        grayscale
                        overlayBlurColor="#030303"
                    />
                </div>

                {/* Bottom Instructions */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 2 }}
                        className="text-[10px] font-black tracking-[0.4em] text-white uppercase"
                    >
                        Drag to explore / Click to enlarge
                    </motion.span>
                </div>
            </div>
        </section>
    )
}
