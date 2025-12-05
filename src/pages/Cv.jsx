import React from 'react';
import { ArrowLeft, Download, Mail, Github, Linkedin, Globe, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CvSection = ({ title, children }) => (
    <section className="mb-12">
        <h2 className="text-lg font-mono uppercase tracking-widest mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-neutral-400 dark:text-neutral-500">
            {title}
        </h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const CvItem = ({ title, subtitle, date, location, children }) => (
    <div className="group">
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
            <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-emerald-500 transition-colors">
                {title}
            </h3>
            <span className="font-mono text-xs text-neutral-500 whitespace-nowrap">{date}</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-3">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{subtitle}</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600">{location}</span>
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 group-hover:border-indigo-200 dark:group-hover:border-emerald-900/50 transition-colors">
            {children}
        </div>
    </div>
);

export default function Cv({ resolvedTheme }) {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-4xl">
            <div className="mb-12">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors mb-8">
                    <ArrowLeft size={16} />
                    <span>RETURN_HOME</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4 text-neutral-900 dark:text-white">
                            Takumi Otsuka
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light mb-4 max-w-2xl">
                            AI Consultant @ Functional AI | Provable Security @ Waseda University
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm font-mono text-neutral-500">
                            <a href="mailto:takumi.ot0911@gmail.com" className="hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors">takumi.ot0911@gmail.com</a>
                            <span>|</span>
                            <a href="https://github.com/ronin207" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors">github.com/ronin207</a>
                            <span>|</span>
                            <a href="https://linkedin.com/in/takumi-otsuka" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors">linkedin.com/in/takumi-otsuka</a>
                        </div>
                    </div>

                    <a
                        href="/Resume.pdf"
                        target="_blank"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${resolvedTheme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}
                    >
                        <Download size={16} />
                        <span>Download PDF</span>
                    </a>
                </div>
            </div>

            <CvSection title="Summary">
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    As a Master's student in Computer Science and Communications Engineering at Waseda University, I specialize in cryptographic protocols and blockchain technologies, with a strong foundation in numerical computation and deep learning. My passion lies in leveraging advanced computational techniques to tackle complex challenges, particularly in emerging areas such as Post-Quantum Cryptography and Large Language Models (LLMs).
                </p>
            </CvSection>

            <CvSection title="Experience">
                <CvItem
                    title="Functional AI Partners Pte Ltd"
                    subtitle="AI Consultant (Architect)"
                    date="Sep. 2025 -- Present"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Implementing a voice agent that adapts to user profiles and maintains conversational awareness via long-/short-term memory for multi-turn dialog.</li>
                        <li>Proactivity policy learned from signals to decide when to prompt vs stay reactive.</li>
                        <li>Personalization layer using embeddings + profile traits; memory scoped to user-approved domains.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Waseda University"
                    subtitle="LLM Engineer/Researcher"
                    date="Feb. 2025 -- Aug. 2025"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Implemented an advanced Retrieval-Augmented Generation (RAG) pipeline designed to process, retrieve, and generate responses for mathematical documents.</li>
                        <li>Integrated retrieval techniques, including Hypothetical Document Embeddings (HyDE), Query Rewriting, and Reciprocal Rank Fusion.</li>
                        <li>Programmed self-evaluation mechanisms, such as faithfulness and hallucination detection.</li>
                        <li>Optimised document processing workflows to support dynamic updates, contextual chunking, and incremental vector store updates without full reindexing.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Waseda University"
                    subtitle="Teaching Assistant (Foundations of Numerical Analysis)"
                    date="Apr. 2023 -- Aug. 2025"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Facilitated student learning through one-on-one and group support, helping students understand complex computational problems.</li>
                        <li>Developed at least 10 lecture materials on numerical analysis, applied mathematics, and computational algorithms.</li>
                        <li>Assessed student progress using professor-designed grading rubrics, ensuring clear feedback on algorithmic problem-solving.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Waseda University"
                    subtitle="Research Assistant"
                    date="May 2023 -- Aug. 2024"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Research Topic: Rigorous Verified Numerical Computation using Neural Networks and Deep Learning.</li>
                        <li>Translated code from MATLAB to Python (Tensorflow) or Julia (Flux), maintaining functionality and key algorithms.</li>
                        <li>Verified accuracy of numerical solutions against known datasets to reduce loss of accuracy.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="GDG on Campus Waseda University"
                    subtitle="Lead / Project Team Lead"
                    date="Oct. 2021 -- July 2024"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Restructured operations to improve collaboration and team efficiency as Chapter Lead.</li>
                        <li>Led project teams and managed technical initiatives.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="BMW Group"
                    subtitle="IT Intern"
                    date="Nov. 2022 -- Apr. 2023"
                    location="Tokyo, Japan"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Contributed to IT infrastructure optimisation and operational process improvement.</li>
                        <li>Enforced cross-functional teamwork using modern project management tools (Confluence, Jira).</li>
                        <li>Integrated Agile methodologies for improved workflow.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Republic of Singapore Air Force"
                    subtitle="Motor Transport Operator"
                    date="Dec. 2018 -- Oct. 2020"
                    location="Singapore"
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Directed and Produced a video project for the RSAF.</li>
                        <li>Best Airman Award (707 SQN & 207 SQN).</li>
                    </ul>
                </CvItem>
            </CvSection>

            <CvSection title="Publications & Research">
                <CvItem
                    title="Cryptology and Network Security 2025"
                    subtitle="Poster Author"
                    date="Sept. 2025 -- Nov. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Authored a poster that maps research gaps and proposes a unified building-block model and terminology for practical anonymous credential systems, with a focus on accountability, revocation, and the cryptographic subtleties of signature schemes used in privacy-preserving digital identity (EU wallet, My Number, etc.).</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Computer Security Symposium 2025"
                    subtitle="Research Paper Author"
                    date="Aug. 2025 -- Oct. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Authored research paper on presenting Verifiable Credentials by interpreting holder’s intent using LLM using Rust and SwiftUI implementations, finetuning a Gemma2 model, and integrating DCQL to further refine the accuracy of the retrieval process.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="Symposium on Cryptography and Information Security 2025"
                    subtitle="Research Paper Author / Co-Author"
                    date="Nov. 2024 -- Jan. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Authored research paper on comparative analysis of digital signature algorithms using Rust implementations, benchmarking computational efficiency through systematic experimentation.</li>
                        <li>Co-authored a research paper that implements and empirically evaluates a lattice-based, post-quantum anonymous credential framework (Bootle et al. 2023), identifying the NIZK matrix operations as the main performance bottleneck for real-world deployment.</li>
                    </ul>
                </CvItem>
            </CvSection>

            <CvSection title="Technical Projects">
                <CvItem
                    title="On-Device RAG System for Verifiable Credentials"
                    subtitle="Python, Swift, CoreML"
                    date="July 2025 -- Aug. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Fine-tuned BERT models for domain-specific NLP tasks, validating approach before scaling to larger models.</li>
                        <li>Implemented a custom RAG pipeline from scratch using Apple's NaturalLanguage framework for semantic search and CoreML for on-device inference.</li>
                        <li>Achieved 68% query accuracy with 1-second response times and &lt;100MB memory usage, demonstrating expertise in model optimization and edge deployment.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="LLM-Powered Security Agent"
                    subtitle="Python, LangChain, Slither"
                    date="Apr. 2025 -- Jul. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Architected a multi-agent LLM system for automated security evaluation, combining static and dynamic code analysis capabilities.</li>
                        <li>Successfully identified a critical logic bug in production cryptographic software, earning $2,000 bug bounty reward.</li>
                    </ul>
                </CvItem>

                <CvItem
                    title="KiwiTales (AI Story Generation App)"
                    subtitle="SwiftUI, Gemini API, Python"
                    date="Aug 2024 -- Jan. 2025"
                    location=""
                >
                    <ul className="list-disc list-outside ml-4 space-y-1">
                        <li>Designed and deployed production iOS app integrating Google's Gemini LLM and Stable Diffusion API for text-to-image generation.</li>
                        <li>Implemented asynchronous API orchestration and state management to optimize multi-modal generative AI performance on mobile devices.</li>
                    </ul>
                </CvItem>
            </CvSection>

            <CvSection title="Education">
                <CvItem
                    title="Waseda University"
                    subtitle="Master of Engineering - MEng, Computer Science and Communications Engineering"
                    date="Sep. 2024 -- Sep. 2026"
                    location="Tokyo, Japan"
                />
                <CvItem
                    title="Waseda University"
                    subtitle="Bachelor of Engineering - BE, Major in Mathematical Science"
                    date="Sep. 2020 -- Sep. 2024"
                    location="Tokyo, Japan"
                />
            </CvSection>

            <CvSection title="Skills & Languages">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                        <h4 className="font-medium mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
                            <BookOpen size={16} /> Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {['zkVMs', 'Verifiable Credentials', 'Anonymous Credentials', 'Python', 'Rust', 'Swift', 'Dart', 'MATLAB', 'Julia', 'React', 'GCP'].map(skill => (
                                <span key={skill} className="px-3 py-1 text-xs font-mono rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                        <h4 className="font-medium mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
                            <Globe size={16} /> Languages
                        </h4>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <li className="flex justify-between"><span>English</span> <span className="text-neutral-400">Native/Bilingual</span></li>
                            <li className="flex justify-between"><span>Japanese</span> <span className="text-neutral-400">Limited Working</span></li>
                            <li className="flex justify-between"><span>Thai</span> <span className="text-neutral-400">Elementary</span></li>
                            <li className="flex justify-between"><span>Chinese</span> <span className="text-neutral-400">Limited Working</span></li>
                            <li className="flex justify-between"><span>German</span> <span className="text-neutral-400">Elementary</span></li>
                        </ul>
                    </div>
                </div>
            </CvSection>

            <CvSection title="Awards & Certifications">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "Sumitomo Electric Group CSR Foundation Scholarship",
                        "Decentralized Identity Foundation Hackathon 2024",
                        "Solution Challenge 2022 Certificate of Recognition",
                        "Best Airman Award (707 SQN)",
                        "Best Airman Award (207 SQN)",
                        "CS101: Introduction to Cyber Security"
                    ].map((award, i) => (
                        <div key={i} className="flex items-start gap-3 p-3">
                            <Award size={16} className="text-indigo-600 dark:text-emerald-500 mt-1 shrink-0" />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">{award}</span>
                        </div>
                    ))}
                </div>
            </CvSection>

            <footer className="mt-20 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs font-mono text-neutral-400">
                © 2025 TAKUMI.DEV // CV_MODULE_LOADED
            </footer>
        </div>
    );
}
