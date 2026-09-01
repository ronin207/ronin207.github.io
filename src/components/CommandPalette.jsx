import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileText, Home, User, Mail, Briefcase, BookOpen } from 'lucide-react';

const ITEMS = [
  { id: 'home', label: 'Home', section: 'Navigation', icon: Home, action: { type: 'navigate', to: '/' } },
  { id: 'cv', label: 'Curriculum vitae', section: 'Navigation', icon: FileText, action: { type: 'navigate', to: '/cv' } },
  { id: 'tokyo', label: 'Tokyo — Waseda University', section: 'Cities', icon: BookOpen, action: { type: 'navigate', to: '/work/tokyo' } },
  { id: 'singapore', label: 'Singapore — AIFT', section: 'Cities', icon: BookOpen, action: { type: 'navigate', to: '/work/singapore' } },
  { id: 'ai-identity', label: 'AI Identity Security', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/ai-identity-security' } },
  { id: 'ontovc', label: 'OntoVC', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/ontovc' } },
  { id: 'pq-creds', label: 'Post-Quantum Anonymous Credentials', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/pq-anonymous-credentials' } },
  { id: 'vc-wallet', label: 'Verifiable Credentials Wallet', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/verifiable-credentials-wallet' } },
  { id: 'security-agent', label: 'LLM Security Agent', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/security-agent' } },
  { id: 'kiwitales', label: 'KiwiTales', section: 'Research', icon: Briefcase, action: { type: 'navigate', to: '/projects/kiwitales' } },
  { id: 'thesis', label: "Master's thesis", section: 'Research', icon: BookOpen, action: { type: 'hash', to: '/#thesis' } },
  { id: 'about', label: 'Background', section: 'About', icon: User, action: { type: 'hash', to: '/#about' } },
];

const CommandPalette = ({ isOpen, onClose }) => {
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
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="glass relative w-full max-w-lg rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline">
          <Search size={15} className="text-ink-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search…"
            className="flex-1 bg-transparent outline-none text-sm text-ink placeholder-ink-3"
            spellCheck={false}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-hairline text-ink-3">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-ink-3">
              No results.
            </div>
          )}

          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              <div className="px-4 py-1.5 text-[11px] text-ink-3">
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
                        ? 'bg-mist text-ink'
                        : 'text-ink-2'
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
