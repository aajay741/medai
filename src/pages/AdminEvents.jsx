import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function AdminEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [uploading, setUploading] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: 'Chennai',
        venue_name: '',
        venue_address: '',
        event_date: '',
        event_time: '',
        end_time: '',
        category: 'Performance',
        image_url: '',
        total_seats: 100,
        status: 'upcoming',
        featured: false,
        ticket_types: [
            { type: 'General Admission', price: 500, description: 'Standard seating' }
        ]
    })

    useEffect(() => {
        checkAuth()
        fetchEvents()
    }, [])

    const checkAuth = () => {
        const token = localStorage.getItem('admin_token')
        if (!token) navigate('/admin/login')
    }

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const response = await fetch('/backend/api/events.php?admin=1')
            const data = await response.json()
            if (data.success) {
                setEvents(data.data)
            }
        } catch (err) {
            console.error('Error fetching events:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const response = await fetch('/backend/api/upload.php', {
                method: 'POST',
                body: formDataUpload
            })
            const data = await response.json()
            if (data.success) {
                setFormData(prev => ({ ...prev, image_url: data.data.url }))
            } else {
                alert(data.message)
            }
        } catch (err) {
            console.error('Error uploading file:', err)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = '/backend/api/events.php'
            const method = editingEvent ? 'PUT' : 'POST'
            const payload = editingEvent ? { ...formData, id: editingEvent.id } : formData

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            if (data.success) {
                setShowModal(false)
                setEditingEvent(null)
                resetForm()
                fetchEvents()
            }
        } catch (err) {
            console.error('Error saving event:', err)
        }
    }

    const handleEdit = (event) => {
        setEditingEvent(event)
        setFormData({
            title: event.title,
            description: event.description || '',
            location: event.location,
            venue_name: event.venue_name || '',
            venue_address: event.venue_address || '',
            event_date: event.event_date,
            event_time: event.event_time,
            end_time: event.end_time || '',
            category: event.category || 'Performance',
            image_url: event.image_url || '',
            total_seats: event.total_seats,
            status: event.status,
            featured: event.featured === 1,
            ticket_types: event.ticket_types || []
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return

        try {
            const response = await fetch(`/backend/api/events.php?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                fetchEvents()
            }
        } catch (err) {
            console.error('Error deleting event:', err)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: 'Chennai',
            venue_name: '',
            venue_address: '',
            event_date: '',
            event_time: '',
            end_time: '',
            category: 'Performance',
            image_url: '',
            total_seats: 100,
            status: 'upcoming',
            featured: false,
            ticket_types: [{ type: 'General Admission', price: 500, description: 'Standard seating' }]
        })
    }

    const addTicketType = () => {
        setFormData({
            ...formData,
            ticket_types: [...formData.ticket_types, { type: '', price: 0, description: '' }]
        })
    }

    const updateTicketType = (index, field, value) => {
        const newTicketTypes = [...formData.ticket_types]
        newTicketTypes[index][field] = field === 'price' ? parseFloat(value) : value
        setFormData({ ...formData, ticket_types: newTicketTypes })
    }

    const removeTicketType = (index) => {
        const newTicketTypes = formData.ticket_types.filter((_, i) => i !== index)
        setFormData({ ...formData, ticket_types: newTicketTypes })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#1a0a1a] pt-32 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Event Management</h1>
                        <p className="text-[#A78BFA]">Create and manage MEDAI events</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => {
                                resetForm()
                                setEditingEvent(null)
                                setShowModal(true)
                            }}
                            className="px-6 py-2 bg-[#A78BFA] hover:bg-[#9370DB] text-black font-bold rounded-lg transition-all"
                        >
                            + Create Event
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center text-white/50 py-12">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="col-span-full text-center text-white/50 py-12">No events found</div>
                ) : (
                    events.map((event) => (
                        <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                        >
                            {event.image_url && (
                                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.image_url})` }} />
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                                    {event.featured === 1 && (
                                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs rounded">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <p className="text-white/60 text-sm mb-4 line-clamp-2">{event.description}</p>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <span>📍</span>
                                        <span>{event.location} - {event.venue_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <span>📅</span>
                                        <span>{event.event_date} at {event.event_time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <span>🎫</span>
                                        <span>{event.available_seats}/{event.total_seats} seats available</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs ${event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                                        event.status === 'ongoing' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                            event.status === 'completed' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50' :
                                                'bg-red-500/20 text-red-400 border border-red-500/50'
                                        }`}>
                                        {event.status}
                                    </span>
                                    {event.is_active === 0 && (
                                        <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/50">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 px-4 py-2 bg-[#A78BFA]/20 hover:bg-[#A78BFA]/30 text-[#A78BFA] rounded-lg border border-[#A78BFA]/50 transition-all text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition-all text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] overflow-y-auto flex items-start justify-center p-4 md:p-10"
                    data-lenis-prevent
                >
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-10 max-w-4xl w-full my-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-black text-white">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setEditingEvent(null)
                                    resetForm()
                                }}
                                className="text-white/40 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Event Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Location *</label>
                                    <select
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA] appearance-none"
                                        required
                                    >
                                        <option value="Chennai" className="bg-[#1a1a1a]">Chennai</option>
                                        <option value="Bengaluru" className="bg-[#1a1a1a]">Bengaluru</option>
                                        <option value="Coimbatore" className="bg-[#1a1a1a]">Coimbatore</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Venue Name</label>
                                    <input
                                        type="text"
                                        value={formData.venue_name}
                                        onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-white/70 text-sm mb-2">Event Image</label>
                                    <div className={`relative h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center ${formData.image_url ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                                        {formData.image_url ? (
                                            <>
                                                <img src={formData.image_url} alt="Preview" className="h-full w-full object-contain rounded-lg mb-2" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image_url: '' })}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-2xl mb-1">🖼️</div>
                                                <p className="text-white/40 text-xs mb-2">{uploading ? 'Uploading...' : 'Click or Drag to upload image'}</p>
                                                <input
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    disabled={uploading}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Event Date *</label>
                                    <input
                                        type="date"
                                        value={formData.event_date}
                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Event Time *</label>
                                    <input
                                        type="text"
                                        value={formData.event_time}
                                        onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                                        placeholder="7:00 PM"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Total Seats</label>
                                    <input
                                        type="number"
                                        value={formData.total_seats}
                                        onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA] appearance-none"
                                    >
                                        <option value="upcoming" className="bg-[#1a1a1a]">Upcoming</option>
                                        <option value="ongoing" className="bg-[#1a1a1a]">Ongoing</option>
                                        <option value="completed" className="bg-[#1a1a1a]">Completed</option>
                                        <option value="cancelled" className="bg-[#1a1a1a]">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Venue Address</label>
                                <textarea
                                    value={formData.venue_address}
                                    onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA]"
                                />
                            </div>

                            {/* Ticket Types */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-white/70 text-sm">Ticket Types *</label>
                                    <button
                                        type="button"
                                        onClick={addTicketType}
                                        className="px-3 py-1 bg-[#A78BFA]/20 text-[#A78BFA] text-sm rounded border border-[#A78BFA]/50"
                                    >
                                        + Add Type
                                    </button>
                                </div>

                                {formData.ticket_types.map((ticket, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Type (e.g., VIP)"
                                            value={ticket.type}
                                            onChange={(e) => updateTicketType(index, 'type', e.target.value)}
                                            className="col-span-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A78BFA]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={ticket.price}
                                            onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                                            className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A78BFA]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={ticket.description}
                                            onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                                            className="col-span-6 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A78BFA]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(index)}
                                            className="col-span-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="featured" className="text-white/70 text-sm">Featured Event</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#A78BFA] hover:bg-[#9370DB] text-black font-bold rounded-lg transition-all"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingEvent(null)
                                        resetForm()
                                    }}
                                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
