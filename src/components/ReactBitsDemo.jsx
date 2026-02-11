import { useState } from 'react';
import {
    AntigravityText,
    SplitText,
    TextType,
    ShuffleText,
    GradientText,
    ScrollFloat,
    BubbleMenu,
    DarkVeil,
    LightRays
} from './ReactBits';

/**
 * ReactBitsDemo - Showcase page for all React Bits components
 * Demonstrates usage and variations of each component
 */
export default function ReactBitsDemo() {
    const [showTypewriter, setShowTypewriter] = useState(true);

    const menuItems = [
        { icon: '🏠', label: 'Home', onClick: () => console.log('Home') },
        { icon: '📧', label: 'Contact', onClick: () => console.log('Contact') },
        { icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings') },
        { icon: '❓', label: 'Help', onClick: () => console.log('Help') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-x-hidden">
            {/* Background Effects */}
            <DarkVeil colors={['#0a0a0a', '#1a1a2e', '#16213e']} opacity={0.7} />
            <LightRays color="#667eea" opacity={0.08} rayCount={16} speed={25} />

            {/* Bubble Menu */}
            <BubbleMenu
                items={menuItems}
                bubbleColor="rgba(102, 126, 234, 0.9)"
                position="bottom-right"
                mainIcon="✨"
            />

            <div className="relative z-10 container mx-auto px-6 py-20">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center mb-32">
                    <AntigravityText
                        className="text-7xl font-bold mb-8"
                        delay={0.2}
                        duration={1.5}
                        floatDistance={-30}
                    >
                        React Bits Components
                    </AntigravityText>

                    <GradientText
                        className="text-4xl font-semibold mb-12"
                        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
                        animationDuration={4}
                    >
                        Premium Animated UI Library
                    </GradientText>

                    <div className="max-w-3xl">
                        <SplitText
                            className="text-xl text-gray-300"
                            delay={0.5}
                            duration={0.03}
                            variant="fadeUp"
                        >
                            A collection of stunning, animated React components inspired by React Bits
                        </SplitText>
                    </div>
                </section>

                {/* Antigravity Text Demo */}
                <section className="mb-32">
                    <ScrollFloat offset={80} direction="up" speed={0.3}>
                        <h2 className="text-5xl font-bold mb-8 text-center">
                            <GradientText colors={['#667eea', '#764ba2']}>
                                Antigravity Text
                            </GradientText>
                        </h2>
                    </ScrollFloat>

                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
                        <AntigravityText
                            className="text-4xl font-bold text-center"
                            delay={0}
                            duration={1.2}
                            floatDistance={-25}
                            stagger={0.08}
                        >
                            Text that defies gravity and floats upward
                        </AntigravityText>
                    </div>

                    <div className="mt-8 bg-gray-800/50 rounded-xl p-6 font-mono text-sm">
                        <pre className="text-green-400">
                            {`<AntigravityText 
  className="text-4xl font-bold"
  delay={0}
  duration={1.2}
  floatDistance={-25}
  stagger={0.08}
>
  Your text here
</AntigravityText>`}
                        </pre>
                    </div>
                </section>

                {/* Split Text Demo */}
                <section className="mb-32">
                    <ScrollFloat offset={60} direction="right" speed={0.4}>
                        <h2 className="text-5xl font-bold mb-8 text-center">
                            <GradientText colors={['#f093fb', '#4facfe']}>
                                Split Text Animations
                            </GradientText>
                        </h2>
                    </ScrollFloat>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-purple-300">Character Fade Up</h3>
                            <SplitText
                                className="text-2xl"
                                animateBy="character"
                                variant="fadeUp"
                                duration={0.05}
                            >
                                Character by character animation
                            </SplitText>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-purple-300">Word Scale</h3>
                            <SplitText
                                className="text-2xl"
                                animateBy="word"
                                variant="scale"
                                duration={0.1}
                            >
                                Word by word scaling effect
                            </SplitText>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-purple-300">Slide Left</h3>
                            <SplitText
                                className="text-2xl"
                                animateBy="character"
                                variant="slideLeft"
                                duration={0.03}
                            >
                                Sliding from the left
                            </SplitText>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-purple-300">Slide Right</h3>
                            <SplitText
                                className="text-2xl"
                                animateBy="character"
                                variant="slideRight"
                                duration={0.03}
                            >
                                Sliding from the right
                            </SplitText>
                        </div>
                    </div>
                </section>

                {/* Typewriter Demo */}
                <section className="mb-32">
                    <ScrollFloat offset={70} direction="left" speed={0.35}>
                        <h2 className="text-5xl font-bold mb-8 text-center">
                            <GradientText colors={['#764ba2', '#667eea']}>
                                Typewriter Effect
                            </GradientText>
                        </h2>
                    </ScrollFloat>

                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    setShowTypewriter(false);
                                    setTimeout(() => setShowTypewriter(true), 100);
                                }}
                                className="mb-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-colors"
                            >
                                Restart Animation
                            </button>

                            {showTypewriter && (
                                <TextType
                                    className="text-3xl font-mono"
                                    speed={80}
                                    showCursor={true}
                                    cursorChar="|"
                                >
                                    This text types out character by character...
                                </TextType>
                            )}
                        </div>
                    </div>
                </section>

                {/* Shuffle Text Demo */}
                <section className="mb-32">
                    <ScrollFloat offset={65} direction="up" speed={0.4}>
                        <h2 className="text-5xl font-bold mb-8 text-center">
                            <GradientText colors={['#4facfe', '#00f2fe']}>
                                Shuffle Text
                            </GradientText>
                        </h2>
                    </ScrollFloat>

                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 text-center">
                        <ShuffleText
                            className="text-4xl font-bold"
                            speed={30}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
                        >
                            SHUFFLING CHARACTERS REVEAL
                        </ShuffleText>
                    </div>
                </section>

                {/* Gradient Text Demo */}
                <section className="mb-32">
                    <ScrollFloat offset={75} direction="down" speed={0.3}>
                        <h2 className="text-5xl font-bold mb-8 text-center">
                            <GradientText colors={['#f093fb', '#f5576c']}>
                                Gradient Text Variations
                            </GradientText>
                        </h2>
                    </ScrollFloat>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 text-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Horizontal Gradient</h3>
                            <GradientText
                                className="text-4xl font-bold"
                                colors={['#667eea', '#764ba2', '#f093fb']}
                                direction="horizontal"
                                animationDuration={3}
                            >
                                Flowing Colors
                            </GradientText>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 text-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Vertical Gradient</h3>
                            <GradientText
                                className="text-4xl font-bold"
                                colors={['#4facfe', '#00f2fe', '#43e97b']}
                                direction="vertical"
                                animationDuration={4}
                            >
                                Vibrant Hues
                            </GradientText>
                        </div>
                    </div>
                </section>

                {/* Scroll Float Demo */}
                <section className="mb-32">
                    <h2 className="text-5xl font-bold mb-8 text-center">
                        <GradientText colors={['#43e97b', '#38f9d7']}>
                            Scroll-Based Floating
                        </GradientText>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ScrollFloat offset={100} direction="up" speed={0.5}>
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold">Float Up</h3>
                                <p className="mt-2 text-sm">Scroll to see me move</p>
                            </div>
                        </ScrollFloat>

                        <ScrollFloat offset={100} direction="down" speed={0.5}>
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold">Float Down</h3>
                                <p className="mt-2 text-sm">Scroll to see me move</p>
                            </div>
                        </ScrollFloat>

                        <ScrollFloat offset={100} direction="left" speed={0.5}>
                            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold">Float Left</h3>
                                <p className="mt-2 text-sm">Scroll to see me move</p>
                            </div>
                        </ScrollFloat>

                        <ScrollFloat offset={100} direction="right" speed={0.5}>
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold">Float Right</h3>
                                <p className="mt-2 text-sm">Scroll to see me move</p>
                            </div>
                        </ScrollFloat>
                    </div>
                </section>

                {/* Background Effects Demo */}
                <section className="mb-32">
                    <h2 className="text-5xl font-bold mb-8 text-center">
                        <GradientText colors={['#f5576c', '#f093fb']}>
                            Background Effects
                        </GradientText>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative bg-black rounded-3xl p-12 border border-white/10 overflow-hidden h-64">
                            <DarkVeil colors={['#1a1a2e', '#16213e', '#0f3460']} opacity={0.8} />
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold mb-2">Dark Veil</h3>
                                <p className="text-gray-300">Animated gradient overlay</p>
                            </div>
                        </div>

                        <div className="relative bg-black rounded-3xl p-12 border border-white/10 overflow-hidden h-64">
                            <LightRays color="#ffffff" opacity={0.15} rayCount={12} speed={15} />
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold mb-2">Light Rays</h3>
                                <p className="text-gray-300">Radial light beam effect</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-12 border-t border-white/10">
                    <SplitText
                        className="text-xl text-gray-400"
                        animateBy="word"
                        variant="fadeIn"
                        duration={0.1}
                    >
                        Inspired by React Bits • Built with React & Framer Motion
                    </SplitText>
                </footer>
            </div>
        </div>
    );
}
