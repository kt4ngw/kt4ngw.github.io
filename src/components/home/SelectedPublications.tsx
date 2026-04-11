'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { venueMap } from '@/lib/venueMap';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-3">
                {publications.map((pub, index) => {
                    const rawVenue = pub.journal || pub.conference || '';
                    const displayVenue = venueMap[rawVenue] || rawVenue;

                    return (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
                        >
                            <h3 className="text-sm font-medium text-primary mb-1 leading-snug">
                                {pub.title}
                            </h3>

                            <p className="text-xs text-neutral-600 dark:text-neutral-500 mb-1 leading-relaxed">
                                {pub.authors.map((author, idx) => (
                                    <span key={idx}>
                                        <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                            {author.name}
                                        </span>
                                        {(author.isCoAuthor || author.isCorresponding) && (
                                            <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>
                                                {author.isCoAuthor && '†'}
                                                {author.isCorresponding && '*'}
                                            </sup>
                                        )}
                                        {idx < pub.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>

                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">
                                <span className="italic">{displayVenue}</span> · {pub.year}
                            </p>

                            {pub.description && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-2 leading-relaxed">
                                    {pub.description}
                                </p>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}