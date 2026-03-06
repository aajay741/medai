import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
    confirmed: 'bg-emerald-500',
    pending: 'bg-amber-500',
    cancelled: 'bg-red-500',
    blocked: 'bg-gray-500'
}

export default function AdminCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [selectedLocation, setSelectedLocation] = useState('CHENNAI')
    const [data, setData] = useState({ bookings: [], blocks: [], definitions: [] })
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(null)
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [bulkForm, setBulkForm] = useState({ start: '', end: '', action: 'block', reason: '' })
    const [updating, setUpdating] = useState(false)
    const [blockModal, setBlockModal] = useState(null) // { slotId, slotCode, slotRange, date }
    const [blockReason, setBlockReason] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchCalendarData()
    }, [currentMonth, currentYear, selectedLocation])

    const fetchCalendarData = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/backend/api/admin_calendar_data.php?month=${currentMonth + 1}&year=${currentYear}&location=${selectedLocation}`, { credentials: 'include' })
            const json = await res.json()
            if (json.success) setData(json.data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const handleToggleBlock = async (slotId, date, currentIsBlocked, reason = '') => {
        if (!currentIsBlocked && !reason) {
            // Find slot details to show in modal
            const slot = data.definitions.find(s => s.id === slotId)
            setBlockModal({ slotId, slotCode: slot?.slot_code, slotRange: slot?.slot_range, date })
            setBlockReason('')
            return
        }

        setUpdating(true)
        try {
            const res = await fetch('/backend/api/admin_calendar_data.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slot_id: slotId,
                    date: date,
                    is_blocked: !currentIsBlocked,
                    reason: reason || (currentIsBlocked ? '' : 'Admin Manual Block')
                })
            })
            const json = await res.json()
            if (json.success) {
                fetchCalendarData()
                setBlockModal(null)
            } else {
                alert(json.message)
            }
        } catch (err) { console.error(err) }
        finally { setUpdating(false) }
    }

    const handleBulkAction = async (e) => {
        e.preventDefault()
        setUpdating(true)
        try {
            const res = await fetch('/backend/api/admin_calendar_data.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: selectedLocation,
                    start_date: bulkForm.start,
                    end_date: bulkForm.end,
                    action: bulkForm.action,
                    reason: bulkForm.reason
                })
            })
            const json = await res.json()
            if (json.success) {
                setShowBulkModal(false)
                fetchCalendarData()
            } else alert(json.message)
        } catch (err) { alert('Bulk action failed') }
        finally { setUpdating(false) }
    }

    // Helper: Days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

    const getBookingsForDate = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return data.bookings.filter(b => b.event_date === dateStr)
    }

    const getBlocksForDate = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return data.blocks.filter(b => b.specific_date === dateStr && b.is_blocked == 1)
    }

    return (
        <div className="min-h-screen bg-[#050308] text-white p-6">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">←</button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">BOOKING CALENDAR</h1>
                        <p className="text-xs text-[#A78BFA] font-bold tracking-widest uppercase">Admin Control Panel</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer px-4 appearance-none"
                    >
                        <option value="CHENNAI" className="bg-[#1a1025] text-white">CHENNAI</option>
                        <option value="BENGALURU" className="bg-[#1a1025] text-white">BENGALURU</option>
                        <option value="COIMBATORE" className="bg-[#1a1025] text-white">COIMBATORE</option>
                    </select>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2 px-4">
                        <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) } else setCurrentMonth(m => m - 1) }} className="hover:text-[#A78BFA]">◀</button>
                        <span className="text-xs font-black tracking-widest min-w-[120px] text-center">{monthNames[currentMonth]} {currentYear}</span>
                        <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) } else setCurrentMonth(m => m + 1) }} className="hover:text-[#A78BFA]">▶</button>
                    </div>
                </div>

                <button
                    onClick={() => setShowBulkModal(true)}
                    className="px-6 py-3 bg-[#A78BFA] text-black text-xs font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all"
                >
                    Bulk Actions
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                            <div key={d} className="bg-white/[0.02] p-4 text-center text-[10px] font-black text-white/30 tracking-widest">{d}</div>
                        ))}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-white/[0.01] p-6" />
                        ))}
                        {days.map(d => {
                            const bookings = getBookingsForDate(d)
                            const blocks = getBlocksForDate(d)
                            const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

                            return (
                                <div
                                    key={d}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`relative bg-white/[0.03] p-4 min-h-[120px] cursor-pointer hover:bg-white/[0.07] transition-all group ${selectedDate === dateStr ? 'ring-2 ring-inset ring-[#A78BFA]' : ''}`}
                                >
                                    <span className={`text-sm font-black ${isToday ? 'bg-[#A78BFA] text-black w-6 h-6 flex items-center justify-center rounded-full' : 'text-white/40'}`}>{d}</span>

                                    <div className="mt-2 space-y-1">
                                        {bookings.map(b => (
                                            <div key={b.id} className="h-1.5 w-full rounded-full bg-emerald-500/50" title={`${b.name} - ${b.event_time}`} />
                                        ))}
                                        {blocks.map(b => (
                                            <div key={b.id} className="h-1.5 w-full rounded-full bg-red-500/50" title="ADMIN BLOCKED" />
                                        ))}
                                    </div>

                                    {bookings.length + blocks.length > 0 && (
                                        <span className="absolute bottom-2 right-2 text-[9px] font-black opacity-30">{bookings.length + blocks.length}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-6 px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Confirmed Booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Admin Blocked</span>
                        </div>
                    </div>
                </div>

                {/* Day Details Side Panel */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedDate ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="bg-white/[0.04] border border-white/10 rounded-3xl p-6"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">{new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</h3>
                                        <p className="text-[10px] text-[#A78BFA] font-black tracking-[0.2em] uppercase">{selectedLocation} SLOTS</p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} className="text-white/20 hover:text-white">✕</button>
                                </div>

                                <div className="space-y-4">
                                    {data.definitions.filter(s => s.location === selectedLocation).map(slot => {
                                        const booking = data.bookings.find(b => b.event_date === selectedDate && b.event_time.includes(slot.slot_range))
                                        const block = data.blocks.find(b => b.specific_date === selectedDate && b.slot_id == slot.id)
                                        const isBlocked = block ? block.is_blocked == 1 : false

                                        return (
                                            <div key={slot.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase">{slot.slot_code} / {slot.slot_range}</span>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${booking ? 'bg-emerald-500 text-black' : isBlocked ? 'bg-red-500 text-black' : 'bg-white/10 text-white/50'}`}>
                                                        {booking ? 'Booked' : isBlocked ? 'Blocked' : 'Available'}
                                                    </span>
                                                </div>

                                                {booking ? (
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold">{booking.name}</p>
                                                        <p className="text-[10px] text-white/40 font-mono italic">REF: {booking.booking_reference}</p>
                                                    </div>
                                                ) : isBlocked ? (
                                                    <div className="flex justify-between items-start mt-2">
                                                        <div className="space-y-1">
                                                            <p className="text-[11px] font-black text-red-400 uppercase tracking-tighter">Admin Blocked</p>
                                                            <p className="text-[10px] text-white/30 italic max-w-[150px] line-clamp-2">{block.block_reason || 'Manual Block'}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleBlock(slot.id, selectedDate, true)}
                                                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-emerald-400 text-black rounded-lg hover:bg-white transition-all"
                                                        >
                                                            Unlock
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-xs font-bold text-white/40">₹{slot.base_price}</span>
                                                        <button
                                                            onClick={() => handleToggleBlock(slot.id, selectedDate, isBlocked)}
                                                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        >
                                                            Block Slot
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-20 bg-white/[0.02] border border-dashed border-white/20 rounded-3xl">
                                <span className="text-4xl mb-4">📅</span>
                                <p className="text-xs font-black tracking-widest uppercase">Select a date to view details and manage slots</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bulk Actions Modal */}
            <AnimatePresence>
                {showBulkModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowBulkModal(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-[#0d091a] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase">Bulk Action Controls</h2>
                            <form onSubmit={handleBulkAction} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">From</label>
                                        <input type="date" required value={bulkForm.start} onChange={e => setBulkForm({ ...bulkForm, start: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">To</label>
                                        <input type="date" required value={bulkForm.end} onChange={e => setBulkForm({ ...bulkForm, end: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">Action</label>
                                    <select
                                        value={bulkForm.action}
                                        onChange={e => setBulkForm({ ...bulkForm, action: e.target.value })}
                                        className="w-full bg-[#1a1025] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:ring-0 focus:border-[#A78BFA] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="block" className="bg-[#1a1025] text-white">BLOCK ENTIRE RANGE</option>
                                        <option value="unblock" className="bg-[#1a1025] text-white">UNBLOCK RANGE</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">Reason (Optional)</label>
                                    <input type="text" value={bulkForm.reason} onChange={e => setBulkForm({ ...bulkForm, reason: e.target.value })} placeholder="Maintenance, Private Event, etc." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkModal(false)}
                                        className="flex-1 py-4 text-[10px] font-black tracking-[0.3em] uppercase border border-white/10 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white transition-all underline-offset-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-[1.5] py-4 bg-[#A78BFA] text-black text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl hover:scale-[1.02] hover:bg-white transition-all shadow-[0_20px_40px_rgba(167,139,250,0.2)] disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {updating ? 'Processing...' : 'Execute Action'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Single Slot Block Reason Modal */}
            <AnimatePresence>
                {blockModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setBlockModal(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-[#0d091a] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-xl font-black mb-2 tracking-tighter uppercase line-clamp-1">Block Slot</h2>
                            <p className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest mb-6">
                                {blockModal.slotCode} • {blockModal.slotRange} • {new Date(blockModal.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">Reason for blocking</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={blockReason}
                                        onChange={e => setBlockReason(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleToggleBlock(blockModal.slotId, blockModal.date, false, blockReason)}
                                        placeholder="Private Event, Maintenance, etc."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[#A78BFA] transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setBlockModal(null)}
                                        className="flex-1 py-3.5 text-[10px] font-black tracking-[0.2em] uppercase border border-white/10 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleToggleBlock(blockModal.slotId, blockModal.date, false, blockReason)}
                                        disabled={updating}
                                        className="flex-[1.5] py-3.5 bg-[#A78BFA] text-black text-[10px] font-black tracking-[0.2em] uppercase rounded-xl hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {updating ? 'Processing...' : 'Block Slot'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
