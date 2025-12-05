import React from 'react';
import { ArrowUpRight, Mail, Github, FileText, ShieldCheck, Sigma, Activity, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import RadarChart from '../components/RadarChart';
const DecryptText = ({ text, className = "" }) => {
    // Simple pass-through for now, as the hook is in App.jsx or needs to be moved
    // Ideally, we should move the hooks to a separate file or keep them in App and pass down, 
    // but for cleaner architecture, I'll assume we might move them or duplicate the simple wrapper.
    // Wait, I should probably move the hooks to a utils file or keep them in App and export?
    // For now, let's assume the Home component receives props or we move the hooks.
    // Actually, let's just copy the component usage. I'll need to move the hooks to a shared location or include them here.
    // To avoid breaking things, I'll include the hooks here or import them if I extract them.
    // Let's extract hooks to a separate file first? Or just keep it simple and put everything in Home for now.
    // The user wants a quick update. I'll put the content here.
    return <span className={className}>{text}</span>;
};

// Re-implementing DecryptText and useScramble here or importing would be better.
// For this step, I will assume I can move the hooks to a separate file `src/hooks/useScramble.js` and `src/hooks/useTheme.js`?
// Or I can just keep them in Home if they are only used there. `useTheme` is used in App for background.
// `DecryptText` is used in Home.

// Let's define the components used in Home.

const ProjectCard = ({ title, category, year, description, icon: Icon }) => (
    <div className="group border-t border-neutral-200 dark:border-neutral-800 py-8 transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
            <div className="flex items-center gap-3">
                {Icon && <Icon size={16} className="text-neutral-400 dark:text-neutral-500" />}
                <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                    {title}
                </h3>
            </div>
            <div className="flex gap-4 text-xs font-mono text-neutral-500 mt-2 md:mt-0">
                <span>{category}</span>
                <span>[{year}]</span>
            </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
            {description}
        </p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-emerald-500">
            <span>VIEW_RESEARCH_PAPER</span>
            <ArrowUpRight size={14} />
        </div>
    </div>
);

const Section = ({ title, children, id }) => (
    <section id={id} className="py-20 md:py-32 border-l border-neutral-200 dark:border-neutral-900 ml-4 md:ml-12 pl-6 md:pl-12 relative transition-colors duration-500">
        <div className="absolute -left-[5px] top-24 w-[9px] h-[9px] bg-neutral-300 dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-black" />
        <div className="mb-12">
            <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-2">
                0x0{id === 'about' ? '1' : id === 'research' ? '2' : '3'} // {title}
            </h2>
            <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-800" />
        </div>
        {children}
    </section>
);

export default function Home({ resolvedTheme, DecryptText }) {
    return (
        <div className="container mx-auto max-w-5xl px-6 pt-32 md:pt-48">
            {/* Hero Section */}
            <header id="overview" className="mb-24 md:mb-40 ml-4 md:ml-12 pl-6 md:pl-12 border-l border-neutral-200 dark:border-neutral-800 relative transition-colors duration-500">
                <div className="absolute -left-[1px] top-0 h-full w-[1px] bg-gradient-to-b from-indigo-500/50 dark:from-emerald-500/50 to-transparent" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 mb-8 backdrop-blur-sm">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        Graduate Research Student
                    </span>
                </div>

                <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.1] mb-8">
                    Optimizing the <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-neutral-100 to-neutral-500' : 'from-neutral-900 to-neutral-500'}`}>
                        <DecryptText text="Quantum_Future" />
                    </span>.
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-12">
                    I am a <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Graduate Student</span> focused on the convergence of <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Post-Quantum Cryptography</span> and <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Deep Learning</span>.
                    Investigating numerical optimization methods to secure systems against next-generation threats.
                </p>

                <div className="flex gap-6">
                    <a href="#research" className={`group flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${resolvedTheme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}>
                        <span>View Protocols</span>
                        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <a href="#contact" className="flex items-center gap-3 px-6 py-3 border border-neutral-300 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-mono hover:text-indigo-600 dark:hover:text-white hover:border-indigo-600 dark:hover:border-neutral-600 transition-colors">
                        <span>./contact_takumi</span>
                    </a>
                </div>
            </header>

            {/* Selected Work / Research */}
            <Section id="research" title="Research Areas">
                <div className="space-y-4">
                    {/* UPDATED CONTENT FROM RESUME */}
                    <ProjectCard
                        title="Verifiable Credentials Wallet"
                        category="Privacy & Identity"
                        year="2025"
                        icon={ShieldCheck}
                        description="Engineered an on-device RAG system achieving >68% query accuracy with <100MB memory usage. Implemented Issuer Hiding and Protego for privacy-preserving credentials."
                    />

                    <ProjectCard
                        title="Security Agent"
                        category="AI Security"
                        year="2025"
                        icon={Activity}
                        description="Developed a multi-agent security evaluation workflow using LLMs. Identified a logic bug in Intmax2-ZKP, resulting in a $2,000 reward."
                    />

                    <ProjectCard
                        title="KiwiTales"
                        category="Generative AI"
                        year="2025"
                        icon={Cpu}
                        description="Architected an AI-powered story generation app integrating Gemini AI SDK and Stable Diffusion. Implemented robust state management for generative model performance."
                    />
                </div>
            </Section>

            {/* Intersection Interests */}
            <Section id="interests" title="Intersection Interests">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    <div className="w-full md:w-1/2">
                        <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-6">
                            My research sits at the intersection of <strong className={resolvedTheme === 'dark' ? 'text-white' : 'text-black'}>Cryptography</strong>, <strong className={resolvedTheme === 'dark' ? 'text-white' : 'text-black'}>AI</strong>, and <strong className={resolvedTheme === 'dark' ? 'text-white' : 'text-black'}>Systems Engineering</strong>. I aim to bridge the gap between theoretical hardness assumptions and practical, user-centric applications.
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                            By combining these fields, I explore how modern AI can be both a tool for cryptanalysis and a beneficiary of privacy-preserving technologies like Zero-Knowledge Proofs and FHE.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <RadarChart
                            data={[
                                { label: 'Cryptography', value: 95 },
                                { label: 'AI / ML', value: 85 },
                                { label: 'Systems Eng', value: 80 },
                                { label: 'Privacy', value: 90 },
                                { label: 'Blockchain', value: 75 },
                                { label: 'Math', value: 85 },
                            ]}
                            size={320}
                            theme={resolvedTheme}
                        />
                    </div>
                </div>
            </Section>

            {/* Thesis Section */}
            <Section id="thesis" title="Master's Thesis">
                <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h3 className="text-2xl font-light text-neutral-900 dark:text-white mb-2 md:mb-0">
                            Post-Quantum Anonymous Credentials
                        </h3>
                        <span className="px-3 py-1 text-xs font-mono rounded-full bg-indigo-100 dark:bg-emerald-900/30 text-indigo-700 dark:text-emerald-400 border border-indigo-200 dark:border-emerald-800">
                            IN_PROGRESS
                        </span>
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-6">
                        <strong>Abstract:</strong> The advent of quantum computing demands a rapid transition to post-quantum cryptographic solutions. In digital identity, SNARK-friendly schemes like Loquat underpin post-quantum anonymous credential systems such as BDEC. However, BDEC's reliance on static, custom zkSNARK circuits for credential verification leads to critical inflexibility, rendering it impractical for dynamic attribute management. Zero-Knowledge Virtual Machines (zkVMs) promise a solution, offering to prove arbitrary programs and transform complex circuits into high-level code updates.
                    </p>

                    <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-8">
                        This research will investigate the specific zero-knowledge properties of different zkVMs through comparative analysis of zkVMs and alternative SNARK circuit compilers, implementing and benchmarking the BDEC verifier within both approaches. This quantitative and qualitative analysis will determine which approach offers a more viable and agile foundation for the next generation of digital identity systems, specifically addressing the trade-offs between flexibility, performance with concrete metrics such as prover time, verification time, and memory usage.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                            <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Focus Area</h4>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">zkVMs vs SNARK Compilers</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                            <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Key Protocol</h4>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Loquat / BDEC</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                            <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Application</h4>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Dynamic Attribute Management</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* About / Philosophy */}
            <Section id="about" title="Philosophy">
                <div className="grid md:grid-cols-2 gap-12 text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    <div>
                        <p className="mb-6">
                            <strong className={`block mb-2 font-mono text-sm uppercase ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Transition</strong>
                            My academic path has evolved from numerical optimisations of neural networks to formalising mathematical rigor to secure cryptographic protocols. While I retain a strong background in rigorous verification, my current rigor is applied to <span className={resolvedTheme === 'dark' ? 'text-emerald-500' : 'text-indigo-600'}>Cryptographic Hardness</span> and <span className={resolvedTheme === 'dark' ? 'text-emerald-500' : 'text-indigo-600'}>Numerical Optimisations</span>.
                        </p>
                        <p>
                            I believe that as quantum computing matures, the aesthetic of security will shift from "visible padlocks" to "invisible mathematics." I aim to build systems that remain secure in a post-quantum world.
                        </p>
                    </div>
                    <div>
                        <strong className={`block mb-4 font-mono text-sm uppercase ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Research Stack</strong>
                        <ul className="space-y-2 font-mono text-sm text-neutral-500">
                            <li className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-emerald-900' : 'bg-indigo-300'}`}></span> Python (NumPy, SciPy, PyTorch)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-emerald-900' : 'bg-indigo-300'}`}></span> C++ / Rust (High-performance implementations)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-800 rounded-full"></span> LaTeX / MATLAB
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-800 rounded-full"></span> React (Visualization & Tools)
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Contact */}
            <footer id="contact" className="py-20 md:py-32 ml-4 md:ml-12 pl-6 md:pl-12 border-l border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
                    <DecryptText text="Begin Transmission" />
                </h2>
                <p className="text-neutral-500 mb-12 max-w-md">
                    Open to academic collaborations and research assistant positions.
                </p>

                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    <a href="mailto:takumi_ot09@fuji.waseda.jp" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                        <Mail size={18} />
                        <span>takumi_ot09@fuji.waseda.jp</span>
                    </a>
                    <a href="https://github.com/ronin207" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                        <Github size={18} />
                        <span>github.com/ronin207</span>
                    </a>
                    <Link to="/cv" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                        <FileText size={18} />
                        <span>view_cv.jsx</span>
                    </Link>
                </div>

                <div className="mt-24 text-[10px] font-mono text-neutral-400 dark:text-neutral-700 uppercase tracking-widest">
                    © 2025 TAKUMI.DEV // System: {resolvedTheme.toUpperCase()}
                </div>
            </footer>
        </div>
    );
}
