import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/backend/api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('admin_token', data.data.token)
                localStorage.setItem('admin_user', JSON.stringify(data.data.user))
                navigate('/admin/dashboard')
            } else {
                setError(data.message || 'Login failed')
            }
        } catch (err) {
            setError('Connection error. Please check if the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#1a0a1a] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-white mb-2">MEDAI</h1>
                        <p className="text-[#A78BFA] text-sm tracking-widest uppercase">Admin Panel</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA] transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A78BFA] transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#A78BFA] hover:bg-[#9370DB] text-black font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Default Credentials Info */}
                    <div className="mt-6 p-4 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-lg">
                        <p className="text-xs text-white/50 text-center">
                            Default: <span className="text-[#A78BFA]">admin</span> / <span className="text-[#A78BFA]">admin123</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
