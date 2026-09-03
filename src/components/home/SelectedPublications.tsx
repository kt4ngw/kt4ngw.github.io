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
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="rounded text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10 hover:text-accent-dark hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const rawVenue = pub.journal || pub.conference || '';
                    const displayVenue = venueMap[rawVenue] || rawVenue;

                    return (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm transition-all duration-200 dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-800"
                        >
                            <h3 className="mb-1.5 text-base font-medium leading-snug text-primary">
                                {pub.title}
                            </h3>

                            <p className="mb-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-500">
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

                            <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-500">
                                <span className="italic">{displayVenue}</span> · {pub.year}
                                {(pub.url || pub.code) && (
                                    <>
                                        <span aria-hidden="true"> · </span>
                                        {pub.url && (
                                            <a
                                                href={pub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-accent transition-colors hover:text-accent-dark hover:underline underline-offset-2"
                                            >
                                                Paper
                                            </a>
                                        )}
                                        {pub.url && pub.code && (
                                            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600"> / </span>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-accent transition-colors hover:text-accent-dark hover:underline underline-offset-2"
                                            >
                                                Code
                                            </a>
                                        )}
                                    </>
                                )}
                            </p>

                            {pub.description && (
                                <p className="line-clamp-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
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
