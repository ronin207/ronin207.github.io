const en = {
  // Nav
  nav: {
    overview: 'overview',
    research: 'research',
    contact: 'contact',
  },

  // Hero
  hero: {
    badge: 'AI Security Research @ AIFT · MEng @ Waseda',
    title_1: 'Optimizing the',
    title_2: 'Quantum_Future',
    description: 'Researching **AI Security**, **Post-Quantum Cryptography**, and **Zero-Knowledge Proofs** at Waseda University and AIFT. Building cryptographic systems that remain secure in a quantum era.',
    cta_primary: 'View Protocols',
    cta_secondary: './contact_takumi',
  },

  // Sections
  sections: {
    research: 'Research Areas',
    interests: 'Intersection Interests',
    active_research: 'Active Research',
    philosophy: 'Philosophy',
  },

  // Intersection Interests
  interests: {
    p1: 'My research sits at the intersection of **Cryptography**, **AI**, and **Systems Engineering**. I aim to bridge the gap between theoretical hardness assumptions and practical, user-centric applications.',
    p2: 'By combining these fields, I explore how modern AI can be both a tool for cryptanalysis and a beneficiary of privacy-preserving technologies like Zero-Knowledge Proofs and FHE.',
  },

  // Thesis
  thesis: {
    label: "Master's Thesis",
    title: 'Post-Quantum Anonymous Credentials',
    status: 'IN_PROGRESS',
    description: "Investigating zkVMs vs SNARK circuit compilers for post-quantum anonymous credential systems. BDEC's reliance on static zkSNARK circuits leads to critical inflexibility for dynamic attribute management. This research benchmarks the BDEC verifier within both zkVM and circuit compiler approaches, measuring prover time, verification time, and memory usage to determine the more viable foundation for next-generation digital identity.",
    focus: 'zkVMs vs SNARK Compilers',
    protocol: 'Loquat / BDEC',
    application: 'Dynamic Attribute Management',
  },

  // VC-LDAC
  vcldac: {
    label: 'Secondary Research',
    title: 'VC-LDAC',
    status: 'IN_PROGRESS',
    description: 'Extending Linked Data Verifiable Credentials to enable privacy-preserving multi-issuer ontological reasoning. A holder can prove derived facts from multiple independent credentials using domain-specific ontologies without revealing intermediate premises. Features a two-layer verification architecture binding SNARK and Anonymous Credential systems, with complete LEAN 4 formal verification.',
    focus: 'ZK Ontological Reasoning',
    architecture: 'Two-Layer SNARK + AC',
    verification: 'LEAN 4 + Rust',
  },

  // Philosophy
  philosophy: {
    transition_label: 'Transition',
    transition: 'My academic path has evolved from numerical optimisations of neural networks to formalising mathematical rigor to secure cryptographic protocols. While I retain a strong background in rigorous verification, my current rigor is applied to **Cryptographic Hardness** and **Numerical Optimisations**.',
    belief: 'I believe that as quantum computing matures, the aesthetic of security will shift from "visible padlocks" to "invisible mathematics." I aim to build systems that remain secure in a post-quantum world.',
    stack_label: 'Research Stack',
  },

  // Contact
  contact: {
    title: 'Begin Transmission',
    subtitle: 'Open to academic collaborations, research assistant positions, and interesting conversations.',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      sent: 'Sent!',
      error: 'Something went wrong. Try emailing directly instead.',
    },
    cv_link: 'view_cv.jsx',
  },

  // Footer
  footer: {
    copyright: 'TAKUMI.DEV',
    system: 'System',
    terminal: 'terminal',
    search: 'search',
  },

  // Project cards
  project: {
    view: 'VIEW_PROJECT',
  },

  // Common
  focus_area: 'Focus Area',
  key_protocol: 'Key Protocol',
  application: 'Application',
  architecture: 'Architecture',
  verification: 'Verification',
  tech_stack: 'Tech Stack',
  problem: 'Problem',
  approach: 'Technical Approach',
  outcomes: 'Key Outcomes',
  return_home: 'RETURN_HOME',
  back_to_projects: 'Back to all projects',
  source_code: 'Source Code',
  research_paper: 'Research Paper',
};

export default en;
