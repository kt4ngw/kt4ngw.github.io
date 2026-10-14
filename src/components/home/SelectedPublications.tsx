import Link from 'next/link';
import { Publication } from '@/types/publication';
import { venueMap, venueShort } from '@/lib/venueMap';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

export default function SelectedPublications({ publications, title = 'Selected Publications' }: SelectedPublicationsProps) {
    return (
        <section className="fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-2">
                <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
                <Link
                    href="/publications"
                    prefetch={true}
                    className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                    View all →
                </Link>
            </div>

            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const rawVenue = pub.journal || pub.conference || '';
                    const displayVenue = venueMap[rawVenue] || rawVenue;
                    const preprintLabel = /arxiv/i.test(rawVenue) ? 'arXiv' : 'Preprint';
                    const label = venueShort[rawVenue] || (pub.type === 'preprint' ? preprintLabel : '');
                    const badge = [label, pub.year].filter(Boolean).join(' ');

                    return (
                        <div
                            key={pub.id}
                            style={{ animationDuration: '0.4s', animationDelay: `${0.1 * index}s` }}
                            className="fade-in-up sm:grid sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:gap-3"
                        >
                            <div className="mb-1.5 sm:mb-0 sm:pt-0.5">
                                <span className="inline-block whitespace-nowrap rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent-dark">
                                    {badge}
                                </span>
                            </div>

                            <div>
                            <h3 className="mb-1 text-base font-medium leading-snug text-primary">
                                {pub.url ? (
                                    <a
                                        href={pub.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors hover:text-accent hover:underline underline-offset-2"
                                    >
                                        {pub.title}
                                    </a>
                                ) : (
                                    pub.title
                                )}
                            </h3>

                            <p className="mb-1 text-sm leading-relaxed text-neutral-600">
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

                            <p className="mb-1 text-sm leading-relaxed text-neutral-500">
                                <span className="italic">{displayVenue}</span>
                                {pub.code && (
                                    <>
                                        {/* Non-breaking space keeps the dot on the venue's line when the link wraps. */}
                                        {displayVenue && <span aria-hidden="true">{'\u00a0·'}</span>}{' '}
                                        <a
                                            href={pub.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-accent transition-colors hover:text-accent-dark hover:underline underline-offset-2"
                                        >
                                            Code
                                        </a>
                                    </>
                                )}
                            </p>

                            {pub.description && (
                                <p className="line-clamp-1 text-sm leading-relaxed text-neutral-500">
                                    {pub.description}
                                </p>
                            )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
