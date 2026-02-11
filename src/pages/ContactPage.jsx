import ContactHero from '../sections/ContactHero'
import ContactForm from '../sections/ContactForm'
import Quote from '../sections/Quote'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function ContactPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#030303]"
        >
            <div id="contact-hero">
                <ContactHero />
            </div>
            <div id="contact-form">
                <ContactForm />
            </div>
            <div id="contact-quote">
                <Quote />
            </div>
            <Footer />
        </motion.div>
    )
}
