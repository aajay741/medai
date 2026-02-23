import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UpcomingEvents = ({ onBookClick }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/backend/api/events.php?upcoming=1');
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setEvents(data.data);
                }
            } catch (err) {
                console.error('Error fetching upcoming events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading || events.length === 0) return null;

    return (
        <section className="relative w-full bg-[#030303] py-32 overflow-hidden border-t border-white/5">
            {/* Background Narrative Text */}
            <div className="absolute top-20 left-10 opacity-[0.03] select-none pointer-events-none">
                <h2 className="text-[20vw] font-black leading-none uppercase tracking-tighter">
                    Vibrations
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase">Coming Soon</span>
                            <div className="h-px w-20 bg-gradient-to-r from-[#A78BFA] to-transparent" />
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-tight">
                            Neural <br />
                            <span className="text-white/30 italic">Frequencies</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Event Details */}
                    <div className="order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <span className="text-[#A78BFA] text-lg font-black uppercase tracking-widest block">
                                        {events[activeIndex].category || 'Performance'}
                                    </span>
                                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.9]">
                                        {events[activeIndex].title}
                                    </h3>
                                </div>

                                <p className="text-xl text-white/50 italic leading-relaxed max-w-xl">
                                    {events[activeIndex].description || 'An immersive performance that pushes the boundaries of art and technology.'}
                                </p>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                                    <div>
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase block mb-2">Location</span>
                                        <span className="text-white font-bold text-lg uppercase">{events[activeIndex].location}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase block mb-2">Temporal</span>
                                        <span className="text-white font-bold text-lg uppercase">
                                            {new Date(events[activeIndex].event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} @ {events[activeIndex].event_time}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-4">
                                    <button
                                        onClick={() => onBookClick(events[activeIndex].location)}
                                        className="px-10 py-5 bg-[#A78BFA] text-black font-black rounded-full uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl hover:bg-white"
                                    >
                                        Reserve Witness Spot
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Dots */}
                        <div className="flex gap-4 mt-16">
                            {events.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${activeIndex === i ? 'w-20 bg-[#A78BFA]' : 'w-4 bg-white/10 hover:bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Event Visual */}
                    <div className="order-1 lg:order-2 relative group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
                            >
                                <img
                                    src={events[activeIndex].image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1474&auto=format&fit=crop'}
                                    alt={events[activeIndex].title}
                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />

                                {/* Floating Badges */}
                                <div className="absolute top-8 right-8">
                                    <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                                        <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Limited Slots</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Visual Depth Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#A78BFA]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#A78BFA]/5 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
