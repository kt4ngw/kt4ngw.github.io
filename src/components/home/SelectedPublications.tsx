import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Publication } from '@/types/publication';
import { venueMap, venueShort } from '@/lib/venueMap';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

export default function SelectedPublications({ publications, title = 'Selected Publications' }: SelectedPublicationsProps) {
    return (
        <section className="card fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                            className={cn('fade-in-up', pub.preview && 'sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4')}
                        >
                            {pub.preview && (
                                <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-md border border-neutral-200 bg-white sm:mb-0">
                                    <Image
                                        src={`/papers/${pub.preview}`}
                                        alt=""
                                        fill
                                        sizes="(max-width: 640px) 100vw, 176px"
                                        className="object-contain"
                                    />
                                </div>
                            )}

                            <div>
                            <span className="mb-1 inline-block whitespace-nowrap rounded bg-highlight/10 px-1.5 py-0.5 text-xs font-medium text-highlight">
                                {badge}
                            </span>
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
                                        <span className={author.isHighlighted ? 'font-semibold text-primary' : ''}>
                                            {author.name}
                                        </span>
                                        {(author.isCoAuthor || author.isCorresponding) && (
                                            <sup className={`ml-0 ${author.isHighlighted ? 'text-primary' : 'text-neutral-600'}`}>
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
                                {[
                                    { label: 'Paper', href: pub.url },
                                    { label: 'Code', href: pub.code },
                                ]
                                    .filter((link) => link.href)
                                    .map((link, i) => (
                                        <span key={link.label}>
                                            {/* Non-breaking space keeps the dot on the previous item's line when a link wraps. */}
                                            {(i > 0 || displayVenue) && <span aria-hidden="true">{'\u00a0·'}</span>}{' '}
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-accent transition-colors hover:text-accent-dark hover:underline underline-offset-2"
                                            >
                                                {link.label}
                                            </a>
                                        </span>
                                    ))}
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
