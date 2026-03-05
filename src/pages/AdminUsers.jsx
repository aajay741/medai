import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ROLE_STYLES = {
    admin: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
    manager: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    viewer: 'bg-white/10 border-white/20 text-white/60',
}

const SELECT_CLS =
    'bg-[#1a1025] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#A78BFA] transition-all appearance-none cursor-pointer w-full'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(null) // 'add' or 'edit'
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'viewer'
    })
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
        fetchUsers()
    }, [])

    const checkAuth = () => {
        const token = localStorage.getItem('admin_token')
        const user = JSON.parse(localStorage.getItem('admin_user') || '{}')
        if (!token || user.role !== 'admin') {
            navigate('/admin/dashboard')
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/backend/api/users.php', { credentials: 'include' })
            const data = await res.json()
            if (data.success) setUsers(data.data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const handleOpenAdd = () => {
        setFormData({ username: '', password: '', fullName: '', email: '', role: 'viewer' })
        setShowModal('add')
    }

    const handleOpenEdit = (user) => {
        setFormData({
            id: user.id,
            username: user.username,
            password: '', // Keep empty for no change
            fullName: user.full_name,
            email: user.email,
            role: user.role
        })
        setShowModal('edit')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setProcessing(true)
        const method = showModal === 'add' ? 'POST' : 'PUT'

        try {
            const res = await fetch('/backend/api/users.php', {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success) {
                setShowModal(null)
                fetchUsers()
            } else {
                alert(data.message)
            }
        } catch (err) { alert(`Error ${showModal === 'add' ? 'adding' : 'updating'} user`) }
        finally { setProcessing(false) }
    }

    const toggleUserStatus = async (user) => {
        try {
            const res = await fetch('/backend/api/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: user.id, is_active: !user.is_active }),
            })
            const data = await res.json()
            if (data.success) fetchUsers()
        } catch (err) { console.error(err) }
    }

    const deleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        try {
            const res = await fetch(`/backend/api/users.php?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) fetchUsers()
            else alert(data.message)
        } catch (err) { console.error(err) }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050308] via-[#0b0716] to-[#120a1f] text-white">
            <header className="sticky top-0 z-50 bg-[#08050f]/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center font-black text-black text-sm cursor-pointer hover:bg-white transition-all" onClick={() => navigate('/admin/dashboard')}>M</div>
                        <div>
                            <h1 className="font-black text-base leading-none uppercase tracking-tighter">User Management</h1>
                            <p className="text-[10px] text-[#A78BFA]/70 tracking-[0.2em] font-bold uppercase">Admin Portal</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleOpenAdd}
                            className="px-4 py-2 bg-[#A78BFA] hover:bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-2"
                        >
                            <span>+</span> Add New User
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10 space-y-6">
                {loading ? (
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-16 text-center">
                        <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-white/40 text-sm">Loading Users…</p>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    {['Full Name', 'Username', 'Email', 'Role', 'Status', 'Last Active', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-white/40 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-white mb-0.5">{u.full_name}</p>
                                            <p className="text-[10px] text-white/30 font-mono italic">ID: {u.id}</p>
                                        </td>
                                        <td className="px-6 py-5 text-white/80 font-mono text-xs">{u.username}</td>
                                        <td className="px-6 py-5 text-white/60">{u.email}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ROLE_STYLES[u.role] || ROLE_STYLES.viewer}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => toggleUserStatus(u)}
                                                className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border transition-all ${u.is_active == 1 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10'}`}
                                            >
                                                {u.is_active == 1 ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-white/40 text-[10px] font-mono whitespace-nowrap">
                                            {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="p-2.5 bg-white/5 hover:bg-[#A78BFA] hover:text-black text-white/60 rounded-xl border border-white/10 transition-all group"
                                                    title="Edit User"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all"
                                                    title="Delete User"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* User Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setShowModal(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#0d091a] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-start mb-8 text-white">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{showModal === 'add' ? 'Add New User' : 'Edit User'}</h2>
                                    <p className="text-[10px] text-[#A78BFA] tracking-[0.4em] font-bold uppercase mt-2">Personal Details</p>
                                </div>
                                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase block ml-1">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#A78BFA] transition-all text-sm font-bold placeholder:text-white/20"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase block ml-1">Username</label>
                                        <input
                                            type="text" required
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#A78BFA] transition-all font-mono text-sm placeholder:text-white/20"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase block ml-1">Account Role</label>
                                        <div className="relative">
                                            <select
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className={SELECT_CLS + ' !rounded-2xl !py-4 font-black text-[10px] tracking-widest uppercase'}
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase block ml-1">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#A78BFA] transition-all text-sm font-bold placeholder:text-white/20"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase block ml-1">{showModal === 'edit' ? 'New Password (Leave blank to keep current)' : 'Password'}</label>
                                    <input
                                        type="password" required={showModal === 'add'}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#A78BFA] transition-all font-mono text-sm placeholder:text-white/20"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit" disabled={processing}
                                        className="flex-1 py-4 bg-[#A78BFA] text-black text-[11px] font-black tracking-[0.4em] uppercase rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(167,139,250,0.2)] disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : (showModal === 'add' ? 'Add User' : 'Save Changes')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
