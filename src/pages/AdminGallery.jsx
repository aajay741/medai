import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function AdminGallery() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [filter, setFilter] = useState('')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        image_url: ''
    })

    useEffect(() => {
        checkAuth()
        fetchImages()
    }, [filter])

    const checkAuth = () => {
        const token = localStorage.getItem('admin_token')
        if (!token) navigate('/admin/login')
    }

    const fetchImages = async () => {
        setLoading(true)
        try {
            const url = filter
                ? `/backend/api/gallery.php?category=${filter}`
                : '/backend/api/gallery.php'
            const response = await fetch(url)
            const data = await response.json()
            if (data.success) {
                setImages(data.data)
            }
        } catch (err) {
            console.error('Error fetching gallery:', err)
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
                setFormData({ ...formData, image_url: data.data.url })
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
        if (!formData.image_url) {
            alert('Please upload an image first')
            return
        }

        try {
            const response = await fetch('/backend/api/gallery.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.success) {
                setFormData({ title: '', description: '', category: 'General', image_url: '' })
                fetchImages()
            }
        } catch (err) {
            console.error('Error saving gallery item:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            const response = await fetch(`/backend/api/gallery.php?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                fetchImages()
            }
        } catch (err) {
            console.error('Error deleting image:', err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#1a0a1a] pt-32 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Gallery Management</h1>
                        <p className="text-[#A78BFA]">Upload and manage performance photos</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all font-bold"
                    >
                        Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-white mb-6">Upload New Photo</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-2 font-bold">Image File</label>
                                    <div className={`relative h-48 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center ${formData.image_url ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                                        {formData.image_url ? (
                                            <>
                                                <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover rounded-lg mb-2" />
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
                                                <div className="text-3xl mb-2">📸</div>
                                                <p className="text-white/40 text-xs mb-4">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
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
                                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-2 font-bold">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#A78BFA]"
                                        placeholder="Enter title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/60 text-xs uppercase tracking-widest mb-2 font-bold">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#A78BFA] appearance-none"
                                    >
                                        <option value="General" className="bg-[#1a1a1a]">General</option>
                                        <option value="Theatre" className="bg-[#1a1a1a]">Theatre</option>
                                        <option value="Music" className="bg-[#1a1a1a]">Music</option>
                                        <option value="Dance" className="bg-[#1a1a1a]">Dance</option>
                                        <option value="Behind the Scenes" className="bg-[#1a1a1a]">Behind the Scenes</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading || !formData.image_url}
                                    className="w-full py-3 bg-[#A78BFA] text-black font-black rounded-lg hover:bg-white transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                >
                                    Add to Gallery
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Image List */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                            {['', 'General', 'Theatre', 'Music', 'Dance', 'Behind the Scenes'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${filter === cat ? 'bg-[#A78BFA] text-black border-[#A78BFA]' : 'bg-white/5 text-white/60 border-white/10'}`}
                                >
                                    {cat || 'All'}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-full py-20 text-center text-white/20">Loading...</div>
                            ) : images.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-white/20">No images found.</div>
                            ) : (
                                images.map((img) => (
                                    <motion.div
                                        key={img.id}
                                        layout
                                        className="group relative bg-[#080808] border border-white/5 rounded-2xl overflow-hidden aspect-video"
                                    >
                                        <img src={img.image_url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[#A78BFA] text-[10px] font-black uppercase tracking-widest mb-1">{img.category}</span>
                                            <h3 className="text-white font-bold mb-4">{img.title || 'Untitled'}</h3>
                                            <button
                                                onClick={() => handleDelete(img.id)}
                                                className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all w-fit"
                                            >
                                                Delete Image
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
