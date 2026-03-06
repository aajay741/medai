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
        times: [], // Array for multiple slots
        slot_codes: [],
        durations: [],
        price_per_slot: 0,
        subtotal: 0,
        gst: 0,
        total: 0,
        tickets: 0, // Will be auto-derived from times.length
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
    const [invoiceStatus, setInvoiceStatus] = useState({ ready: false, invoiceDownloadPath: null, polling: false })
    const invoicePollRef = useRef(null)
    const slotsRef = useRef(null)
    const modalRef = useRef(null)
    const summaryRef = useRef(null)

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [availability, setAvailability] = useState({})
    const [dynamicSlots, setDynamicSlots] = useState([])

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1)
        const days = []
        while (date.getMonth() === month) {
            days.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }
        return days
    }

    // ── Poll for invoice after payment confirmed ──────────────────────────────
    useEffect(() => {
        if (bookingResponse?.bookingReference && !invoiceStatus.ready && !invoiceStatus.polling) {
            setInvoiceStatus(s => ({ ...s, polling: true }))
            const ref = bookingResponse.bookingReference

            // Immediate & High-frequency polling (every 500ms)
            invoicePollRef.current = setInterval(async () => {
                try {
                    const res = await fetch(`/backend/api/get_invoice_status.php?ref=${encodeURIComponent(ref)}`);
                    const data = await res.json();

                    if (data.success && data.data?.ready) {
                        setInvoiceStatus({
                            ready: true,
                            invoiceDownloadPath: data.data.invoiceDownloadPath,
                            polling: false
                        });
                        clearInterval(invoicePollRef.current);

                        // Auto-download once ready
                        const link = document.createElement('a');
                        link.href = data.data.invoiceDownloadPath;
                        link.setAttribute('download', `MEDAI-Invoice-${ref}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                } catch (e) {
                    console.warn('Invoice polling error:', e);
                }
            }, 500);

            return () => clearInterval(invoicePollRef.current);
        }
    }, [bookingResponse, invoiceStatus.ready]);

    useEffect(() => {
        if (step === 5) {
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

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!bookingData.location) return
            try {
                const res = await fetch(`/backend/api/get_availability.php?location=${encodeURIComponent(bookingData.location)}&month=${currentMonth + 1}&year=${currentYear}`)
                const data = await res.json()
                if (data.success) {
                    setAvailability(data.data)
                }
            } catch (err) {
                console.error('Error fetching availability:', err)
            }
        }
        if (isOpen && bookingData.location) fetchAvailability()
    }, [isOpen, bookingData.location, currentMonth, currentYear])

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

    useEffect(() => {
        const fetchSlotsForDate = async () => {
            if (!selectedLocation || !bookingData.date_full) return
            try {
                const res = await fetch(`/backend/api/get_slots.php?location=${encodeURIComponent(selectedLocation)}&date=${bookingData.date_full}`)
                const data = await res.json()
                if (data.success) setDynamicSlots(data.data)
            } catch (err) { console.error('Error fetching slots:', err) }
        }
        if (bookingData.show === 'Space Booking') fetchSlotsForDate()
    }, [selectedLocation, bookingData.date_full, bookingData.show])

    const times = bookingData.show === 'Space Booking'
        ? dynamicSlots.map(s => s.slot_range)
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
                    times: [],
                    slot_codes: [],
                    durations: [],
                    price_per_slot: 0,
                    subtotal: 0,
                    gst: 0,
                    total: 0,
                    tickets: 0
                }))
                setStep(2)
            } else {
                setBookingData(prev => ({ ...prev, location: '', show: '', date: '', date_full: '', times: [] }))
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

            // ── SHADOW PRE-REGISTRATION (EARLY TRIGGER) ─────────────────────
            // We start this process as soon as they click "Review Pass"
            // This saves 2-3 seconds during the final payment confirmation step.
            fetch('/backend/api/pre_register_customer.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: bookingData.name,
                    email: bookingData.email,
                    phone: bookingData.phone,
                    companyName: bookingData.company_name,
                    gstNumber: bookingData.gst_number,
                    billingAddress: bookingData.billing_address,
                    city: bookingData.city,
                    state: bookingData.state,
                    zip: bookingData.zip
                })
            }).catch(e => console.warn('Early Pre-reg warning:', e))
        }
        setDirection(1)
        setStep(s => Math.min(s + 1, 5))
    }

    const handleBooking = async () => {
        setIsSubmitting(true)
        try {
            // ── Step 1: Calculate total amount (paise for Razorpay) ──────────
            const amountInPaise = Math.round(bookingData.total * 100)

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
                                    eventTime: bookingData.times.join(', '),
                                    ticketType: bookingData.show === 'Space Booking' ? 'Space Rental' : 'General Admission',
                                    quantity: bookingData.times.length || 1,
                                    totalAmount: bookingData.total,
                                    unitPrice: bookingData.price_per_slot,
                                    specialRequests: `Slots: ${bookingData.slot_codes.join(', ') || 'N/A'} (${bookingData.durations.join(', ') || ''})`,
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
                            console.log('Payment Verification Response:', verifyData)
                            if (verifyData.success) {
                                // 1. Update invoice status FIRST to prevent race condition in useEffect
                                if (verifyData.data?.invoiceReady) {
                                    setInvoiceStatus({
                                        ready: true,
                                        invoiceDownloadPath: verifyData.data.invoiceDownloadPath,
                                        polling: false
                                    })
                                }

                                // 2. Then set booking response
                                setBookingResponse(verifyData.data)

                                setDirection(1)
                                setStep(5)
                                resolve()

                                // 2. Background WhatsApp/SMS notification
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
                                        totalAmount: bookingData.total,
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
            className="fixed inset-0 z-[200] bg-[#030303]/98 flex items-center justify-center p-2 md:p-8 backdrop-blur-3xl overflow-hidden"
            data-lenis-prevent
            style={{ position: 'fixed' }} // Force non-static position for Framer Motion children
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
                ref={modalRef}
                className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] z-10 overflow-y-auto"
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
                        className="group p-3 rounded-full border border-white/10 bg-white/5 hover:bg-[#A78BFA] hover:text-black transition-all duration-700"
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
                                            className={`p-8 rounded-[2.5rem] border text-left transition-all duration-700 relative overflow-hidden group ${bookingData.location === loc.name ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_20px_40px_rgba(167,139,250,0.2)]' : 'bg-white/[0.03] border-white/10 hover:border-[#A78BFA]/30'}`}
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

                                <div className="space-y-8">
                                    {/* Month Navigation */}
                                    <div className="flex items-center justify-between mb-4 px-4 pb-2 border-b border-white/5">
                                        <button
                                            onClick={() => {
                                                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
                                                else setCurrentMonth(m => m - 1);
                                            }}
                                            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#A78BFA] hover:text-black transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div className="text-center">
                                            <div className="text-[8px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-0.5">Select Date</div>
                                            <div className="text-xl font-black uppercase tracking-tighter">
                                                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
                                                else setCurrentMonth(m => m + 1);
                                            }}
                                            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#A78BFA] hover:text-black transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                            <div key={day} className="text-center text-[9px] font-black text-white/30 py-1">{day}</div>
                                        ))}

                                        {/* Empty cells for start of month */}
                                        {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {getDaysInMonth(currentMonth, currentYear).map((dateObj, i) => {
                                            const dateYear = dateObj.getFullYear()
                                            const dateMonth = String(dateObj.getMonth() + 1).padStart(2, '0')
                                            const dateDay = String(dateObj.getDate()).padStart(2, '0')
                                            const dateFullString = `${dateYear}-${dateMonth}-${dateDay}`

                                            const isToday = new Date().toDateString() === dateObj.toDateString()
                                            const isSelected = bookingData.date_full === dateFullString
                                            const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0))

                                            const d = {
                                                num: dateObj.getDate(),
                                                month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj).toUpperCase(),
                                                day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj).toUpperCase(),
                                                full: dateFullString
                                            }
                                            const dayStatus = availability[d.full]?.status || 'available'

                                            return (
                                                <button
                                                    key={i}
                                                    disabled={isPast || dayStatus === 'full'}
                                                    onClick={() => {
                                                        setBookingData(prev => ({ ...prev, date: `${d.num} ${d.month}`, date_full: d.full, times: [], slot_codes: [], durations: [], total: 0, subtotal: 0, gst: 0, tickets: 0 }))
                                                        setTimeout(() => {
                                                            if (slotsRef.current && modalRef.current) {
                                                                const slotTop = slotsRef.current.offsetTop
                                                                modalRef.current.scrollTo({ top: slotTop - 20, behavior: 'smooth' })
                                                            }
                                                        }, 100)
                                                    }}
                                                    className={`p-1.5 md:p-2 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-0.5 relative overflow-hidden group 
                                                        ${isSelected ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_8px_16px_rgba(167,139,250,0.3)]' :
                                                            dayStatus === 'partial' ? 'bg-orange-500/40 border-orange-500/60 text-white hover:bg-orange-500/50' :
                                                                dayStatus === 'full' ? 'bg-white/10 border-white/10 opacity-40 cursor-not-allowed text-white/40' :
                                                                    'bg-white/5 border-white/5 hover:border-[#A78BFA]/40 text-white/60'}
                                                        ${isPast ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                                                        ${isToday && !isSelected ? 'border-[#A78BFA]/40' : ''}
                                                    `}
                                                >
                                                    <span className="text-lg md:text-xl font-black tracking-tighter leading-none relative z-10">{d.num}</span>
                                                    {isToday && <span className={`text-[7px] font-black absolute bottom-1 ${isSelected ? 'text-black/40' : 'text-[#A78BFA]'}`}>NOW</span>}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Availability Legend */}
                                    <div className="flex flex-wrap items-center gap-6 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10"></div>
                                            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Default - Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500/40 border border-orange-500/60"></div>
                                            <span className="text-[9px] font-black tracking-widest text-orange-400 uppercase">Mild Orange - Partially Booked</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20"></div>
                                            <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">Grey - Fully Booked</span>
                                        </div>
                                    </div>

                                    {/* Time Selection - Only if date is selected */}
                                    <div ref={slotsRef}>
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
                                                        const isSelected = bookingData.times.includes(t)
                                                        const slot = bookingData.show === 'Space Booking'
                                                            ? dynamicSlots.find(s => s.slot_range === t)
                                                            : null

                                                        const isLocked = slot && slot.is_available === false;
                                                        const isPartialDate = availability[bookingData.date_full]?.status === 'partial';

                                                        return (
                                                            <button
                                                                key={i}
                                                                disabled={isLocked}
                                                                onClick={() => {
                                                                    if (isLocked) return;
                                                                    let newTimes = [...bookingData.times]
                                                                    let newCodes = [...bookingData.slot_codes]
                                                                    let newDurations = [...bookingData.durations]

                                                                    if (isSelected) {
                                                                        newTimes = newTimes.filter(item => item !== t)
                                                                        if (slot) {
                                                                            newCodes = newCodes.filter(item => item !== (slot.slot_code || slot.code))
                                                                            newDurations = newDurations.filter(item => item !== slot.duration)
                                                                        }
                                                                    } else {
                                                                        newTimes.push(t)
                                                                        if (slot) {
                                                                            newCodes.push(slot.slot_code || slot.code)
                                                                            newDurations.push(slot.duration)
                                                                        }
                                                                    }

                                                                    const basePricePerSlot = slot ? Number(slot.base_price || slot.price) : 799
                                                                    const subtotal = basePricePerSlot * newTimes.length
                                                                    const gst = Math.round(subtotal * 0.18)
                                                                    const total = subtotal + gst

                                                                    setBookingData(prev => ({
                                                                        ...prev,
                                                                        times: newTimes,
                                                                        slot_codes: newCodes,
                                                                        durations: newDurations,
                                                                        price_per_slot: basePricePerSlot,
                                                                        subtotal: subtotal,
                                                                        gst: gst,
                                                                        total: total,
                                                                        tickets: newTimes.length
                                                                    }))

                                                                    setTimeout(() => {
                                                                        if (summaryRef.current && modalRef.current) {
                                                                            const summaryTop = summaryRef.current.offsetTop
                                                                            modalRef.current.scrollTo({ top: summaryTop - 20, behavior: 'smooth' })
                                                                        }
                                                                    }, 100)
                                                                }}
                                                                className={`p-6 rounded-[2rem] border text-left transition-all duration-700 relative overflow-hidden group 
                                                                ${isSelected ? 'bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_15px_30px_rgba(167,139,250,0.2)]' :
                                                                        isLocked ? 'bg-white/10 border-white/5 opacity-40 cursor-not-allowed grayscale' :
                                                                            'bg-white/5 border-white/5 hover:border-[#A78BFA]/30'}
                                                            `}
                                                            >
                                                                <div className="relative z-10 flex flex-col gap-1">
                                                                    {slot && (
                                                                        <div className={`text-[9px] font-black tracking-[0.3em] uppercase ${isSelected ? 'text-black/40' : isLocked ? 'text-white/20' : 'text-[#A78BFA]'}`}>
                                                                            Slot {slot.slot_code || slot.code} • {slot.duration}
                                                                        </div>
                                                                    )}
                                                                    <div className={`text-xl font-black tracking-tighter uppercase leading-none ${isLocked ? 'text-white/30' : ''}`}>
                                                                        {t}
                                                                    </div>
                                                                    {slot && (
                                                                        <div className={`text-[10px] font-black italic mt-1 ${isSelected ? 'text-black/60' : isLocked ? 'text-white/20' : 'text-white/40'}`}>
                                                                            {isLocked ? (slot.reason || 'Booked') : `Rate: ₹${Number(slot.base_price || slot.price).toLocaleString('en-IN')}`}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!isLocked && (
                                                                    <div className="absolute top-0 right-0 p-8 h-full flex items-center justify-center opacity-0 group-hover:opacity-10 group-hover:translate-x-0 translate-x-4 transition-all duration-700">
                                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Step 02 Booking Summary */}
                                    {bookingData.times.length > 0 && (
                                        <div ref={summaryRef} className="mt-8 p-8 rounded-[2.5rem] bg-[#A78BFA]/5 border border-[#A78BFA]/20 space-y-6">
                                            <div className="flex justify-between items-end border-b border-[#A78BFA]/10 pb-4">
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black tracking-[0.4em] text-[#A78BFA] uppercase">Selection Summary</div>
                                                    <div className="text-lg font-black text-white italic tracking-tighter uppercase">{bookingData.date}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-[#A78BFA] opacity-60">SELECTED SLOTS</div>
                                                    <div className="text-sm font-black text-white">{bookingData.times.length} Slots</div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {bookingData.times.map((t, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"></div>
                                                            <span className="font-medium text-white/70 uppercase">Slot: {t}</span>
                                                        </div>
                                                        <span className="font-black text-white/50">₹{bookingData.price_per_slot}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-4 border-t border-[#A78BFA]/10 space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-white/40 uppercase">
                                                    <span>Subtotal</span>
                                                    <span>₹{bookingData.subtotal}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-white/40 uppercase">
                                                    <span>GST (18%)</span>
                                                    <span>₹{bookingData.gst}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-[11px] font-black tracking-[0.3em] text-[#A78BFA] uppercase">Final Payable Amount</span>
                                                    <span className="text-2xl font-black text-white tracking-tighter">₹{bookingData.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                        <button onClick={prevStep} className="text-white/40 hover:text-[#A78BFA] text-[10px] font-black tracking-[0.6em] uppercase transition-colors">BACK</button>
                                        <button
                                            disabled={!bookingData.date || bookingData.times.length === 0}
                                            onClick={nextStep}
                                            className="px-14 py-5 bg-[#A78BFA] text-black rounded-full text-[10px] font-extrabold tracking-[0.6em] uppercase hover:scale-105 transition-all disabled:opacity-10 shadow-[0_20px_40px_rgba(167,139,250,0.2)]"
                                        >
                                            CONTINUE
                                        </button>
                                    </div>
                                </div>{/* end space-y-8 */}
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
                                                className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.name ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="Identity Name"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Email</label>
                                            <input
                                                type="email"
                                                value={bookingData.email}
                                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                                className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.email ? 'border-red-500' : 'border-white/30 focus:border-[#A711FA]'}`}
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
                                                className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.phone ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="910000000000"
                                            />
                                        </div>

                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Purpose of Booking</label>
                                            <input
                                                type="text"
                                                value={bookingData.purpose}
                                                onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal"
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
                                                className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal resize-none ${formErrors.billing_address ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
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
                                                    className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.city ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
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
                                                    className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.zip ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
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
                                                className={`w-full bg-transparent border-b py-3 text-lg text-white focus:outline-none transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal ${formErrors.state ? 'border-red-500' : 'border-white/30 focus:border-[#A78BFA]'}`}
                                                placeholder="State"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">Company Name (Optional)</label>
                                            <input
                                                type="text"
                                                value={bookingData.company_name}
                                                onChange={(e) => setBookingData({ ...bookingData, company_name: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal"
                                                placeholder="Nexus Corp"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[12px] font-black tracking-[0.4em] text-[#A78BFA] uppercase mb-2 block transition-colors">GST Number (Optional)</label>
                                            <input
                                                type="text"
                                                value={bookingData.gst_number}
                                                onChange={(e) => setBookingData({ ...bookingData, gst_number: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:font-medium placeholder:text-white/20 uppercase !leading-normal"
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
                                            <span className="text-base font-black text-white tracking-tight">₹{bookingData.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span className="text-[9px] font-black tracking-widest text-[#A78BFA] uppercase">GST (18%)</span>
                                            <span className="text-base font-black text-white tracking-tight">₹{bookingData.gst.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 mt-2 border-t-2 border-dashed border-white/10 px-2 py-2">
                                            <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">Final Total</span>
                                            <span className="text-3xl font-black text-[#A78BFA] tracking-tighter leading-none glow-text">
                                                ₹{bookingData.total.toLocaleString()}
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
                                                Pay ₹{bookingData.total.toLocaleString()} via Razorpay
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
                                className="flex flex-col items-center py-10 space-y-8 w-full max-w-lg mx-auto text-center relative"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 rounded-full bg-[#A78BFA] mx-auto flex items-center justify-center text-black shadow-[0_0_40px_rgba(167,139,250,0.4)]"
                                    >
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                        Booking Confirmed
                                    </h2>
                                    <p className="text-[#A78BFA] text-xs font-black tracking-[0.4em] uppercase">
                                        Reference: {bookingResponse?.bookingReference || 'Processing...'}
                                    </p>
                                </div>

                                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                                    Your slots have been secured. A confirmation with your booking details has been sent to <span className="text-white font-bold">{bookingData.email}</span>.
                                </p>

                                <div className="flex flex-col w-full gap-4 pt-6">
                                    {/* Download Official Invoice Button ONLY */}
                                    <button
                                        onClick={() => {
                                            const ref = bookingResponse?.bookingReference;
                                            if (invoiceStatus.ready && invoiceStatus.invoiceDownloadPath) {
                                                window.open(invoiceStatus.invoiceDownloadPath, '_blank');
                                            } else {
                                                // If not ready yet, we use the fallback route that supports polling
                                                window.open(`/backend/api/invoice_download.php?ref=${encodeURIComponent(ref)}`, '_blank');
                                            }
                                        }}
                                        className={`w-full flex items-center justify-center gap-4 py-6 rounded-[2rem] border transition-all transform hover:scale-[1.02] bg-[#A78BFA] border-[#A78BFA] text-black shadow-[0_20px_40px_rgba(167,139,250,0.2)] cursor-pointer hover:bg-white hover:shadow-none`}
                                    >
                                        {invoiceStatus.polling && !invoiceStatus.ready ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                <span className="text-[10px] font-black tracking-widest uppercase">Preparing Invoice...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-[11px] font-black tracking-widest uppercase">Download Official Invoice</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        Return to Home
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    )
}

