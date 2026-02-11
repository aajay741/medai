import React from 'react';
import ScrollStack, { ScrollStackItem } from '../components/ReactBits/ScrollStack';

export default function Gallery() {
    const cards = [
        {
            title: "Live Theatre",
            desc: "Soul-stirring performances that bridge the gap between audience and actor. A space where every breath counts.",
            imageUrl: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=2187"
        },
        {
            title: "Indie Music",
            desc: "Acoustically treated halls designed for clarity and emotional resonance. Experience raw energy and pure acoustic fidelity.",
            imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
        },
        {
            title: "Classical Dance",
            desc: "Preserving heritage through intimate spaces that honor tradition. Precision lighting and acoustic treatments for timeless movement.",
            imageUrl: "https://images.unsplash.com/photo-1547127796-06bb04e4b315?q=80&w=2070"
        },
    ];

    return (
        <section id="gallery" className="relative w-full bg-[#030303] py-20">
            <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
                <span className="text-[#A78BFA] font-black tracking-[0.5em] text-sm uppercase mb-4 block">Experiences</span>
                <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">
                    Art in <span className="text-white/30 italic">Motion</span>
                </h2>
            </div>

            <ScrollStack
                itemDistance={200}
                stackPosition="15%"
                itemStackDistance={10}
                baseScale={0.88}
                blurAmount={6}
            >
                {cards.map((card, i) => (
                    <ScrollStackItem key={i}>
                        <div className="w-full h-full flex flex-col md:flex-row bg-[#080808]">
                            {/* Content Side */}
                            <div className="flex-[1.2] p-8 md:p-16 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[#A78BFA] font-black tracking-widest text-sm">0{i + 1}</span>
                                    <div className="h-[1px] w-8 bg-[#A78BFA]/30" />
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Premium Scene</span>
                                </div>

                                <h3 className="text-5xl md:text-7xl font-black text-white uppercase mb-8 leading-[0.9]">
                                    {card.title.split(' ')[0]} <br />
                                    <span className="text-white/40 italic font-black">{card.title.split(' ')[1]}</span>
                                </h3>

                                <p className="text-lg md:text-xl text-white/60 italic max-w-lg mb-12 leading-relaxed">
                                    {card.desc}
                                </p>

                                <div className="group flex items-center gap-6 cursor-pointer w-fit">
                                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#A78BFA] group-hover:text-black transition-all shadow-xl">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-[#A78BFA] transition-all">Explore</span>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 relative overflow-hidden bg-black border-l border-white/5">
                                <img
                                    src={card.imageUrl}
                                    alt={card.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#080808] via-transparent to-transparent opacity-60" />
                            </div>
                        </div>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </section>
    );
}
