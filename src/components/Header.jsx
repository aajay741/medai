import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export default function Header({ onBookClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const menuItems = [
        { label: 'Network', path: '/network' },
        { label: 'Spaces', path: '/spaces' },
        { label: 'Experience', path: '/experience' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Locations', path: '/locations' },
        { label: 'Contact', path: '/contact' }
    ]

    const scrollToTop = () => {
        window.dispatchEvent(new CustomEvent('scroll-to-top'));
    };

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
            >
                {/* Premium Isolate Layer - Prevents content clutter during scroll */}
                <div className="absolute inset-0 bg-[#030303]/40 backdrop-blur-xl border-b border-white/[0.02] pointer-events-none" />

                {/* Anchoring Horizon Line (Visual Depth) */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="relative max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 h-16 md:h-24 flex justify-between items-center group/header">
                    {/* Brand Identity - Anchored Left */}
                    <Link
                        to="/"
                        className="flex flex-col gap-1 pointer-events-auto cursor-pointer group/brand z-[102]"
                        onClick={() => {
                            isMenuOpen && setIsMenuOpen(false);
                            scrollToTop();
                        }}
                    >
                        <div className="flex items-center gap-4 md:gap-6">
                            <span className="text-[16px] md:text-[22px] font-black tracking-[0.8em] md:tracking-[1em] text-white uppercase transition-all duration-700 group-hover/brand:tracking-[1.1em] group-hover/brand:text-[#A78BFA]">
                                MEDAI
                            </span>
                            <div className="hidden md:block h-[2px] w-12 md:w-20 bg-[#A78BFA]/20 group-hover/brand:w-24 group-hover/brand:bg-[#A78BFA] transition-all duration-1000 ease-[0.16,1,0.3,1]" />
                        </div>
                        <div className="flex items-center gap-3 ml-1">
                            <span className="text-[8px] md:text-[9px] font-black tracking-[0.5em] text-[#A78BFA] uppercase opacity-80">
                                The Stage
                            </span>
                        </div>
                    </Link>

                    {/* Primary Navigation / Trigger - Anchored Right */}
                    <div className="pointer-events-auto flex items-center gap-4 md:gap-12 z-[102]">
                        {/* Architectural Menu Sections (Desktop) */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={scrollToTop}
                                    className="group/nav relative py-2"
                                >
                                    <span className={`text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 ${location.pathname === item.path ? 'text-[#A78BFA] tracking-[0.6em]' : 'text-white/60 group-hover/nav:text-white group-hover/nav:tracking-[0.6em]'}`}>
                                        {item.label}
                                    </span>
                                    {/* Premium Interaction Line */}
                                    <div className={`absolute bottom-0 left-0 h-[1px] bg-[#A78BFA] transition-all duration-700 ease-[0.16,1,0.3,1] ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Trigger */}
                        <div
                            className="lg:hidden flex items-center gap-4 cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#A78BFA]">
                                {isMenuOpen ? 'CLOSE' : 'MENU'}
                            </span>
                            <div className="flex flex-col gap-1.5 group/menu">
                                <motion.div
                                    animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                    className="w-6 h-[1.5px] bg-[#A78BFA] transition-all duration-500"
                                />
                                <motion.div
                                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-4 h-[1.5px] bg-[#A78BFA] transition-all duration-500"
                                />
                                <motion.div
                                    animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                    className="w-4 h-[1.5px] bg-[#A78BFA] transition-all duration-500"
                                    style={{ width: isMenuOpen ? '24px' : '16px' }}
                                />
                            </div>
                        </div>

                        {/* Desktop CTA */}
                        <button
                            onClick={onBookClick}
                            className="hidden md:block glass border border-[#A78BFA]/10 px-8 py-3.5 rounded-full text-[10px] md:text-[11px] font-black tracking-[0.6em] text-white uppercase hover:bg-[#A78BFA] hover:text-black transition-all duration-700 shadow-3xl group/btn overflow-hidden relative"
                        >
                            <span className="relative z-10">Book Now</span>
                            <div className="absolute inset-0 bg-[#A78BFA] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                        </button>
                    </div>
                </div>

                {/* Structural Anchor Lines - Visual link to Cinematic Frame */}
                <div className="absolute top-0 left-8 md:left-16 lg:left-24 w-[1px] h-12 bg-[#A78BFA]/15 shadow-[0_0_15px_rgba(167,139,250,0.2)]" />
                <div className="absolute top-0 right-8 md:right-16 lg:right-24 w-[1px] h-12 bg-[#A78BFA]/15 shadow-[0_0_15px_rgba(167,139,250,0.2)]" />
            </motion.header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[101] bg-[#030303] flex flex-col justify-center items-center pointer-events-auto"
                    >
                        <div className="absolute inset-0 bg-[#A78BFA]/5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <nav className="flex flex-col items-center gap-12 relative z-10">
                            {menuItems.map((item, i) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`text-4xl md:text-6xl font-black uppercase tracking-tighter transition-colors ${location.pathname === item.path ? 'text-[#A78BFA]' : 'text-white hover:text-[#A78BFA]'}`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.button
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onBookClick();
                                }}
                                className="mt-8 bg-[#A78BFA] text-black px-12 py-5 rounded-full text-xs font-black tracking-[0.6em] uppercase hover:bg-white hover:scale-105 transition-all duration-500"
                            >
                                Secure Seat
                            </motion.button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
