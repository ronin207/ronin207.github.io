const en = {
  // Nav
  nav: {
    overview: 'Overview',
    research: 'Work',
    contact: 'Contact',
  },

  // Hero
  hero: {
    name: 'Takumi Otsuka',
    statement: 'Researching identity, cryptography, and verifiable intelligent systems.',
    description: 'Graduate researcher at Waseda University and AI security research intern at AIFT. Current work: anonymous credentials that remain secure against quantum adversaries, and evaluation methods for the security of AI systems.',
    cta_primary: 'Selected work',
    cta_secondary: 'Contact',
  },

  // Sections
  sections: {
    research: 'Selected work',
    active_research: 'Current research',
    philosophy: 'Background',
  },

  // Thesis
  thesis: {
    label: "Master's thesis",
    title: 'Post-Quantum Anonymous Credentials',
    status: 'In progress',
    description: "Investigating zkVMs versus SNARK circuit compilers for post-quantum anonymous credential systems. BDEC's reliance on static zkSNARK circuits limits dynamic attribute management. This research benchmarks the BDEC verifier within both approaches, measuring prover time, verification time, and memory usage.",
    focus: 'zkVMs vs SNARK compilers',
    protocol: 'Loquat / BDEC',
    application: 'Dynamic attribute management',
  },

  // OntoVC
  vcldac: {
    label: 'Secondary research',
    title: 'OntoVC',
    status: 'In progress',
    description: 'Extending Linked Data Verifiable Credentials to enable privacy-preserving multi-issuer ontological reasoning. A holder can prove derived facts from multiple independent credentials without revealing intermediate premises, via a two-layer verification architecture binding SNARK and Anonymous Credential systems, with complete LEAN 4 formal verification.',
    focus: 'ZK ontological reasoning',
    architecture: 'Two-layer SNARK + AC',
    verification: 'LEAN 4 + Rust',
  },

  // Background
  philosophy: {
    p1: 'My research sits at the intersection of cryptography, AI, and systems engineering, bridging theoretical hardness assumptions and practical, user-centric applications.',
    p2: 'My academic path moved from verified numerical computation for neural networks to the formal analysis of cryptographic protocols. The same rigor now applies to cryptographic hardness and to the security evaluation of AI systems.',
    stack_label: 'Working languages and tools',
  },

  // Contact
  contact: {
    title: 'Contact',
    subtitle: 'Open to research collaborations and conversations about cryptography, identity, and AI security.',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      sending: 'Sending…',
      sent: 'Message sent.',
      error: 'The message could not be sent. Email directly instead.',
    },
    cv_link: 'Curriculum vitae',
  },

  // Footer
  footer: {
    copyright: 'Takumi Otsuka',
    search_hint: 'Search',
  },

  // Project cards
  project: {
    view: 'View research',
    also: 'Other work',
  },

  // Common
  focus_area: 'Focus',
  key_protocol: 'Protocols',
  application: 'Application',
  architecture: 'Architecture',
  verification: 'Verification',
  tech_stack: 'Tools and methods',
  problem: 'Why this problem matters',
  approach: 'Approach',
  outcomes: 'Key results',
  technical_details: 'Technical details',
  artifacts: 'Artifacts',
  return_home: 'Back to home',
  back_to_projects: 'Back to all work',
  source_code: 'Source code',
  research_paper: 'Paper',
};

export default en;
