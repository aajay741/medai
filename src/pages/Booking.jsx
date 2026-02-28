import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

const VENUE_SLOTS = {
    'CHENNAI': [
        { code: 'C1', range: '07:00 AM – 10:00 AM', duration: '3 Hours', price: 1, total: 1 },
        { code: 'C2', range: '11:00 AM – 02:00 PM', duration: '3 Hours', price: 15000, total: 17700 },
        { code: 'C3', range: '03:00 PM – 06:00 PM', duration: '3 Hours', price: 15000, total: 17700 },
        { code: 'C4', range: '07:00 PM – 10:00 PM', duration: '3 Hours', price: 15000, total: 17700 },
    ],
    'BENGALURU': [
        { code: 'B1', range: '03:00 PM – 09:00 PM', duration: '6 Hours', price: 45000, total: 53100 },
        { code: 'B2', range: '08:00 AM – 02:00 PM', duration: '6 Hours', price: 45000, total: 53100 },
    ],
    'BANGALORE': [
        { code: 'B1', range: '03:00 PM – 09:00 PM', duration: '6 Hours', price: 45000, total: 53100 },
        { code: 'B2', range: '08:00 AM – 02:00 PM', duration: '6 Hours', price: 45000, total: 53100 },
    ],
    'COIMBATORE': [
        { code: 'CB1', range: '08:00 AM – 02:00 PM', duration: '6 Hours', price: 30000, total: 35400 },
        { code: 'CB2', range: '03:00 PM – 09:00 PM', duration: '6 Hours', price: 30000, total: 35400 },
    ]
}

export default function Booking({ isOpen, onClose, initialLocation = '' }) {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [allEvents, setAllEvents] = useState([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [bookingData, setBookingData] = useState({
        location: '',
        show: '',
        date: '',
        date_full: '',
        time: '',
        slot_code: '',
        duration: '',
        price: 0,
        total: 0,
        tickets: 1,
        name: '',
        email: '',
        phone: '',
        company_name: '',
        gst_number: '',
        billing_address: '',
        city: '',
        state: '',
        zip: '',
        purpose: ''
    })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingResponse, setBookingResponse] = useState(null)

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


    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoadingEvents(true)
            try {
                const response = await fetch('/backend/api/events.php')
                const contentType = response.headers.get('content-type')
                if (!contentType || !contentType.includes('application/json')) {
                    console.warn('Events API did not return JSON. Is the PHP backend running?')
                    return
                }
                const data = await response.json()
                if (data.success) {
                    setAllEvents(data.data)
                }
            } catch (err) {
                console.error('Error fetching events:', err)
            } finally {
                setIsLoadingEvents(false)
            }
        }
        if (isOpen) fetchEvents()
    }, [isOpen])

    const defaultLocations = [
        { id: 'chennai', name: 'CHENNAI', venue: 'MEDAI Space' },
        { id: 'bengaluru', name: 'BENGALURU', venue: 'MEDAI Space' },
        { id: 'coimbatore', name: 'COIMBATORE', venue: 'MEDAI Space' }
    ]

    const locations = allEvents.length > 0
        ? Array.from(new Set(allEvents.filter(e => e.location).map(e => e.location))).map(loc => {
            const event = allEvents.find(e => e.location === loc)
            return {
                id: String(loc).toLowerCase().replace(/\s+/g, '-'),
                name: String(loc).trim().toUpperCase(),
                venue: event?.venue_name || 'MEDAI Space'
            }
        })
        : defaultLocations

    const selectedLocation = (bookingData.location || '').trim().toUpperCase()

    const shows = [
        { id: 'space-booking', title: 'Space Booking', price: 'Varies', type: 'virtual' },
        ...Array.from(new Set(allEvents
            .filter(e => e.location && String(e.location).toUpperCase() === selectedLocation)
            .map(e => e.title)
        )).map((title, i) => {
            const event = allEvents.find(e => e.title === title && e.location && String(e.location).toUpperCase() === selectedLocation)
            const minPrice = event?.ticket_types ? Math.min(...event.ticket_types.map(t => parseInt(t.price))) : 499
            return { id: `s${i}`, title: title, price: `₹${minPrice}` }
        })
    ]

    // Fallback dates if no events exist
    const generateFallbackDates = () => {
        const fallbacks = []
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

        for (let i = 0; i < 7; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i)
            fallbacks.push({
                day: days[d.getDay()],
                num: d.getDate().toString(),
                month: months[d.getMonth()],
                full: d.toISOString().split('T')[0]
            })
        }
        return fallbacks
    }

    const eventDates = Array.from(new Set(allEvents
        .filter(e =>
            e.location && String(e.location).toUpperCase() === selectedLocation &&
            e.title === bookingData.show
        )
        .map(e => e.event_date)
    )).map(dateStr => {
        const d = new Date(dateStr)
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        return {
            day: days[d.getDay()],
            num: d.getDate().toString(),
            month: months[d.getMonth()],
            full: dateStr
        }
    })

    const dates = (bookingData.show === 'Space Booking' || eventDates.length === 0)
        ? generateFallbackDates()
        : eventDates

    const times = bookingData.show === 'Space Booking'
        ? (VENUE_SLOTS[selectedLocation] || []).map(s => s.range)
        : allEvents
            .filter(e =>
                e.location && String(e.location).trim().toUpperCase() === selectedLocation &&
                e.title === bookingData.show &&
                e.event_date === bookingData.date_full
            )
            .map(e => e.event_time)



    useEffect(() => {
        if (isOpen) {
            if (initialLocation) {
                setBookingData(prev => ({
                    ...prev,
                    location: initialLocation,
                    show: 'Space Booking',
                    date: '',
                    date_full: '',
                    time: '',
                    slot_code: '',
                    duration: '',
                    price: 0,
                    total: 0
                }))
                setStep(2)
            } else {
                setBookingData(prev => ({ ...prev, location: '', show: '', date: '', date_full: '', time: '' }))
                setStep(1)
            }
        }
    }, [isOpen, initialLocation])

    const nextStep = () => {
        if (step === 3) {
            // Validate personal info
            const errors = {}
            if (!bookingData.name) errors.name = 'Name required'
            if (!bookingData.email) errors.email = 'Email required'
            if (!bookingData.phone) errors.phone = 'Phone required'
            if (!bookingData.billing_address) errors.billing_address = 'Address required'
            if (!bookingData.zip) errors.zip = 'ZIP required'
            if (!bookingData.city) errors.city = 'City required'
            if (!bookingData.state) errors.state = 'State required'

            if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return
            }
            setFormErrors({})
        }
        setDirection(1)
        setStep(s => Math.min(s + 1, 5))
    }

    const handleBooking = async () => {
        setIsSubmitting(true)
        try {
            // ── Step 1: Calculate total amount (paise for Razorpay) ──────────
            const basePrice = bookingData.price || 799
            const totalWithGst = Math.round(basePrice * bookingData.tickets * 1.18)
            const amountInPaise = totalWithGst * 100

            // ── Step 2: Create Razorpay Order on server ───────────────────────
            const orderRes = await fetch('/backend/api/razorpay_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amountInPaise,
                    currency: 'INR',
                    receipt: 'rcpt_' + Date.now(),
                    notes: { name: bookingData.name, email: bookingData.email }
                })
            })
            const orderData = await orderRes.json()
            if (!orderData.success) {
                throw new Error(orderData.message || 'Could not create payment order.')
            }

            const { order_id, key_id } = orderData.data

            // ── Step 3: Open Razorpay Checkout ────────────────────────────────
            await new Promise((resolve, reject) => {
                const options = {
                    key: key_id,
                    amount: amountInPaise,
                    currency: 'INR',
                    name: 'MEDAI',
                    description: `${bookingData.show} — ${bookingData.location}`,
                    order_id: order_id,
                    prefill: {
                        name: bookingData.name,
                        email: bookingData.email,
                        contact: bookingData.phone
                    },
                    theme: { color: '#A78BFA' },
                    modal: {
                        ondismiss: () => reject(new Error('Payment cancelled by user.'))
                    },
                    handler: async (response) => {
                        try {
                            // ── Step 4: Verify payment & save booking ─────────────
                            const verifyRes = await fetch('/backend/api/razorpay_verify.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    // booking details
                                    name: bookingData.name,
                                    email: bookingData.email,
                                    phone: bookingData.phone,
                                    location: bookingData.location,
                                    showTitle: bookingData.show,
                                    eventDate: bookingData.date_full,
                                    eventTime: bookingData.time,
                                    ticketType: bookingData.show === 'Space Booking' ? 'Space Rental' : 'General Admission',
                                    quantity: bookingData.tickets,
                                    totalAmount: totalWithGst,
                                    specialRequests: `Slot: ${bookingData.slot_code || 'N/A'} (${bookingData.duration || ''})`,
                                    purpose: bookingData.purpose,
                                    companyName: bookingData.company_name,
                                    gstNumber: bookingData.gst_number,
                                    billingAddress: bookingData.billing_address,
                                    city: bookingData.city,
                                    state: bookingData.state,
                                    zip: bookingData.zip
                                })
                            })
                            const verifyData = await verifyRes.json()
                            if (verifyData.success) {
                                // 1. Immediate UI update
                                setBookingResponse(verifyData.data)
                                setDirection(1)
                                setStep(5)
                                resolve()

                                // 2. Background Zoho Invoice Generation (IMMEDIATE FEEL)
                                fetch('/backend/api/generate_invoice.php', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ bookingReference: verifyData.data.bookingReference })
                                })
                                    .then(res => res.json())
                                    .then(invData => {
                                        if (invData.success) {
                                            setBookingResponse(prev => ({ ...prev, ...invData.data }))
                                        }
                                    }).catch(e => console.warn('Invoice generation delayed:', e))

                                // 3. Background WhatsApp/SMS notification
                                fetch('/backend/api/send_notification.php', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        phone: bookingData.phone,
                                        name: bookingData.name,
                                        bookingRef: verifyData.data?.bookingReference,
                                        location: bookingData.location,
                                        eventDate: bookingData.date,
                                        eventTime: bookingData.time,
                                        totalAmount: totalWithGst,
                                        invoiceUrl: verifyData.data?.zohoInvoiceUrl || ''
                                    })
                                }).catch(e => console.warn('Notification failed:', e))
                            } else {
                                reject(new Error(verifyData.message || 'Payment verification failed.'))
                            }
                        } catch (err) {
                            reject(err)
                        }
                    }
                }

                // Load Razorpay SDK dynamically if not present
                const loadAndOpen = () => {
                    const rzp = new window.Razorpay(options)
                    rzp.on('payment.failed', (resp) => {
                        reject(new Error(resp.error?.description || 'Payment failed.'))
                    })
                    rzp.open()
                }

                if (window.Razorpay) {
                    loadAndOpen()
                } else {
                    const script = document.createElement('script')
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
                    script.onload = loadAndOpen
                    script.onerror = () => reject(new Error('Could not load Razorpay SDK.'))
                    document.body.appendChild(script)
                }
            })

        } catch (err) {
            console.error('Payment Error:', err)
            if (err.message !== 'Payment cancelled by user.') {
                alert(err.message || 'Payment failed. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
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
            data-lenis-prevent
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
                <div className="flex justify-between items-start mb-8 relative">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black tracking-[0.8em] text-[#A78BFA] uppercase">Step 0{step}</span>
                            <div className="h-px w-12 bg-gradient-to-r from-[#A78BFA]/40 to-transparent" />
                        </div>
                        <h3 className="text-base md:text-lg font-black text-white italic tracking-tighter uppercase">
                            {step === 1 && "The Venue"}
                            {step === 2 && "The Timing"}
                            {step === 3 && "The Identity"}
                            {step === 4 && "The Preview"}
                            {step === 5 && "Payment Confirmed"}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="group p-3 rounded-full border border-white/5 bg-white/5 hover:bg-[#A78BFA] hover:text-black transition-all duration-700"
                    >
                        <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-8 relative"
                            >

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {locations.map(loc => (
                                        <button
                                            key={loc.id}
                                            onClick={() => {
                                                setBookingData({ ...bookingData, location: loc.name, show: 'Space Booking' })
                                                setStep(2)
                                            }}
                                            className={`p-8 rounded-[2.5rem] border text-left transition-all duration-700 relative overflow-hidden group ${bookingData.location === loc.name ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_20px_40px_rgba(167,139,250,0.2)]' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                        >
                                            <div className="relative z-10">
                                                <div className={`text-[9px] font-black tracking-[0.4em] uppercase mb-4 ${bookingData.location === loc.name ? 'text-black/40' : 'text-[#A78BFA]'}`}>Venue Hub</div>
                                                <div className="text-2xl font-black uppercase tracking-tighter mb-1 leading-none">{loc.name}</div>
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 text-6xl font-black opacity-5 italic group-hover:opacity-10 transition-opacity uppercase -rotate-12">Stage</div>
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
                                className="space-y-8 relative"
                            >

                                <div className="space-y-12">
                                    {/* Date Selection */}
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                                        {dates.map((d, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setBookingData(prev => ({ ...prev, date: `${d.num} ${d.month}`, date_full: d.full, time: '' }))}
                                                className={`flex-shrink-0 w-24 p-6 rounded-[2rem] border transition-all duration-700 flex flex-col items-center justify-center gap-1 ${bookingData.date === `${d.num} ${d.month}` ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_15px_30px_rgba(167,139,250,0.2)]' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                            >
                                                <span className={`text-[10px] font-black tracking-widest uppercase ${bookingData.date === `${d.num} ${d.month}` ? 'text-black/50' : 'text-[#A78BFA]/60'}`}>{d.month}</span>
                                                <span className="text-3xl font-black tracking-tighter leading-none">{d.num}</span>
                                                <span className={`text-[10px] font-black tracking-widest uppercase ${bookingData.date === `${d.num} ${d.month}` ? 'text-black/50' : 'text-white/40'}`}>{d.day}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Time Selection - Only if date is selected */}
                                    <AnimatePresence mode="wait">
                                        {bookingData.date && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                            >
                                                {times.map((t, i) => {
                                                    const slot = bookingData.show === 'Space Booking'
                                                        ? (VENUE_SLOTS[selectedLocation] || []).find(s => s.range === t)
                                                        : null

                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                if (slot) {
                                                                    setBookingData(prev => ({
                                                                        ...prev,
                                                                        time: t,
                                                                        slot_code: slot.code,
                                                                        duration: slot.duration,
                                                                        price: slot.price,
                                                                        total: slot.total
                                                                    }))
                                                                } else {
                                                                    setBookingData(prev => ({ ...prev, time: t, price: 799, total: 799 }))
                                                                }
                                                            }}
                                                            className={`p-10 rounded-[2.5rem] border text-left transition-all duration-700 relative overflow-hidden group ${bookingData.time === t ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_20px_40px_rgba(167,139,250,0.2)]' : 'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}`}
                                                        >
                                                            <div className="relative z-10 flex flex-col gap-2">
                                                                {slot && (
                                                                    <div className={`text-[10px] font-black tracking-[0.3em] uppercase ${bookingData.time === t ? 'text-black/40' : 'text-[#A78BFA]'}`}>
                                                                        Slot {slot.code} • {slot.duration}
                                                                    </div>
                                                                )}
                                                                <div className="text-2xl font-black tracking-tighter uppercase leading-none">
                                                                    {t}
                                                                </div>
                                                                {slot && (
                                                                    <div className={`text-sm font-black italic mt-2 ${bookingData.time === t ? 'text-black/60' : 'text-white/40'}`}>
                                                                        Total: ₹{slot.total}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="absolute top-0 right-0 p-8 h-full flex items-center justify-center opacity-0 group-hover:opacity-10 group-hover:translate-x-0 translate-x-4 transition-all duration-700">
                                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                    <button onClick={prevStep} className="text-white/40 hover:text-[#A78BFA] text-[10px] font-black tracking-[0.6em] uppercase transition-colors">BACK</button>
                                    <button
                                        disabled={!bookingData.date || !bookingData.time}
                                        onClick={nextStep}
                                        className="px-14 py-5 bg-[#A78BFA] text-black rounded-full text-[10px] font-extrabold tracking-[0.6em] uppercase hover:scale-105 transition-all disabled:opacity-10 shadow-[0_20px_40px_rgba(167,139,250,0.2)]"
                                    >
                                        CONTINUE
                                    </button>
                                </div>
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
                                className="space-y-8 relative"
                            >

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Full Name</label>
                                            <input
                                                type="text"
                                                value={bookingData.name}
                                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.name ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="Identity Name"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Email</label>
                                            <input
                                                type="email"
                                                value={bookingData.email}
                                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.email ? 'border-red-500' : 'border-white/30 focus:border-[#A711FA]'}`}
                                                placeholder="Nexus@domain.com"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Contact</label>
                                            <input
                                                type="tel"
                                                value={bookingData.phone}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    setBookingData({ ...bookingData, phone: value });
                                                }}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.phone ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="910000000000"
                                            />
                                        </div>

                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-4 block transition-colors">Slot Count</label>
                                            <div className="flex items-center gap-6 bg-white/5 border border-white/10 w-fit p-2 rounded-2xl">
                                                <button
                                                    onClick={() => setBookingData(prev => ({ ...prev, tickets: Math.max(1, prev.tickets - 1) }))}
                                                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#A78BFA] hover:text-black transition-all flex items-center justify-center font-black text-xl"
                                                >
                                                    -
                                                </button>
                                                <span className="text-2xl font-black w-12 text-center text-white">{bookingData.tickets}</span>
                                                <button
                                                    onClick={() => setBookingData(prev => ({ ...prev, tickets: Math.min(10, prev.tickets + 1) }))}
                                                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#A78BFA] hover:text-black transition-all flex items-center justify-center font-black text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Purpose of Booking</label>
                                            <input
                                                type="text"
                                                value={bookingData.purpose}
                                                onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-xl text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase"
                                                placeholder="e.g. Workshop, Training"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Billing Address</label>
                                            <textarea
                                                rows="1"
                                                value={bookingData.billing_address}
                                                onChange={(e) => setBookingData({ ...bookingData, billing_address: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase resize-none ${formErrors.billing_address ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="Street & Area"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group relative">
                                                <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">City</label>
                                                <input
                                                    type="text"
                                                    value={bookingData.city}
                                                    onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                                                    className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.city ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div className="group relative">
                                                <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Zip Code</label>
                                                <input
                                                    type="text"
                                                    value={bookingData.zip}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setBookingData({ ...bookingData, zip: value });
                                                    }}
                                                    className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.zip ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                    placeholder="600001"
                                                />
                                            </div>
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">State</label>
                                            <input
                                                type="text"
                                                value={bookingData.state}
                                                onChange={(e) => setBookingData({ ...bookingData, state: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-xl text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase ${formErrors.state ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="State"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Company Name (Optional)</label>
                                            <input
                                                type="text"
                                                value={bookingData.company_name}
                                                onChange={(e) => setBookingData({ ...bookingData, company_name: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-xl text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase"
                                                placeholder="Nexus Corp"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">GST Number (Optional)</label>
                                            <input
                                                type="text"
                                                value={bookingData.gst_number}
                                                onChange={(e) => setBookingData({ ...bookingData, gst_number: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-xl text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase"
                                                placeholder="33AAAAA0000A1Z5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <button onClick={prevStep} className="text-white/40 hover:text-[#A78BFA] text-[9px] font-black tracking-[0.4em] uppercase">Back</button>
                                    <button onClick={nextStep} className="px-10 py-4 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-3xl">Review Pass</button>
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
                                className="space-y-8 relative"
                            >

                                <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                                        <div className="space-y-2">
                                            <div className="text-[9px] font-black tracking-[0.3em] text-[#A78BFA] uppercase opacity-70">Booking ID</div>
                                            <div className="text-xl font-black text-white font-mono uppercase">MED-{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="text-lg font-black text-white italic tracking-tighter uppercase">MEDAI</div>
                                            <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{bookingData.location} CENTER</div>
                                        </div>
                                    </div>

                                    {/* Billing & Event Grid */}
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-5">
                                            <div className="space-y-1.5">
                                                <span className="text-[8px] font-black tracking-[0.3em] text-[#A78BFA] uppercase block opacity-70">Client Details</span>
                                                <div className="text-base font-black text-white uppercase">{bookingData.name}</div>
                                                <div className="text-[11px] font-bold text-white/40">{bookingData.email}</div>
                                                <div className="text-[11px] font-bold text-white/40">{bookingData.phone}</div>
                                            </div>
                                            {(bookingData.company_name || bookingData.gst_number) && (
                                                <div className="space-y-2 pt-2 border-t border-white/5">
                                                    <span className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA] uppercase block">Company Details</span>
                                                    <div className="text-sm font-black text-white uppercase">{bookingData.company_name || 'Individual'}</div>
                                                    {bookingData.gst_number && <div className="text-xs font-bold text-white/50 font-mono">GST: {bookingData.gst_number}</div>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-1.5">
                                                <span className="text-[8px] font-black tracking-[0.3em] text-[#A78BFA] uppercase block opacity-70">Date & Time</span>
                                                <div className="text-base font-black text-white uppercase">{bookingData.date}</div>
                                                <div className="text-xs font-bold text-white/60">{bookingData.time}</div>
                                            </div>
                                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                                                <span className="text-[8px] font-black tracking-[0.3em] text-[#A78BFA] uppercase block opacity-70">Billing Address</span>
                                                <div className="text-[11px] font-bold text-white/50 leading-tight uppercase">
                                                    {bookingData.billing_address}<br />
                                                    {bookingData.city}, {bookingData.state} - {bookingData.zip}
                                                </div>
                                            </div>
                                            {bookingData.slot_code && (
                                                <div className="space-y-1 pt-2 border-t border-white/5">
                                                    <span className="text-[8px] font-black tracking-[0.3em] text-[#A78BFA] uppercase block opacity-70">Slot Statistics</span>
                                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">
                                                        CODE: {bookingData.slot_code} • {bookingData.duration}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Financial Ledger */}
                                    <div className="space-y-3 pt-8 border-t border-white/10 relative">
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Base Price ({bookingData.tickets} Slot)</span>
                                            <span className="text-base font-black text-white tracking-tight">₹{((bookingData.price || 799) * bookingData.tickets).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span className="text-[9px] font-black tracking-widest text-[#A78BFA] uppercase">GST (18%)</span>
                                            <span className="text-base font-black text-white tracking-tight">₹{Math.round(((bookingData.price || 799) * bookingData.tickets) * 0.18).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 mt-2 border-t-2 border-dashed border-white/10 px-2 py-2">
                                            <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">Final Total</span>
                                            <span className="text-3xl font-black text-[#A78BFA] tracking-tighter leading-none glow-text">
                                                ₹{Math.round(((bookingData.price || 799) * bookingData.tickets) * 1.18).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Notch Decorations */}
                                    <div className="absolute top-1/2 left-0 -translate-x-1/2 w-8 h-12 bg-[#030303] rounded-full border-r border-white/10" />
                                    <div className="absolute top-1/2 right-0 translate-x-1/2 w-8 h-12 bg-[#030303] rounded-full border-l border-white/10" />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <button
                                        onClick={prevStep}
                                        disabled={isSubmitting}
                                        className="flex-1 py-5 border border-white/5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase text-white/40 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Modify Data
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={isSubmitting}
                                        className="flex-[2] py-5 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.5em] uppercase hover:scale-[1.02] transition-all shadow-3xl flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                Pay ₹{Math.round((bookingData.price || 799) * bookingData.tickets * 1.18).toLocaleString()} via Razorpay
                                            </>
                                        )}
                                    </button>
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
                                className="flex flex-col items-center py-2 space-y-6 w-full max-w-4xl relative"
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
                                            Ticket Number : {bookingResponse?.bookingReference || 'TRANSMITTING...'}
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
                                                    {bookingData.show || 'MEDAI PERFORMANCE'}
                                                </h1>
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
                                                    ADMIT {bookingData.tickets} {bookingData.tickets > 1 ? 'SLOTS' : 'SLOT'}
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

                                {/* Invoice Actions */}
                                {bookingResponse?.zohoInvoiceId ? (
                                    <div className="flex flex-col items-center gap-3 w-full animate-in fade-in duration-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <div className="text-[9px] font-black tracking-[0.4em] text-green-400 uppercase italic">Invoice Generated</div>
                                        </div>
                                        <div className="flex gap-3 w-full max-w-sm">
                                            {/* Download Invoice PDF */}
                                            <a
                                                href={bookingResponse.invoiceDownloadPath}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#A78BFA] text-black rounded-2xl text-[9px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-[0_10px_30px_rgba(167,139,250,0.3)]"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Download Invoice
                                            </a>
                                            {/* View in Zoho Portal */}
                                            {bookingResponse.zohoInvoiceUrl && (
                                                <a
                                                    href={bookingResponse.zohoInvoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#A78BFA]/30 bg-[#A78BFA]/5 text-[#A78BFA] rounded-2xl text-[9px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View Invoice
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-[8px] text-white/20 font-medium tracking-widest">
                                            Invoice also sent to {bookingData.email}
                                        </div>
                                    </div>
                                ) : bookingResponse ? (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-[#A78BFA]/20 border-t-[#A78BFA] animate-spin" />
                                            <div className="text-[9px] font-black tracking-[0.3em] text-[#A78BFA] uppercase animate-pulse">
                                                Finalizing Official Invoice...
                                            </div>
                                        </div>
                                        <div className="text-[8px] text-white/20 font-medium tracking-widest text-center mt-1">
                                            Please wait a moment while we synchronize with Zoho
                                        </div>
                                    </div>
                                ) : null}

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
                                                ctx.fillText('TICKET NUMBER : ' + (bookingResponse?.bookingReference || 'MEDAI-XXXXXX'), 0, 0);
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
                                            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEDAI-PASS-${bookingResponse?.bookingReference || bookingData.name}`;
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
