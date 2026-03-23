import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const COMMANDS = {
  help: () => [
    'Available commands:',
    '',
    '  help            Show this message',
    '  whoami          About Takumi',
    '  ls projects     List research projects',
    '  cat thesis      View thesis abstract',
    '  skills          Show technical skills',
    '  publications    List publications',
    '  contact         Contact information',
    '  awards          Awards & certifications',
    '  stack           Research stack',
    '  clear           Clear terminal',
    '  exit            Close terminal',
    '',
    'Tip: Press ` or ~ to toggle this terminal.',
  ],

  whoami: () => [
    'takumi@waseda:~$ identity --verbose',
    '',
    '  Name:       Takumi Otsuka',
    '  Role:       AI Security Research Intern @ AIFT',
    '  Affiliation: AIFT · Waseda University, Tokyo',
    '  Focus:      AI Security · Post-Quantum Cryptography · ZKPs',
    '  Mission:    Building cryptographic systems that remain',
    '              secure in a quantum era.',
    '',
    '  "The aesthetic of security will shift from visible',
    '   padlocks to invisible mathematics."',
  ],

  'ls projects': () => [
    'drwxr-xr-x  takumi  research  2026  ai-identity-security/',
    'drwxr-xr-x  takumi  research  2025  pq-anonymous-credentials/',
    'drwxr-xr-x  takumi  research  2025  verifiable-credentials-wallet/',
    'drwxr-xr-x  takumi  research  2025  security-agent/',
    'drwxr-xr-x  takumi  research  2024  kiwitales/',
    '',
    '  ai-identity-security           AI identity security @ AIFT (current)',
    '  pq-anonymous-credentials       zkVM vs SNARK for PQ anonymous creds',
    '  verifiable-credentials-wallet  On-device RAG for VC presentation',
    '  security-agent                 Multi-agent LLM security ($2K bounty)',
    '  kiwitales                      AI-powered story generation (iOS)',
    '',
    'Navigate to /projects/<name> for details.',
  ],

  'cat thesis': () => [
    '=== Post-Quantum Anonymous Credentials ===',
    'Status: IN_PROGRESS',
    '',
    'The advent of quantum computing demands a rapid transition',
    'to post-quantum cryptographic solutions. This research',
    'investigates zkVMs vs SNARK circuit compilers by implementing',
    'and benchmarking the BDEC verifier within both approaches.',
    '',
    'Focus:    zkVMs vs SNARK Compilers',
    'Protocol: Loquat / BDEC',
    'Metrics:  Prover time, verification time, memory usage',
  ],

  skills: () => [
    'TECHNICAL PROFICIENCY:',
    '',
    '  Cryptography  ████████████████████████████████████████████████  95%',
    '  Privacy       ████████████████████████████████████████████████  90%',
    '  AI / ML       ██████████████████████████████████████████████    85%',
    '  Mathematics   ██████████████████████████████████████████████    85%',
    '  Systems Eng   ████████████████████████████████████████████      80%',
    '  Blockchain    ██████████████████████████████████████            75%',
    '',
    'TOOLS: zkVMs, Rust, Python, Swift, Solidity, PyTorch, LangChain',
  ],

  publications: () => [
    '1. Cryptology and Network Security 2025 (CANS)',
    '   → Poster: Towards Practical Anonymous Credential Systems',
    '',
    '2. Computer Security Symposium 2025 (CSS)',
    '   → Paper: LLM intent interpretation for VC presentation',
    '',
    '3. Symposium on Cryptography & Information Security 2025 (SCIS)',
    '   → Paper: Digital signature algorithms for selective disclosure',
    '   → Co-author: Lattice-based PQ anonymous credential framework',
    '',
    'Total: 4 publications (2 papers, 1 poster, 1 co-authored)',
  ],

  contact: () => [
    'TRANSMISSION CHANNELS:',
    '',
    '  Email:    takumi_ot09@fuji.waseda.jp',
    '  GitHub:   github.com/ronin207',
    '  LinkedIn: linkedin.com/in/takumi-otsuka',
    '',
    'Status: Open to collaborations & research positions.',
  ],

  awards: () => [
    'AWARDS & CERTIFICATIONS:',
    '',
    '  ★ Sumitomo Electric Group CSR Foundation Scholarship',
    '  ★ Decentralized Identity Foundation Hackathon 2024',
    '  ★ Solution Challenge 2022 Certificate of Recognition',
    '  ★ Best Airman Award (707 SQN)',
    '  ★ Best Airman Award (207 SQN)',
    '  ★ CS101: Introduction to Cyber Security',
  ],

  stack: () => [
    'RESEARCH STACK:',
    '',
    '  ● Python    (NumPy, SciPy, PyTorch)',
    '  ● Rust      (High-performance crypto implementations)',
    '  ● C++       (Systems-level optimization)',
    '  ● Swift     (iOS / on-device ML)',
    '  ○ LaTeX     (Academic writing)',
    '  ○ MATLAB    (Numerical analysis)',
    '  ○ React     (Visualization & tooling)',
  ],
};

const Terminal = ({ isOpen, onClose, resolvedTheme }) => {
  const [history, setHistory] = useState([
    'TAKUMI.DEV Terminal v1.0.0',
    'Type "help" for available commands.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const prompt = `takumi@waseda:~$ ${cmd}`;

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmed === 'exit') {
      onClose();
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      setHistory((prev) => [...prev, prompt, ...handler(), '']);
    } else if (trimmed === '') {
      setHistory((prev) => [...prev, prompt]);
    } else {
      setHistory((prev) => [
        ...prev,
        prompt,
        `zsh: command not found: ${cmd.trim()}`,
        'Type "help" for available commands.',
        '',
      ]);
    }
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setCommandHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(trimmed));
      if (match) setInput(match);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Terminal window */}
      <div
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden animate-[terminalIn_0.2s_ease-out]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                aria-label="Close terminal"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            takumi@waseda — zsh
          </span>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-400 transition-colors"
            aria-label="Close terminal"
          >
            <X size={14} />
          </button>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="p-4 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed"
        >
          {history.map((line, i) => (
            <div key={i} className="text-emerald-400/90 whitespace-pre-wrap">
              {line}
            </div>
          ))}

          {/* Input line */}
          <div className="flex items-center gap-2 text-emerald-400/90">
            <span className="text-neutral-500 shrink-0">takumi@waseda:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-emerald-400 caret-emerald-400 font-mono text-sm"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
