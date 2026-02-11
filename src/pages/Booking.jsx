import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function Booking({ isOpen, onClose, initialLocation = '' }) {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)

    useEffect(() => {
        if (step === 6) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#A78BFA', '#ffffff'] });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#A78BFA', '#ffffff'] });
            }, 250);
        }
    }, [step])
    const [bookingData, setBookingData] = useState({
        location: '',
        show: '',
        date: '',
        time: '',
        tickets: 1,
        name: '',
        email: '',
        phone: ''
    })

    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        if (isOpen) {
            if (initialLocation) {
                setBookingData(prev => ({ ...prev, location: initialLocation, show: '' }))
                setStep(2)
            } else {
                setBookingData(prev => ({ ...prev, location: '', show: '' }))
                setStep(1)
            }
        }
    }, [isOpen, initialLocation])

    const locations = [
        { id: 'chennai', name: 'CHENNAI', venue: 'Alwarpet Black Box' },
        { id: 'bengaluru', name: 'BENGALURU', venue: 'Koramangala Studio' },
        { id: 'coimbatore', name: 'COIMBATORE', venue: 'Race Course Hub' }
    ]

    const shows = [
        { id: 's1', title: 'Soul-Stirring Theatre', price: '₹499' },
        { id: 's2', title: 'Indie Resonance', price: '₹799' },
        { id: 's3', title: 'Classical Flow', price: '₹599' }
    ]

    const times = ['18:15', '19:00', '20:30', '21:45']
    const dates = [
        { day: 'MON', num: '12', month: 'FEB' },
        { day: 'TUE', num: '13', month: 'FEB' },
        { day: 'WED', num: '14', month: 'FEB' },
        { day: 'THU', num: '15', month: 'FEB' },
        { day: 'FRI', num: '16', month: 'FEB' }
    ]

    const nextStep = () => {
        if (step === 4) {
            // Validate personal info
            const errors = {}
            if (!bookingData.name) errors.name = 'Name required'
            if (!bookingData.email) errors.email = 'Email required'
            if (!bookingData.phone) errors.phone = 'Phone required'

            if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return
            }
            setFormErrors({})
        }
        setDirection(1)
        setStep(s => Math.min(s + 1, 6))
    }
    const prevStep = () => {
        setDirection(-1)
        setStep(s => Math.max(s - 1, 1))
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 40 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    }

    const stepVariants = {
        enter: (d) => ({
            x: d > 0 ? 50 : -50,
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.1
        }),
        center: {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                filter: { duration: 0.4 }
            }
        },
        exit: (d) => ({
            x: d < 0 ? 50 : -50,
            opacity: 0,
            filter: 'blur(20px)',
            scale: 0.9,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        })
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#030303]/90 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl overflow-y-auto"
        >
            {/* Cinematic 3D Depth Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-[#A78BFA]/[0.02] border border-[#A78BFA]/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-[#A78BFA]/[0.01] border border-[#A78BFA]/5 rounded-full blur-2xl"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative w-full max-w-3xl glass border border-white/5 rounded-[3rem] p-6 md:p-12 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] z-10"
            >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10 relative">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black tracking-[0.8em] text-[#A78BFA] uppercase">Step 0{step}</span>
                            <div className="h-px w-16 bg-gradient-to-r from-[#A78BFA]/40 to-transparent" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-white italic tracking-tighter uppercase">
                            {step === 1 && "The Origin"}
                            {step === 2 && "The Performance"}
                            {step === 3 && "The Timing"}
                            {step === 4 && "The Witness"}
                            {step === 5 && "Review Signal"}
                            {step === 6 && "Confirmed"}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="group p-4 rounded-full border border-white/5 bg-white/5 hover:bg-[#A78BFA] hover:text-black transition-all duration-700"
                    >
                        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="relative min-h-[380px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Choose <br /><span className="text-white/20 italic">The Hub.</span></h2>
                                    <p className="text-white/50 text-sm md:text-lg font-medium italic">Our neural network of performance spaces.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {locations.map(loc => (
                                        <button
                                            key={loc.id}
                                            onClick={() => {
                                                setBookingData({ ...bookingData, location: loc.name })
                                                nextStep()
                                            }}
                                            className={`p-6 rounded-[2rem] border text-left transition-all duration-700 relative overflow-hidden group ${bookingData.location === loc.name ? 'bg-[#A78BFA] border-[#A78BFA] text-black' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                        >
                                            <div className="relative z-10">
                                                <div className={`text-[8px] font-black tracking-[0.4em] uppercase mb-3 ${bookingData.location === loc.name ? 'text-black/40' : 'text-[#A78BFA]'}`}>V-0{loc.id === 'chennai' ? 1 : loc.id === 'bengaluru' ? 2 : 3}</div>
                                                <div className="text-xl font-black uppercase tracking-tighter mb-1">{loc.name}</div>
                                                <div className="text-[10px] italic font-bold opacity-60">{loc.venue}</div>
                                            </div>
                                            <div className="absolute -bottom-3 -right-3 text-4xl font-black opacity-5 italic group-hover:opacity-10 transition-opacity uppercase">Hub</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Select <br /><span className="text-white/20 italic">Curated Show.</span></h2>
                                    <p className="text-white/50 text-sm md:text-lg font-medium italic">Active frequencies in {bookingData.location}.</p>
                                </div>
                                <div className="space-y-3">
                                    {shows.map(show => (
                                        <button
                                            key={show.id}
                                            onClick={() => {
                                                setBookingData({ ...bookingData, show: show.title })
                                                nextStep()
                                            }}
                                            className={`w-full p-6 rounded-[2rem] border text-left transition-all duration-700 flex items-center justify-between group ${bookingData.show === show.title ? 'bg-[#A78BFA] border-[#A78BFA] text-black' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black tracking-[0.4em] uppercase mb-1 ${bookingData.show === window.title ? 'text-black/40' : 'text-[#A78BFA]'}`}>Program</span>
                                                <div className="text-xl font-black uppercase tracking-tighter">{show.title}</div>
                                            </div>
                                            <div className="text-xl font-black italic">{show.price}</div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={prevStep} className="group flex items-center gap-4 text-white/40 hover:text-[#A78BFA] transition-colors">
                                    <div className="w-8 h-[1px] bg-current transition-all group-hover:w-12" />
                                    <span className="text-[9px] font-black tracking-[0.4em] uppercase">Back</span>
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Temporal <br /><span className="text-white/20 italic">Window.</span></h2>
                                    <p className="text-white/50 text-sm md:text-lg font-medium italic">Align with our performance cycle.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Date Selection */}
                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                        {dates.map((d, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setBookingData(prev => ({ ...prev, date: `${d.num} ${d.month}` }))}
                                                className={`flex-shrink-0 w-20 p-5 rounded-[1.5rem] border transition-all duration-700 flex flex-col items-center ${bookingData.date === `${d.num} ${d.month}` ? 'bg-[#A78BFA] border-[#A78BFA] text-black' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                            >
                                                <span className="text-[8px] font-black tracking-widest opacity-60 mb-1">{d.month}</span>
                                                <span className="text-2xl font-black tracking-tighter leading-none mb-1">{d.num}</span>
                                                <span className="text-[9px] font-black tracking-widest opacity-60">{d.day}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Time Selection */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {times.map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setBookingData(prev => ({ ...prev, time: t }))}
                                                className={`p-4 rounded-full border text-center transition-all duration-700 text-sm font-black tracking-widest ${bookingData.time === t ? 'bg-[#A78BFA] border-[#A78BFA] text-black' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <button onClick={prevStep} className="text-white/40 hover:text-[#A78BFA] text-[9px] font-black tracking-[0.4em] uppercase transition-colors">Back</button>
                                    <button
                                        disabled={!bookingData.date || !bookingData.time}
                                        onClick={nextStep}
                                        className="px-10 py-4 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.4em] uppercase hover:scale-105 transition-all disabled:opacity-20 shadow-3xl"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Witness <br /><span className="text-white/20 italic">Identity.</span></h2>
                                    <p className="text-white/50 text-sm md:text-lg font-medium italic">We need your signal parameters.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="group relative">
                                            <label className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-2 block group-focus-within:text-[#A78BFA] transition-colors">Full Name</label>
                                            <input
                                                type="text"
                                                value={bookingData.name}
                                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:text-white/5 uppercase ${formErrors.name ? 'border-red-500' : 'border-white/10 focus:border-[#A78BFA]'}`}
                                                placeholder="Identity Name"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-2 block group-focus-within:text-[#A78BFA] transition-colors">Email Frequency</label>
                                            <input
                                                type="email"
                                                value={bookingData.email}
                                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:text-white/5 uppercase ${formErrors.email ? 'border-red-500' : 'border-white/10 focus:border-[#A711FA]'}`}
                                                placeholder="Nexus@domain.com"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-2 block group-focus-within:text-[#A78BFA] transition-colors">Contact Wave</label>
                                            <input
                                                type="tel"
                                                value={bookingData.phone}
                                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:text-white/5 uppercase ${formErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#A78BFA]'}`}
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>

                                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center space-y-6">
                                        <span className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA] uppercase">Capacity Count</span>
                                        <div className="flex items-center gap-8">
                                            <button onClick={() => setBookingData(d => ({ ...d, tickets: Math.max(1, d.tickets - 1) }))} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xl text-white hover:bg-[#A78BFA] hover:text-black transition-all">-</button>
                                            <span className="text-5xl font-black italic text-white">{bookingData.tickets}</span>
                                            <button onClick={() => setBookingData(d => ({ ...d, tickets: Math.min(10, d.tickets + 1) }))} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xl text-white hover:bg-[#A78BFA] hover:text-black transition-all">+</button>
                                        </div>
                                        <p className="text-[9px] font-bold italic text-white/30 text-center">Maximum 10 witnesses per connection.</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <button onClick={prevStep} className="text-white/40 hover:text-[#A78BFA] text-[9px] font-black tracking-[0.4em] uppercase">Back</button>
                                    <button onClick={nextStep} className="px-10 py-4 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-3xl">Review Pass</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Review <br /><span className="text-white/20 italic">The Signal.</span></h2>
                                    <p className="text-white/50 text-sm md:text-lg font-medium italic">Validate your manifest before commitment.</p>
                                </div>

                                <div className="glass border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Witness</span>
                                            <div className="text-lg font-black text-white uppercase">{bookingData.name}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Hub</span>
                                            <div className="text-lg font-black text-white uppercase">{bookingData.location}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Temporal</span>
                                            <div className="text-lg font-black text-white uppercase">{bookingData.date} @ {bookingData.time}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Program</span>
                                            <div className="text-lg font-black text-white uppercase">{bookingData.show}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Count</span>
                                            <div className="text-lg font-black text-white uppercase">{bookingData.tickets} Persons</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black tracking-[0.5em] text-[#A78BFA] uppercase block mb-1">Investment</span>
                                            <div className="text-xl font-black text-[#A78BFA] italic">₹{bookingData.tickets * 799}</div>
                                        </div>
                                    </div>
                                    {/* Abstract Ticket Notch Decoration */}
                                    <div className="absolute top-1/2 left-0 -translate-x-1/2 w-6 h-12 bg-[#030303] rounded-full border-r border-white/5" />
                                    <div className="absolute top-1/2 right-0 translate-x-1/2 w-6 h-12 bg-[#030303] rounded-full border-l border-white/5" />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <button onClick={prevStep} className="flex-1 py-5 border border-white/5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase text-white/40 hover:text-white transition-all">Modify Data</button>
                                    <button onClick={nextStep} className="flex-[2] py-5 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.5em] uppercase hover:scale-[1.02] transition-all shadow-3xl">Commit Connection</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 6 && (
                            <motion.div
                                key="step6"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="flex flex-col items-center py-2 space-y-6 w-full max-w-4xl"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-12 h-12 rounded-full bg-[#A78BFA] mx-auto flex items-center justify-center text-black shadow-[0_0_20px_rgba(167,139,250,0.3)]"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* EXACT IMAGE TICKET CLONE */}
                                {/* EXACT IMAGE TICKET CLONE */}
                                <div
                                    id="neural-ticket"
                                    className="relative w-full aspect-[21/9] md:aspect-[21/8] bg-[#0A0A0A] rounded-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-row group select-none border border-white/5 mx-auto"
                                >
                                    {/* Left Sidebar - Ticket Number */}
                                    <div className="w-8 md:w-12 lg:w-16 bg-black flex items-center justify-center border-r border-white/10 relative z-10">
                                        <span className="text-white/80 text-[8px] md:text-xs font-medium tracking-widest uppercase -rotate-90 whitespace-nowrap">
                                            Ticket Number : {Math.random().toString().slice(2, 12)}
                                        </span>
                                    </div>

                                    {/* Main Body */}
                                    <div className="relative flex-1 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1474&auto=format&fit=crop)' }}>
                                        {/* Cinematic Dark Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                        <div className="absolute inset-0 bg-black/30" />

                                        {/* Stage Lights Glow Effect */}
                                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl" />

                                        <div className="relative h-full p-3 md:p-8 lg:p-10 flex flex-col justify-between">
                                            {/* Top Text - Large Headings */}
                                            <div className="space-y-0 text-left">
                                                <h1 className="text-lg md:text-3xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none uppercase max-w-[90%]">
                                                    {bookingData.show ? bookingData.show.split(' ').slice(0, -1).join(' ') || 'REALLY GREAT' : 'REALLY GREAT'}
                                                </h1>
                                                <div className="bg-white inline-block px-2 py-0.5 md:px-4 md:py-2 mt-1 md:mt-2">
                                                    <h1 className="text-lg md:text-3xl lg:text-5xl xl:text-6xl font-black text-black tracking-tighter leading-none uppercase">
                                                        {bookingData.show ? bookingData.show.split(' ').pop() : 'CONCERT'}
                                                    </h1>
                                                </div>
                                            </div>

                                            {/* Middle/Bottom Info Container */}
                                            <div className="flex flex-row items-end justify-between">
                                                {/* Venue Info */}
                                                <div className="space-y-0.5 md:space-y-1">
                                                    <div className="text-xs md:text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{bookingData.location || "Arena de Sole"}</div>
                                                    <div className="text-[6px] md:text-[9px] lg:text-[10px] text-white/70 max-w-[100px] md:max-w-[180px] lg:max-w-[240px] leading-tight font-medium">123 Main Street, City, State, Insert Your Address Here</div>
                                                </div>

                                                {/* Date & Time */}
                                                <div className="flex gap-3 md:gap-8 lg:gap-14 mb-0.5 md:mb-1">
                                                    <div className="space-y-0 md:space-y-0.5">
                                                        <div className="text-[7px] md:text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">Date :</div>
                                                        <div className="text-[10px] md:text-lg lg:text-xl font-black text-white whitespace-nowrap uppercase tracking-tighter leading-none">{bookingData.date || "September 15, 2024"}</div>
                                                    </div>
                                                    <div className="space-y-0 md:space-y-0.5">
                                                        <div className="text-[7px] md:text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">Time :</div>
                                                        <div className="text-[10px] md:text-lg lg:text-xl font-black text-white whitespace-nowrap uppercase tracking-tighter leading-none">{bookingData.time || "5:00 PM"}</div>
                                                    </div>
                                                </div>

                                                {/* Live Performance Arrows */}
                                                <div className="hidden lg:flex flex-col items-center gap-1 mb-1">
                                                    <div className="flex text-white space-x-[-10px] lg:space-x-[-12px]">
                                                        {[1, 2, 3].map(i => (
                                                            <svg key={i} className="w-6 h-6 lg:w-10 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <div className="text-[7px] lg:text-[9px] font-black tracking-[0.4em] text-white/60 uppercase">Live Performance</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforation Line */}
                                    <div className="relative w-px flex flex-col items-center justify-between z-20">
                                        {/* Notches */}
                                        <div className="absolute top-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#030303] border-b border-white/5" />
                                        <div className="flex-1 w-full border-l-[1px] md:border-l-2 border-dashed border-white/20 my-4 md:my-6" />
                                        <div className="absolute bottom-0 translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#030303] border-t border-white/5" />
                                    </div>

                                    {/* Right Section (Stub) */}
                                    <div className="w-[32%] md:w-[30%] bg-[#0A0A0A] p-2 md:p-8 flex flex-col items-center relative">
                                        {/* QR Code */}
                                        <div className="w-14 h-14 md:w-32 md:h-32 bg-white p-1 md:p-2 rounded-sm shadow-xl mt-1 md:mt-2 flex-shrink-0">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEDAI-PASS-${bookingData.name}-${Date.now()}`}
                                                alt="QR Code"
                                                className="w-full h-full"
                                            />
                                        </div>

                                        {/* Vertical Text and Info Stack Wrapper */}
                                        <div className="flex-1 w-full flex flex-row items-center justify-center gap-1.5 md:gap-8 mt-2 md:mt-8">
                                            {/* Vertical Text */}
                                            <div className="h-full flex items-center justify-center">
                                                <span className="text-[10px] md:text-3xl font-black text-white tracking-[0.1em] -rotate-90 uppercase whitespace-nowrap opacity-90">
                                                    ADMIT ONE
                                                </span>
                                            </div>

                                            {/* Vertical Divider */}
                                            <div className="h-10 md:h-32 w-[1px] bg-white/20" />

                                            {/* Vertical Info Stack */}
                                            <div className="flex flex-col justify-center gap-1 md:gap-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[6px] md:text-[9px] font-bold text-white/40 uppercase tracking-tighter">Gate</span>
                                                    <span className="text-[10px] md:text-xl font-black text-white tracking-widest leading-none">01</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[6px] md:text-[9px] font-bold text-white/40 uppercase tracking-tighter">Row</span>
                                                    <span className="text-[10px] md:text-xl font-black text-white tracking-widest leading-none">02</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[6px] md:text-[9px] font-bold text-white/40 uppercase tracking-tighter">Seat</span>
                                                    <span className="text-[10px] md:text-xl font-black text-white tracking-widest leading-none">03</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3 justify-center pt-2 w-full max-w-sm">
                                    <button
                                        onClick={() => {
                                            const canvas = document.createElement('canvas');
                                            canvas.width = 1200;
                                            canvas.height = 400;
                                            const ctx = canvas.getContext('2d');

                                            const draw = (bgImg = null, qrImg = null) => {
                                                // Background
                                                ctx.fillStyle = '#0A0A0A';
                                                ctx.fillRect(0, 0, 1200, 400);

                                                // Left Sidebar
                                                ctx.fillStyle = '#000000';
                                                ctx.fillRect(0, 0, 80, 400);

                                                // Vertical Ticket Number
                                                ctx.save();
                                                ctx.translate(45, 200);
                                                ctx.rotate(-Math.PI / 2);
                                                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                                                ctx.font = '700 16px Arial';
                                                ctx.textAlign = 'center';
                                                ctx.fillText('TICKET NUMBER : ' + Math.random().toString().slice(2, 12), 0, 0);
                                                ctx.restore();

                                                // Main Body Background
                                                if (bgImg) {
                                                    ctx.drawImage(bgImg, 80, 0, 810, 400);
                                                    const grad = ctx.createLinearGradient(0, 0, 0, 400);
                                                    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
                                                    grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
                                                    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
                                                    ctx.fillStyle = grad;
                                                    ctx.fillRect(80, 0, 810, 400);
                                                }

                                                // Headings
                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = '900 65px Arial Black';
                                                ctx.fillText('REALLY GREAT', 120, 110);

                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.fillRect(115, 130, 360, 85);
                                                ctx.fillStyle = '#000000';
                                                ctx.font = '900 65px Arial Black';
                                                ctx.fillText(bookingData.show ? bookingData.show.split(' ').pop().toUpperCase() : 'CONCERT', 125, 195);

                                                // Bottom Info
                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = 'italic 900 24px Arial Black';
                                                ctx.fillText(bookingData.location || "ARENA DE SOLE", 120, 330);
                                                ctx.font = '400 14px Arial';
                                                ctx.fillText('123 MAIN STREET, CITY, STATE, INSERT ADDRESS', 120, 355);

                                                // Date & Time
                                                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                                                ctx.font = '900 14px Arial';
                                                ctx.fillText('DATE :', 550, 320);
                                                ctx.fillText('TIME :', 730, 320);

                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = '900 22px Arial Black';
                                                ctx.fillText(bookingData.date || "SEP 15, 2024", 550, 355);
                                                ctx.fillText(bookingData.time || "5:00 PM", 730, 355);

                                                // Perforation
                                                ctx.fillStyle = '#030303';
                                                ctx.beginPath(); ctx.arc(890, 0, 25, 0, Math.PI * 2); ctx.fill();
                                                ctx.beginPath(); ctx.arc(890, 400, 25, 0, Math.PI * 2); ctx.fill();

                                                ctx.setLineDash([10, 10]);
                                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                                                ctx.lineWidth = 2;
                                                ctx.beginPath();
                                                ctx.moveTo(890, 30);
                                                ctx.lineTo(890, 370);
                                                ctx.stroke();
                                                ctx.setLineDash([]);

                                                // Stub background
                                                ctx.fillStyle = '#0A0A0A';
                                                ctx.fillRect(890, 0, 310, 400);

                                                // QR Code
                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.fillRect(980, 40, 130, 130);
                                                if (qrImg) {
                                                    ctx.drawImage(qrImg, 985, 45, 120, 120);
                                                }

                                                // Vertical Separator Line (Stub side)
                                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                                                ctx.lineWidth = 1;
                                                ctx.beginPath();
                                                ctx.moveTo(1055, 210);
                                                ctx.lineTo(1055, 360);
                                                ctx.stroke();

                                                // ADMIT ONE - Positioned to the left of the divider
                                                ctx.save();
                                                ctx.translate(990, 285);
                                                ctx.rotate(-Math.PI / 2);
                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = '900 30px Arial Black';
                                                ctx.textAlign = 'center';
                                                ctx.textBaseline = 'middle';
                                                ctx.fillText('ADMIT ONE', 0, 0);
                                                ctx.restore();

                                                // Vertical Info Stack - Positioned to the right of the divider
                                                ctx.textAlign = 'left';
                                                ctx.textBaseline = 'top';

                                                const stackX = 1080;
                                                const startY = 220;
                                                const spacing = 50;

                                                ['GATE', 'ROW', 'SEAT'].forEach((label, i) => {
                                                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                                                    ctx.font = '700 12px Arial';
                                                    ctx.fillText(label, stackX, startY + i * spacing);

                                                    ctx.fillStyle = '#FFFFFF';
                                                    ctx.font = '900 20px Arial Black';
                                                    ctx.fillText(i === 0 ? '01' : i === 1 ? '02' : '03', stackX, startY + i * spacing + 18);
                                                });

                                                // Final Download Action
                                                const link = document.createElement('a');
                                                link.download = `MEDAI-Ticket-${bookingData.name || 'Nexus'}.png`;
                                                link.href = canvas.toDataURL('image/png');
                                                link.click();
                                            };

                                            // Preloader for both images
                                            let loadedCount = 0;
                                            const bgImg = new Image();
                                            const qrImg = new Image();

                                            const checkAllLoaded = () => {
                                                loadedCount++;
                                                if (loadedCount === 2) draw(bgImg, qrImg);
                                            };

                                            bgImg.crossOrigin = "anonymous";
                                            bgImg.onload = checkAllLoaded;
                                            bgImg.onerror = checkAllLoaded; // Draw even if bg fails
                                            bgImg.src = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1474&auto=format&fit=crop';

                                            qrImg.crossOrigin = "anonymous";
                                            qrImg.onload = checkAllLoaded;
                                            qrImg.onerror = checkAllLoaded; // Draw even if qr fails
                                            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEDAI-PASS-${bookingData.name}-${Date.now()}`;
                                        }}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-black border border-white rounded-full group hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff] transition-all transform hover:scale-105"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12 a2 2 0 002-2v-1M7 10l5 5 5-5M12 4v11" />
                                        </svg>
                                        <span className="text-[10px] font-black tracking-widest uppercase">Download Pass</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const eventName = encodeURIComponent(`MEDAI: ${bookingData.show || 'Performance'}`);
                                            const details = encodeURIComponent(`Witness the neural frequency at ${bookingData.location}. Ticket: ${bookingData.tickets} persons.`);
                                            const location = encodeURIComponent(bookingData.location || 'MEDAI Hub');

                                            // Date/Time Parsing for Google Calendar (YYYYMMDDTHHMMSSZ)
                                            const monthMap = { 'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12' };
                                            const dateParts = (bookingData.date || "12 FEB").split(' ');
                                            const day = dateParts[0].padStart(2, '0');
                                            const month = monthMap[dateParts[1].toUpperCase()] || '02';

                                            const timeParts = (bookingData.time || "19:00").split(':');
                                            const hh = timeParts[0];
                                            const mm = timeParts[1];

                                            const startStr = `2026${month}${day}T${hh}${mm}00`;
                                            const endHour = (parseInt(hh) + 2).toString().padStart(2, '0');
                                            const endStr = `2026${month}${day}T${endHour}${mm}00`;

                                            const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventName}&details=${details}&location=${location}&dates=${startStr}/${endStr}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-white/20 rounded-full group hover:border-[#A78BFA]/40 transition-all transform hover:scale-105"
                                    >
                                        <svg className="w-3.5 h-3.5 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-[10px] font-black tracking-widest text-white/60 group-hover:text-white uppercase">Sync Calendar</span>
                                    </button>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="px-10 py-4 border border-white/5 rounded-full text-[10px] font-black tracking-[0.6em] uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all mt-2"
                                >
                                    Return to Origin
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    )
}
