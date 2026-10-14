'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
import Link from 'next/link';
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

    return (
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">
                        {config.title}
                    </h1>

                    {config.description && (
                        <p className="text-lg text-neutral-600 max-w-2xl">
                            {config.description}
                        </p>
                    )}

                    <p className="text-sm text-neutral-500 mt-2">
                        † Equal contribution. * Corresponding author(s).
                    </p>
                </div>

                <div className="flex items-center gap-5 self-start whitespace-nowrap text-sm font-medium">
                    <Link href="/publications/simple" className="text-accent underline-offset-2 hover:underline">
                        Compact view <span aria-hidden="true">→</span>
                    </Link>

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

            <div className="mb-8 space-y-4">
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

            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        No publications found matching your criteria.
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => {
                        const rawVenue = pub.journal || pub.conference || '';
                        const displayVenue = venueMap[rawVenue] || rawVenue;

                        return (
                            <div
                                key={pub.id}
                                style={{ animationDuration: '0.4s', animationDelay: `${0.1 * index}s` }}
                                className="fade-in-up"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {pub.preview && (
                                        <div className="w-full md:w-40 flex-shrink-0">
                                            <div className="aspect-video md:aspect-[4/3] relative rounded-md overflow-hidden border border-neutral-200 bg-neutral-50">
                                                <Image
                                                    src={`/papers/${pub.preview}`}
                                                    alt={pub.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-grow">
                                        <h3 className="text-base font-medium text-primary mb-1.5 leading-snug">
                                            {pub.url ? (
                                                <a
                                                    href={pub.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-accent hover:underline underline-offset-4 transition-colors"
                                                >
                                                    {pub.title}
                                                </a>
                                            ) : (
                                                pub.title
                                            )}
                                        </h3>

                                        <p className="text-sm text-neutral-600 mb-1 leading-relaxed">
                                            {pub.authors.map((author, idx) => (
                                                <span key={idx}>
                                                    <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                        {author.name}
                                                    </span>
                                                    {(author.isCoAuthor || author.isCorresponding) && (
                                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600'}`}>
                                                            {author.isCoAuthor && '†'}
                                                            {author.isCorresponding && '*'}
                                                        </sup>
                                                    )}
                                                    {idx < pub.authors.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>

                                        <p className="text-xs text-neutral-600 mb-2">
                                            {displayVenue && (<><span className="italic">{displayVenue}</span> · </>)}{pub.year}
                                        </p>

                                        {pub.description && (
                                            <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                                                {pub.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                            {pub.doi && (
                                                <a
                                                    href={`https://doi.org/${pub.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-accent underline-offset-2 hover:underline"
                                                >
                                                    DOI
                                                </a>
                                            )}

                                            {pub.code && (
                                                <a
                                                    href={pub.code}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-accent underline-offset-2 hover:underline"
                                                >
                                                    Code
                                                </a>
                                            )}

                                            {pub.abstract && (
                                                <button
                                                    onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                    className={cn(
                                                        'font-medium underline-offset-2 hover:underline',
                                                        expandedAbstractId === pub.id ? 'text-primary underline' : 'text-accent'
                                                    )}
                                                >
                                                    Abstract
                                                </button>
                                            )}

                                            {pub.bibtex && (
                                                <button
                                                    onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                    className={cn(
                                                        'font-medium underline-offset-2 hover:underline',
                                                        expandedBibtexId === pub.id ? 'text-primary underline' : 'text-accent'
                                                    )}
                                                >
                                                    BibTeX
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {expandedAbstractId === pub.id && pub.abstract ? (
                                                <motion.div
                                                    key="abstract"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="bg-neutral-50 rounded-md p-4 border border-neutral-200">
                                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                                            {pub.abstract}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : null}

                                            {expandedBibtexId === pub.id && pub.bibtex ? (
                                                <motion.div
                                                    key="bibtex"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="relative bg-neutral-50 rounded-md p-4 border border-neutral-200">
                                                        <pre className="text-xs text-neutral-600 overflow-x-auto whitespace-pre-wrap font-mono">
                                                            {pub.bibtex}
                                                        </pre>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(pub.bibtex || '');
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 rounded-md bg-background text-neutral-500 hover:text-accent border border-neutral-200 transition-colors"
                                                            title="Copy to clipboard"
                                                        >
                                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}