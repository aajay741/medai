import { motion } from 'framer-motion'

export default function CommunityPulse() {
    const feeds = [
        { user: 'Nova_01', message: 'The spatial sound in Chennai last night was literal magic.', tag: '#AcousticDepth' },
        { user: 'ArtistX', message: 'Just finished the ensemble sync for Bengaluru. 16K visual mapping is insane.', tag: '#StageIntel' },
        { user: 'Fanatic', message: 'Medai is changing how we experience live performance. No more edges.', tag: '#Immersive' }
    ]

    return (
        <section className="relative py-32 px-6 bg-[#030303] overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12 order-2 lg:order-1">
                        {feeds.map((feed, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2, duration: 1 }}
                                className="relative p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] group hover:bg-[#A78BFA]/10 transition-all"
                            >
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#A78BFA] rounded-full flex items-center justify-center text-black font-black italic">
                                    "
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black tracking-widest uppercase text-xs">{feed.user}</span>
                                        <span className="text-[#A78BFA] text-[10px] font-black uppercase opacity-60 tracking-widest">{feed.tag}</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-medium text-white/70 italic leading-relaxed">"{feed.message}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-12 order-1 lg:order-2">
                        <span className="text-[#A78BFA] font-black tracking-[0.6em] text-xs uppercase mb-8 block text-center lg:text-left">Human Frequency</span>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-center lg:text-left">
                            Network <br />
                            <span className="text-white/20 italic">Sentiment.</span>
                        </h2>
                        <p className="text-white/40 text-lg md:text-xl font-medium max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                            Real-time reactions from our global community of artists and enthusiasts. The pulse of the new stage.
                        </p>
                        <div className="pt-8 border-t border-white/5 flex justify-center lg:justify-start gap-12">
                            <div>
                                <h4 className="text-3xl font-black text-white">42K+</h4>
                                <span className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest">Active Witnesses</span>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white">128</h4>
                                <span className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest">Performance Nodes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
