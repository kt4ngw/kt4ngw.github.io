'use client';

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
        <section className="fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                        <div
                            key={pub.id}
                            style={{ animationDuration: '0.4s', animationDelay: `${0.1 * index}s` }}
                            className="fade-in-up rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm transition-all duration-200 dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-800"
                        >
                            <h3 className="mb-2 text-base font-semibold leading-snug text-primary">
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

                            <p className="mb-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
                                <span className="italic">{displayVenue}</span>{' '}
                                <span className="whitespace-nowrap">· {pub.year}</span>
                                {(pub.url || pub.code) && (
                                    <>
                                        {' '}
                                        <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                                            <span aria-hidden="true">·</span>
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
                                                <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">/</span>
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
                                        </span>
                                    </>
                                )}
                            </p>

                            {pub.description && (
                                <p className="line-clamp-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
                                    {pub.description}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
