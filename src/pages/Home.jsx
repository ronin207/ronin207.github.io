import React, { useState } from 'react';
import { ArrowUpRight, Mail, Github, FileText, Send, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import RadarChart from '../components/RadarChart';
import { DecryptText } from '../hooks/useScramble.jsx';
import useInView from '../hooks/useInView.jsx';
import projects from '../data/projects';
import { radarData } from '../data/skills';
import MultiverseText from '../components/MultiverseText';
import GlitchHex from '../components/GlitchHex';

const FadeIn = ({ children, className = '', delay = 0 }) => {
    const [ref, isInView] = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const ProjectCard = ({ project, resolvedTheme, index }) => {
    const Icon = project.icon;
    return (
        <FadeIn delay={index * 100}>
            <Link
                to={`/projects/${project.slug}`}
                className="group block border-t border-neutral-200 dark:border-neutral-800 py-8 transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 -mx-4 px-4 rounded-lg"
            >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={16} className="text-neutral-400 dark:text-neutral-500" />}
                        <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                            {project.title}
                        </h3>
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-neutral-500 mt-2 md:mt-0">
                        <span>{project.category}</span>
                        <span>[{project.year}]</span>
                    </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
                    {project.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-emerald-500">
                    <span>VIEW_PROJECT</span>
                    <ArrowUpRight size={14} />
                </div>
            </Link>
        </FadeIn>
    );
};

const Section = ({ title, children, id, sectionIndex }) => (
    <section id={id} className="py-16 md:py-32 border-l border-neutral-200 dark:border-neutral-900 ml-2 md:ml-12 pl-4 md:pl-12 relative transition-colors duration-500">
        <div className="absolute -left-[5px] top-8 md:top-24 w-[9px] h-[9px] bg-neutral-300 dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-black" />
        <FadeIn>
            <div className="mb-12">
                <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-2">
                    <GlitchHex value={sectionIndex} /> // {title}
                </h2>
                <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-800" />
            </div>
        </FadeIn>
        {children}
    </section>
);

const ContactForm = ({ resolvedTheme }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('sent');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const inputClasses = `w-full px-4 py-3 text-sm font-mono rounded-lg border transition-colors outline-none ${
        resolvedTheme === 'dark'
            ? 'bg-neutral-900/50 border-neutral-800 text-neutral-200 placeholder-neutral-600 focus:border-emerald-500'
            : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-indigo-600'
    }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                />
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                />
            </div>
            <textarea
                placeholder="Message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClasses} resize-none`}
            />
            <button
                type="submit"
                disabled={status === 'sending'}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                    resolvedTheme === 'dark'
                        ? 'bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-400'
                        : 'bg-neutral-900 text-white hover:bg-neutral-700 disabled:bg-neutral-300 disabled:text-neutral-500'
                }`}
            >
                <Send size={16} />
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
            </button>
            {status === 'error' && (
                <p className="text-sm text-red-500 font-mono">
                    Something went wrong. Try emailing directly instead.
                </p>
            )}
        </form>
    );
};

export default function Home({ resolvedTheme }) {
    return (
        <div className="container mx-auto max-w-5xl px-4 md:px-6 pt-24 md:pt-48">
            {/* Hero Section */}
            <header id="overview" className="mb-20 md:mb-40 ml-2 md:ml-12 pl-4 md:pl-12 border-l border-neutral-200 dark:border-neutral-800 relative transition-colors duration-500">
                <div className="absolute -left-[1px] top-0 h-full w-[1px] bg-gradient-to-b from-indigo-500/50 dark:from-emerald-500/50 to-transparent" />

                <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 mb-8 backdrop-blur-sm">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                            AI Security Research @ AIFT · MEng @ Waseda
                        </span>
                    </div>
                </FadeIn>

                <FadeIn delay={100}>
                    <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.1] mb-8">
                        <MultiverseText resolvedTheme={resolvedTheme}>Optimizing the</MultiverseText> <br />
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-neutral-100 to-neutral-500' : 'from-neutral-900 to-neutral-500'}`}>
                            <DecryptText text="Quantum_Future" />
                        </span>.
                    </h1>
                </FadeIn>

                <FadeIn delay={200}>
                    <p className="max-w-xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-12">
                        Researching <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>AI Security</span>, <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Post-Quantum Cryptography</span>, and <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>Zero-Knowledge Proofs</span> at Waseda University and AIFT.
                        Building cryptographic systems that remain secure in a quantum era.
                    </p>
                </FadeIn>

                <FadeIn delay={300}>
                    <div className="flex gap-6">
                        <a href="#research" className={`group flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${resolvedTheme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}>
                            <span>View Protocols</span>
                            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                        <a href="#contact" className="flex items-center gap-3 px-6 py-3 border border-neutral-300 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-mono hover:text-indigo-600 dark:hover:text-white hover:border-indigo-600 dark:hover:border-neutral-600 transition-colors">
                            <span>./contact_takumi</span>
                        </a>
                    </div>
                </FadeIn>
            </header>

            {/* Selected Work / Research */}
            <Section id="research" title="Research Areas" sectionIndex={1}>
                <div className="space-y-4">
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            resolvedTheme={resolvedTheme}
                            index={i}
                        />
                    ))}
                </div>
            </Section>

            {/* Intersection Interests */}
            <Section id="interests" title="Intersection Interests" sectionIndex={2}>
                <FadeIn>
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
                                data={radarData}
                                size={320}
                                theme={resolvedTheme}
                            />
                        </div>
                    </div>
                </FadeIn>
            </Section>

            {/* Thesis Section */}
            <Section id="thesis" title="Active Research" sectionIndex={3}>
                <div className="space-y-6">
                    {/* Main Thesis */}
                    <FadeIn>
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Master's Thesis</span>
                                    <h3 className="text-2xl font-light text-neutral-900 dark:text-white">
                                        Post-Quantum Anonymous Credentials
                                    </h3>
                                </div>
                                <span className="px-3 py-1 text-xs font-mono rounded-full bg-indigo-100 dark:bg-emerald-900/30 text-indigo-700 dark:text-emerald-400 border border-indigo-200 dark:border-emerald-800 mt-2 md:mt-0">
                                    IN_PROGRESS
                                </span>
                            </div>

                            <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-8">
                                Investigating zkVMs vs SNARK circuit compilers for post-quantum anonymous credential systems. BDEC's reliance on static zkSNARK circuits leads to critical inflexibility for dynamic attribute management. This research benchmarks the BDEC verifier within both zkVM and circuit compiler approaches, measuring prover time, verification time, and memory usage to determine the more viable foundation for next-generation digital identity.
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
                    </FadeIn>

                    {/* VC-LDAC Secondary Research */}
                    <FadeIn delay={100}>
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Secondary Research</span>
                                    <h3 className="text-2xl font-light text-neutral-900 dark:text-white">
                                        VC-LDAC
                                    </h3>
                                </div>
                                <span className="px-3 py-1 text-xs font-mono rounded-full bg-indigo-100 dark:bg-emerald-900/30 text-indigo-700 dark:text-emerald-400 border border-indigo-200 dark:border-emerald-800 mt-2 md:mt-0">
                                    IN_PROGRESS
                                </span>
                            </div>

                            <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-8">
                                Extending Linked Data Verifiable Credentials to enable privacy-preserving multi-issuer ontological reasoning. A holder can prove derived facts from multiple independent credentials using domain-specific ontologies without revealing intermediate premises. Features a two-layer verification architecture binding SNARK and Anonymous Credential systems, with complete LEAN 4 formal verification.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                                    <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Focus Area</h4>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">ZK Ontological Reasoning</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                                    <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Architecture</h4>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Two-Layer SNARK + AC</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                                    <h4 className="text-xs font-mono uppercase text-neutral-500 mb-2">Verification</h4>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">LEAN 4 + Rust</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Section>

            {/* About / Philosophy */}
            <Section id="about" title="Philosophy" sectionIndex={4}>
                <FadeIn>
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
                                    <span className={`w-2 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-emerald-900' : 'bg-indigo-300'}`}></span> Rust / C++ (Cryptographic implementations)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-emerald-900' : 'bg-indigo-300'}`}></span> Python (NumPy, SciPy, PyTorch, LangChain)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-emerald-900' : 'bg-indigo-300'}`}></span> Swift / Flutter (On-device ML)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-800 rounded-full"></span> LaTeX / MATLAB / Julia
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-800 rounded-full"></span> React / LEAN 4 (Verification & Tools)
                                </li>
                            </ul>
                        </div>
                    </div>
                </FadeIn>
            </Section>

            {/* Contact */}
            <footer id="contact" className="py-20 md:py-32 ml-2 md:ml-12 pl-4 md:pl-12 border-l border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
                        <DecryptText text="Begin Transmission" />
                    </h2>
                    <p className="text-neutral-500 mb-12 max-w-md">
                        Open to academic collaborations, research assistant positions, and interesting conversations.
                    </p>
                </FadeIn>

                <FadeIn delay={100}>
                    <ContactForm resolvedTheme={resolvedTheme} />
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
                        <a href="mailto:takumi_ot09@fuji.waseda.jp" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                            <Mail size={18} />
                            <span>takumi_ot09@fuji.waseda.jp</span>
                        </a>
                        <a href="https://github.com/ronin207" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                            <Github size={18} />
                            <span>github.com/ronin207</span>
                        </a>
                        <a href="https://linkedin.com/in/takumi-otsuka" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                            <Linkedin size={18} />
                            <span>linkedin.com/in/takumi-otsuka</span>
                        </a>
                        <Link to="/cv" className={`flex items-center gap-3 text-sm font-mono transition-colors ${resolvedTheme === 'dark' ? 'text-neutral-300 hover:text-emerald-500' : 'text-neutral-600 hover:text-indigo-600'}`}>
                            <FileText size={18} />
                            <span>view_cv.jsx</span>
                        </Link>
                    </div>
                </FadeIn>

                <div className="mt-24 text-[10px] font-mono text-neutral-400 dark:text-neutral-700 uppercase tracking-widest">
                    &copy; 2025 TAKUMI.DEV // System: {resolvedTheme.toUpperCase()}
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-mono text-neutral-400/50 dark:text-neutral-700/50">
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-1 py-0.5 rounded border border-neutral-300/30 dark:border-neutral-700/30">`</kbd>
                        terminal
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-1 py-0.5 rounded border border-neutral-300/30 dark:border-neutral-700/30">⌘K</kbd>
                        search
                    </span>
                </div>
            </footer>
        </div>
    );
}
