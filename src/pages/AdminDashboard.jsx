import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({ location: '', status: '', search: '' })
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
        fetchDashboardData()
        fetchBookings()
    }, [currentPage, filter])

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token')
        if (!token) {
            navigate('/admin/login')
            return
        }

        try {
            const response = await fetch('/backend/api/auth.php', {
                credentials: 'include'
            })
            const data = await response.json()
            if (!data.success) {
                navigate('/admin/login')
            }
        } catch (err) {
            navigate('/admin/login')
        }
    }

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/backend/api/dashboard.php')
            const data = await response.json()
            if (data.success) {
                setStats(data.data.statistics)
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        }
    }

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...filter
            })
            const response = await fetch(`/backend/api/bookings.php?${params}`)
            const data = await response.json()
            if (data.success) {
                setBookings(data.data.bookings)
            }
        } catch (err) {
            console.error('Error fetching bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await fetch('/backend/api/auth.php', {
            method: 'DELETE',
            credentials: 'include'
        })
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        navigate('/admin/login')
    }

    const updateBookingStatus = async (id, status) => {
        try {
            const response = await fetch('/backend/api/bookings.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })
            const data = await response.json()
            if (data.success) {
                fetchBookings()
            }
        } catch (err) {
            console.error('Error updating booking:', err)
        }
    }

    const deleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return

        try {
            const response = await fetch(`/backend/api/bookings.php?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                fetchBookings()
            }
        } catch (err) {
            console.error('Error deleting booking:', err)
        }
    }

    const StatCard = ({ title, value, subtitle, color = "purple" }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
            <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">{title}</h3>
            <p className={`text-4xl font-black text-${color}-400 mb-1`}>{value}</p>
            {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#1a0a1a] pt-32 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">MEDAI Admin</h1>
                        <p className="text-[#A78BFA]">Booking Management Dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin/events')}
                            className="px-6 py-2 bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] rounded-lg border border-[#A78BFA]/50 transition-all font-bold"
                        >
                            Manage Events
                        </button>
                        <button
                            onClick={() => navigate('/admin/gallery')}
                            className="px-6 py-2 bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] rounded-lg border border-[#A78BFA]/50 transition-all font-bold"
                        >
                            Manage Gallery
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Bookings" value={stats.total_bookings} subtitle="All time" />
                    <StatCard title="Total Revenue" value={`₹${stats.total_revenue?.toLocaleString()}`} subtitle="All time" color="green" />
                    <StatCard title="Today" value={stats.today_bookings} subtitle="New bookings" color="blue" />
                    <StatCard title="This Month" value={stats.this_month_bookings} subtitle="Monthly bookings" color="pink" />
                </div>
            )}

            {/* Filters */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, email, or reference..."
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#A78BFA]"
                        />
                        <select
                            value={filter.location}
                            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#A78BFA]"
                        >
                            <option value="">All Locations</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Coimbatore">Coimbatore</option>
                        </select>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#A78BFA]"
                        >
                            <option value="">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Event Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Tickets</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-white/50">
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-white/50">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[#A78BFA] font-mono">{booking.booking_reference}</td>
                                            <td className="px-6 py-4 text-sm text-white">{booking.name}</td>
                                            <td className="px-6 py-4 text-sm text-white/70">{booking.email}</td>
                                            <td className="px-6 py-4 text-sm text-white">{booking.location}</td>
                                            <td className="px-6 py-4 text-sm text-white">{booking.event_date}</td>
                                            <td className="px-6 py-4 text-sm text-white">{booking.quantity} × {booking.ticket_type}</td>
                                            <td className="px-6 py-4 text-sm text-green-400 font-bold">₹{booking.total_amount}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={booking.booking_status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                    className={`text-xs px-3 py-1 rounded-full border ${booking.booking_status === 'confirmed'
                                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                        : booking.booking_status === 'pending'
                                                            ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                                            : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                        }`}
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => deleteBooking(booking.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
