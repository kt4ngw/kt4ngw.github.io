'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, FileText, Quote } from 'lucide-react';
import {
    MagnifyingGlassIcon,
    ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
}
import { venueMap } from '@/lib/venueMap';


interface FilterOption<T> {
    value: T;
    label: string;
}

// A row of text options; the selected one gets the same accent underline as the navigation.
function FilterGroup<T extends string | number>({ label, options, value, onChange }: {
    label: string;
    options: FilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1" role="group" aria-label={label}>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</span>
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => onChange(option.value)}
                        aria-pressed={active}
                        className={cn(
                            'relative pb-0.5 transition-colors',
                            active ? 'text-primary' : 'text-neutral-500 hover:text-primary'
                        )}
                    >
                        {option.label}
                        {active && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />}
                    </button>
                );
            })}
        </div>
    );
}

// Groups appear in this order; any other type follows, titled from its name.
const GROUPS: Array<{ type: string; title: string; prefix: string }> = [
    { type: 'journal', title: 'Journal Articles', prefix: 'J' },
    { type: 'conference', title: 'Conference Papers', prefix: 'C' },
    { type: 'preprint', title: 'Preprints', prefix: 'P' },
];

function groupInfo(type: string) {
    return GROUPS.find((group) => group.type === type) ?? {
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
        prefix: type.charAt(0).toUpperCase(),
    };
}

const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

// IEEE-style details after the venue: "vol. 25, no. 11, pp. 20443–20460, Nov. 2026".
function citationDetails(pub: Publication) {
    const parts: string[] = [];
    if (pub.volume) parts.push(`vol. ${pub.volume}`);
    if (pub.issue) parts.push(`no. ${pub.issue}`);
    if (pub.pages) parts.push(`pp. ${pub.pages.replace(/-+/g, '–')}`);
    const month = pub.month && /^\d+$/.test(pub.month) ? MONTHS[Number(pub.month) - 1] : pub.month;
    parts.push(month ? `${month} ${pub.year}` : String(pub.year));
    return parts.join(', ');
}

// Link and toggle buttons under each entry; `active` marks an open Abstract/BibTeX panel.
function pillClass(active: boolean) {
    return cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        active
            ? 'border-accent bg-accent/10 text-accent-dark'
            : 'border-neutral-200 text-accent hover:border-accent hover:bg-accent/5'
    );
}

export default function PublicationsList({ config, publications }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const rawVenue = pub.journal || pub.conference || '';
            const displayVenue = venueMap[rawVenue] || rawVenue;

            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                rawVenue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                displayVenue.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    // Numbers such as [J4] count each type oldest-first over the whole list, so filtering never renumbers.
    const labels = useMemo(() => {
        const map = new Map<string, string>();
        const counts = new Map<string, number>();
        [...publications]
            .map((pub, order) => ({ pub, order }))
            .sort((a, b) => a.pub.year - b.pub.year || b.order - a.order)
            .forEach(({ pub }) => {
                const next = (counts.get(pub.type) ?? 0) + 1;
                counts.set(pub.type, next);
                map.set(pub.id, `${groupInfo(pub.type).prefix}${next}`);
            });
        return map;
    }, [publications]);

    const groups = useMemo(() => {
        const order = [...GROUPS.map((group) => group.type), ...types.filter((type) => !GROUPS.some((g) => g.type === type))];
        return order
            .map((type) => ({ ...groupInfo(type), items: filteredPublications.filter((pub) => pub.type === type) }))
            .filter((group) => group.items.length > 0);
    }, [filteredPublications, types]);

    return (
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-primary mb-1">
                        {config.title}
                    </h1>

                    {/* Description and author-mark legend on one line. */}
                    <p className="text-sm text-neutral-500">
                        {config.description && <span className="text-neutral-600">{config.description} </span>}
                        († Equal contribution; * Corresponding author(s))
                    </p>
                </div>

                <div className="flex items-center gap-5 self-start whitespace-nowrap text-sm font-medium">
                    {config.scholarUrl && (
                        <a
                            href={config.scholarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline-offset-2 hover:underline"
                        >
                            Google Scholar <span aria-hidden="true">↗</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="mb-6 space-y-3">
                <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author, or venue"
                        aria-label="Search publications"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-0 border-b border-neutral-200 bg-transparent py-2 pl-6 pr-2 text-sm text-primary placeholder:text-neutral-400 transition-colors focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm">
                    <FilterGroup
                        label="Type"
                        value={selectedType}
                        onChange={setSelectedType}
                        options={[
                            { value: 'all', label: 'All' },
                            ...types.map((type) => ({
                                value: type,
                                label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
                            })),
                        ]}
                    />
                    <FilterGroup
                        label="Year"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={[
                            { value: 'all', label: 'All' },
                            ...years.map((year) => ({ value: year, label: String(year) })),
                        ]}
                    />
                    <span className="ml-auto text-xs tabular-nums text-neutral-500">
                        {filteredPublications.length} of {publications.length}
                    </span>
                </div>
            </div>

            {filteredPublications.length === 0 ? (
                <div className="card py-12 text-center text-neutral-500">
                    No publications found matching your criteria.
                </div>
            ) : (
                <div className="space-y-6">
                    {groups.map((group) => (
                        <section key={group.type} className="card">
                            <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-2">
                                <h2 className="text-xl font-semibold tracking-tight text-primary">{group.title}</h2>
                                <span className="text-xs tabular-nums text-neutral-500">{group.items.length}</span>
                            </div>

                            <ol className="space-y-5">
                                {group.items.map((pub) => {
                                    const rawVenue = pub.journal || pub.conference || '';
                                    const displayVenue = venueMap[rawVenue] || rawVenue;
                                    const abstractOpen = expandedAbstractId === pub.id;
                                    const bibtexOpen = expandedBibtexId === pub.id;

                                    return (
                                        <li key={pub.id} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 sm:gap-x-3">
                                            <span className="pt-0.5 text-sm font-medium tabular-nums text-accent">
                                                [{labels.get(pub.id)}]
                                            </span>

                                            <div>
                                                <p className="text-[0.95rem] leading-relaxed text-neutral-600">
                                                    {pub.authors.map((author, idx) => (
                                                        <span key={idx}>
                                                            <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                                {author.name}
                                                            </span>
                                                            {(author.isCoAuthor || author.isCorresponding) && (
                                                                <sup className={author.isHighlighted ? 'text-accent' : 'text-neutral-600'}>
                                                                    {author.isCoAuthor && '†'}
                                                                    {author.isCorresponding && '*'}
                                                                </sup>
                                                            )}
                                                            {idx < pub.authors.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                    {', '}
                                                    <span className="font-medium text-primary">&ldquo;{pub.title},&rdquo;</span>{' '}
                                                    {displayVenue && <><span className="italic">{displayVenue}</span>, </>}
                                                    {citationDetails(pub)}.
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {pub.url && (
                                                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className={pillClass(false)}>
                                                            <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Paper
                                                        </a>
                                                    )}
                                                    {pub.doi && (
                                                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className={pillClass(false)}>
                                                            DOI
                                                        </a>
                                                    )}
                                                    {pub.code && (
                                                        <a href={pub.code} target="_blank" rel="noopener noreferrer" className={pillClass(false)}>
                                                            <Code className="h-3.5 w-3.5" aria-hidden="true" /> Code
                                                        </a>
                                                    )}
                                                    {pub.abstract && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedAbstractId(abstractOpen ? null : pub.id)}
                                                            aria-expanded={abstractOpen}
                                                            className={pillClass(abstractOpen)}
                                                        >
                                                            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Abstract
                                                        </button>
                                                    )}
                                                    {pub.bibtex && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedBibtexId(bibtexOpen ? null : pub.id)}
                                                            aria-expanded={bibtexOpen}
                                                            className={pillClass(bibtexOpen)}
                                                        >
                                                            <Quote className="h-3.5 w-3.5" aria-hidden="true" /> BibTeX
                                                        </button>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {abstractOpen && pub.abstract ? (
                                                        <motion.div
                                                            key="abstract"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-3 overflow-hidden"
                                                        >
                                                            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                                                                <p className="text-sm leading-relaxed text-neutral-600">{pub.abstract}</p>
                                                            </div>
                                                        </motion.div>
                                                    ) : null}

                                                    {bibtexOpen && pub.bibtex ? (
                                                        <motion.div
                                                            key="bibtex"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-3 overflow-hidden"
                                                        >
                                                            <div className="relative rounded-md border border-neutral-200 bg-neutral-50 p-4">
                                                                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-neutral-600">
                                                                    {pub.bibtex}
                                                                </pre>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => navigator.clipboard.writeText(pub.bibtex || '')}
                                                                    className="absolute right-2 top-2 rounded-md border border-neutral-200 bg-surface p-1.5 text-neutral-500 transition-colors hover:text-accent"
                                                                    title="Copy to clipboard"
                                                                    aria-label="Copy BibTeX"
                                                                >
                                                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ) : null}
                                                </AnimatePresence>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}