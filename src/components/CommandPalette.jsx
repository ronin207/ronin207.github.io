import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileText, Home, User, Mail, Briefcase, BookOpen } from 'lucide-react';

const ITEMS = [
  { id: 'home', label: 'Home', section: 'Navigation', icon: Home, action: { type: 'navigate', to: '/' } },
  { id: 'research', label: 'Research Areas', section: 'Navigation', icon: BookOpen, action: { type: 'hash', to: '/#research' } },
  { id: 'contact', label: 'Contact', section: 'Navigation', icon: Mail, action: { type: 'hash', to: '/#contact' } },
  { id: 'cv', label: 'CV / Resume', section: 'Navigation', icon: FileText, action: { type: 'navigate', to: '/cv' } },
  { id: 'ai-identity', label: 'AI Identity Security (AIFT)', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/ai-identity-security' } },
  { id: 'ontovc', label: 'OntoVC (ZK Ontological Reasoning)', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/ontovc' } },
  { id: 'pq-creds', label: 'Post-Quantum Anonymous Credentials', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/pq-anonymous-credentials' } },
  { id: 'vc-wallet', label: 'Verifiable Credentials Wallet', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/verifiable-credentials-wallet' } },
  { id: 'security-agent', label: 'LLM Security Agent', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/security-agent' } },
  { id: 'kiwitales', label: 'KiwiTales', section: 'Projects', icon: Briefcase, action: { type: 'navigate', to: '/projects/kiwitales' } },
  { id: 'thesis', label: "Master's Thesis", section: 'Research', icon: BookOpen, action: { type: 'hash', to: '/#thesis' } },
  { id: 'about', label: 'Philosophy', section: 'About', icon: User, action: { type: 'hash', to: '/#about' } },
];

const CommandPalette = ({ isOpen, onClose, resolvedTheme }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return ITEMS;
    const q = query.toLowerCase();
    return ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
    );
  }, [query]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered.length]);

  const executeItem = (item) => {
    onClose();
    if (item.action.type === 'navigate') {
      navigate(item.action.to);
    } else if (item.action.type === 'hash') {
      const [path, hash] = item.action.to.split('#');
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeItem(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Group by section
  const sections = {};
  filtered.forEach((item) => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden ${
        resolvedTheme === 'dark'
          ? 'bg-[#0a0a0a] border-neutral-800'
          : 'bg-white border-neutral-200'
      }`}>
        {/* Search input */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${
          resolvedTheme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <Search size={16} className="text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, projects..."
            className={`flex-1 bg-transparent outline-none text-sm font-mono ${
              resolvedTheme === 'dark'
                ? 'text-neutral-200 placeholder-neutral-600'
                : 'text-neutral-900 placeholder-neutral-400'
            }`}
            spellCheck={false}
          />
          <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            resolvedTheme === 'dark'
              ? 'border-neutral-700 text-neutral-500 bg-neutral-800'
              : 'border-neutral-300 text-neutral-400 bg-neutral-100'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-neutral-500 font-mono">
              No results found.
            </div>
          )}

          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              <div className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest ${
                resolvedTheme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                {section}
              </div>
              {items.map((item) => {
                const currentIndex = globalIndex++;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      currentIndex === selectedIndex
                        ? resolvedTheme === 'dark'
                          ? 'bg-neutral-800/80 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                        : resolvedTheme === 'dark'
                          ? 'text-neutral-400 hover:text-neutral-200'
                          : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Icon size={14} className="shrink-0 opacity-60" />
                    <span className="flex-1">{item.label}</span>
                    {currentIndex === selectedIndex && (
                      <ArrowRight size={12} className="opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
