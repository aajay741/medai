import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// ─── helpers ──────────────────────────────────────────────────────────────────
const currentYear = new Date().getFullYear()


const STATUS_STYLES = {
    confirmed: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
    pending: 'bg-amber-500/20 border-amber-500/40 text-amberald-400',
    cancelled: 'bg-red-500/20 border-red-500/40 text-red-400',
}

// Fixed select style — dark bg so option text is always legible
const SELECT_CLS =
    'bg-[#1a1025] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all appearance-none cursor-pointer w-full'

// ─── stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, gradient }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="rounded-2xl p-5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)' }}
    >
        <div className={`absolute inset-0 opacity-10 ${gradient}`} />
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">{title}</p>
        <p className="text-3xl font-black text-white mb-0.5">{value ?? '—'}</p>
        {subtitle && <p className="text-white/30 text-xs">{subtitle}</p>}
    </motion.div>
)

// ─── main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({
        location: '',
        status: '',
        search: '',
        fromDate: '',
        toDate: '',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [siteSettings, setSiteSettings] = useState({ contact_email: '', contact_phone: '' })
    const [updatingSettings, setUpdatingSettings] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
        fetchDashboardData()
        fetchSiteSettings()
    }, [])

    useEffect(() => {
        fetchBookings()
    }, [currentPage, filter])

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token')
        if (!token) { navigate('/admin/login'); return }
        try {
            const res = await fetch('/backend/api/auth.php', { credentials: 'include' })
            const data = await res.json()
            if (!data.success) navigate('/admin/login')
        } catch { navigate('/admin/login') }
    }

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/backend/api/dashboard.php')
            const data = await res.json()
            if (data.success) setStats(data.data.statistics)
        } catch (err) { console.error(err) }
    }

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: currentPage, limit: 20 })
            if (filter.location) params.append('location', filter.location)
            if (filter.status) params.append('status', filter.status)
            if (filter.search) params.append('search', filter.search)
            if (filter.fromDate) params.append('fromDate', filter.fromDate)
            if (filter.toDate) params.append('toDate', filter.toDate)

            const res = await fetch(`/backend/api/bookings.php?${params}`)
            const data = await res.json()
            if (data.success) setBookings(data.data.bookings)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const handleLogout = async () => {
        await fetch('/backend/api/auth.php', { method: 'DELETE', credentials: 'include' })
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        navigate('/admin/login')
    }

    const updateBookingStatus = async (id, status) => {
        try {
            const res = await fetch('/backend/api/bookings.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            })
            const data = await res.json()
            if (data.success) fetchBookings()
        } catch (err) { console.error(err) }
    }

    const deleteBooking = async (id) => {
        if (!confirm('Delete this booking?')) return
        try {
            const res = await fetch(`/backend/api/bookings.php?id=${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) fetchBookings()
        } catch (err) { console.error(err) }
    }

    const fetchSiteSettings = async () => {
        try {
            const res = await fetch('/backend/api/site_settings.php')
            const data = await res.json()
            if (data.success) setSiteSettings(data.data)
        } catch (err) { console.error(err) }
    }

    const saveSiteSettings = async (e) => {
        e.preventDefault()
        setUpdatingSettings(true)
        try {
            const res = await fetch('/backend/api/site_settings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteSettings),
            })
            const data = await res.json()
            if (data.success) {
                setSettingsSaved(true)
                setTimeout(() => setSettingsSaved(false), 3000)
            } else {
                alert('Update failed: ' + data.message)
            }
        } catch { alert('Error updating settings') }
        finally { setUpdatingSettings(false) }
    }

    const resetFilters = () => {
        setFilter({ location: '', status: '', search: '', fromDate: '', toDate: '' })
        setCurrentPage(1)
    }

    const activeFilterCount = [filter.location, filter.status, filter.search, filter.fromDate, filter.toDate]
        .filter(Boolean).length

    // ── render ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050308] via-[#0b0716] to-[#120a1f] text-white">

            {/* ── Top Nav Bar ── */}
            <header className="sticky top-0 z-50 bg-[#08050f]/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

                    {/* Logo / Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center font-black text-black text-sm">M</div>
                        <div>
                            <h1 className="font-black text-base leading-none">MEDAI Admin</h1>
                            <p className="text-[10px] text-[#A78BFA]/70 hidden sm:block">Booking Management</p>
                        </div>
                    </div>

                    {/* Desktop Nav Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <NavBtn onClick={() => navigate('/admin/events')} label="Events" />
                        <NavBtn onClick={() => navigate('/admin/gallery')} label="Gallery" />
                        <NavBtn onClick={() => navigate('/admin/users')} label="Users" />
                        <NavBtn onClick={() => navigate('/admin/calendar')} label="Calendar" />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm bg-red-500/15 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all font-semibold ml-2"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-all"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden border-t border-white/10 bg-[#08050f]"
                        >
                            <div className="px-4 py-3 flex flex-col gap-2">
                                <MobileNavBtn onClick={() => { navigate('/admin/events'); setMobileMenuOpen(false) }} label="Manage Events" />
                                <MobileNavBtn onClick={() => { navigate('/admin/gallery'); setMobileMenuOpen(false) }} label="Manage Gallery" />
                                <MobileNavBtn onClick={() => { navigate('/admin/users'); setMobileMenuOpen(false) }} label="Manage Users" />
                                <MobileNavBtn onClick={() => { navigate('/admin/calendar'); setMobileMenuOpen(false) }} label="Booking Calendar" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all font-semibold"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10 space-y-6">

                {/* ── Stat Cards ── */}
                {stats && (
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard title="Total Bookings" value={stats.total_bookings} subtitle="All time" gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
                        <StatCard title="Total Revenue" value={`₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`} subtitle="All time" gradient="bg-gradient-to-br from-emerald-500 to-teal-700" />
                        <StatCard title="Today" value={stats.today_bookings} subtitle="New bookings" gradient="bg-gradient-to-br from-sky-500 to-blue-700" />
                        <StatCard title="This Month" value={stats.this_month_bookings} subtitle="Monthly bookings" gradient="bg-gradient-to-br from-pink-500 to-rose-700" />
                    </section>
                )}

                {/* ── Site Settings ── */}
                <section className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5 sm:p-7">
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#A78BFA] mb-5 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#A78BFA]/20 flex items-center justify-center text-[#A78BFA] text-xs">⚙</span>
                        Contact Settings
                    </h2>
                    <form onSubmit={saveSiteSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">General Email</label>
                            <input
                                type="email"
                                value={siteSettings.contact_email || ''}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                                className="w-full bg-[#1a1025] border border-white/15 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all"
                                placeholder="info@medai.org"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">General Phone</label>
                            <input
                                type="text"
                                value={siteSettings.contact_phone || ''}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                                className="w-full bg-[#1a1025] border border-white/15 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={updatingSettings}
                            className="h-[46px] bg-[#A78BFA] hover:bg-white text-black rounded-lg font-black text-xs tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {updatingSettings
                                ? 'Saving…'
                                : settingsSaved
                                    ? '✓ Saved!'
                                    : 'Update Details'}
                        </button>
                    </form>
                </section>

                {/* ── Filters ── */}
                <section className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                            🔍 Filter Bookings
                            {activeFilterCount > 0 && (
                                <span className="bg-[#A78BFA] text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </h2>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="text-xs text-[#A78BFA] hover:text-white font-semibold transition-colors underline underline-offset-2"
                            >
                                Reset all
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        {/* Search */}
                        <div className="lg:col-span-2 relative">
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 ml-1">Search</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Name, email, or reference…"
                                    value={filter.search}
                                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                    className="w-full bg-[#1a1025] border border-white/15 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 ml-1">Location</label>
                            <div className="relative">
                                <select
                                    value={filter.location}
                                    onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                                    className={SELECT_CLS}
                                >
                                    <option value="">All Locations</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Bengaluru">Bengaluru</option>
                                    <option value="Coimbatore">Coimbatore</option>
                                </select>
                                <ChevronIcon />
                            </div>
                        </div>

                        {/* From Date */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 ml-1">From Date</label>
                            <input
                                type="date"
                                value={filter.fromDate}
                                onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
                                className="bg-[#1a1025] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all cursor-pointer w-full"
                            />
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 ml-1">To Date</label>
                            <input
                                type="date"
                                value={filter.toDate}
                                onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
                                className="bg-[#1a1025] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all cursor-pointer w-full"
                            />
                        </div>

                        {/* Status */}
                        <div className="sm:col-span-1 lg:col-start-5">
                            <label className="block text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2 ml-1">Status</label>
                            <div className="relative">
                                <select
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                    className={SELECT_CLS}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <ChevronIcon />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Bookings ── */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
                            Bookings {!loading && `(${bookings.length})`}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 disabled:opacity-30 transition-all"
                            >← Prev</button>
                            <span className="px-3 py-1.5 text-xs bg-white/5 rounded-lg border border-white/10 text-white/50">
                                Page {currentPage}
                            </span>
                            <button
                                disabled={bookings.length < 20}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 disabled:opacity-30 transition-all"
                            >Next →</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-16 text-center">
                            <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-white/40 text-sm">Loading bookings…</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-16 text-center">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-white/40">No bookings found for the selected filters.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table (hidden on mobile) */}
                            <div className="hidden md:block rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                {['Reference', 'Name', 'Email', 'Location', 'Event Date', 'Tickets', 'Amount', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {bookings.map(b => (
                                                <tr key={b.id} className="hover:bg-white/[0.03] transition-colors">
                                                    <td className="px-5 py-4 font-mono text-[#A78BFA] text-xs whitespace-nowrap">{b.booking_reference}</td>
                                                    <td className="px-5 py-4 text-white font-semibold whitespace-nowrap">{b.name}</td>
                                                    <td className="px-5 py-4 text-white/60 max-w-[180px] truncate">{b.email}</td>
                                                    <td className="px-5 py-4 text-white/80 whitespace-nowrap">{b.location}</td>
                                                    <td className="px-5 py-4 text-white/80 whitespace-nowrap">{b.event_date}</td>
                                                    <td className="px-5 py-4 text-white/80 whitespace-nowrap">{b.quantity} × {b.ticket_type}</td>
                                                    <td className="px-5 py-4 text-emerald-400 font-black whitespace-nowrap">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="relative">
                                                            <select
                                                                value={b.booking_status}
                                                                onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                                                                className={`text-xs px-3 pr-7 py-1.5 rounded-full border font-semibold appearance-none cursor-pointer bg-[#1a1025] ${STATUS_STYLES[b.booking_status] || STATUS_STYLES.pending}`}
                                                            >
                                                                <option value="confirmed">Confirmed</option>
                                                                <option value="pending">Pending</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            <ChevronIcon small />
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <button
                                                            onClick={() => deleteBooking(b.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs px-3 py-1.5 rounded-lg border border-red-500/20 transition-all font-semibold"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards (hidden on desktop) */}
                            <div className="md:hidden space-y-3">
                                {bookings.map(b => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-mono text-[#A78BFA] text-xs mb-0.5">{b.booking_reference}</p>
                                                <p className="text-white font-bold text-base">{b.name}</p>
                                                <p className="text-white/50 text-xs">{b.email}</p>
                                            </div>
                                            <span className="text-emerald-400 font-black text-base whitespace-nowrap">
                                                ₹{Number(b.total_amount).toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <p className="text-white/30 mb-0.5">Location</p>
                                                <p className="text-white font-semibold">{b.location}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <p className="text-white/30 mb-0.5">Event Date</p>
                                                <p className="text-white font-semibold">{b.event_date}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <p className="text-white/30 mb-0.5">Tickets</p>
                                                <p className="text-white font-semibold">{b.quantity} × {b.ticket_type}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <p className="text-white/30 mb-0.5">Payment</p>
                                                <p className="text-white font-semibold capitalize">{b.payment_status}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-1">
                                            <div className="relative flex-1">
                                                <select
                                                    value={b.booking_status}
                                                    onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                                                    className={`w-full text-xs px-3 pr-7 py-2 rounded-xl border font-semibold appearance-none cursor-pointer bg-[#1a1025] ${STATUS_STYLES[b.booking_status] || STATUS_STYLES.pending}`}
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <ChevronIcon small />
                                            </div>
                                            <button
                                                onClick={() => deleteBooking(b.id)}
                                                className="text-red-400 hover:text-red-300 text-xs px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all font-semibold whitespace-nowrap"
                                            >
                                                🗑 Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    )
}

// ── Small reusable components ─────────────────────────────────────────────────
function NavBtn({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 text-sm bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] rounded-lg border border-[#A78BFA]/30 transition-all font-semibold"
        >
            {label}
        </button>
    )
}

function MobileNavBtn({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-3 text-sm bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] rounded-xl border border-[#A78BFA]/20 transition-all font-semibold"
        >
            {label}
        </button>
    )
}

function ChevronIcon({ small = false }) {
    return (
        <svg
            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 ${small ? 'w-3 h-3' : 'w-4 h-4'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    )
}
