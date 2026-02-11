import Intro from '../sections/Intro'
import Stats from '../sections/Stats'
import Ecosystem from '../sections/Ecosystem'
import CommunityPulse from '../sections/CommunityPulse'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function NetworkPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="network-hero">
                <Intro />
            </div>
            <div id="network-stats">
                <Stats />
            </div>
            <div id="network-pulse">
                <CommunityPulse />
            </div>
            <div id="network-ecosystem">
                <Ecosystem />
            </div>
            <Footer />
        </motion.div>
    )
}
