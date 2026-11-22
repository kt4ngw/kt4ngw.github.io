import Link from 'next/link';
import Image from 'next/image';
import { Code, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Publication } from '@/types/publication';
import { venueMap, venueShort } from '@/lib/venueMap';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

// Same pill buttons as the Publications page.
const pillClass =
    'inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-medium text-accent transition-colors hover:border-accent hover:bg-accent/5';

// Entries use the Publications page's citation style, with the paper figure on the left.
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

            <ol className="space-y-5">
                {publications.map((pub, index) => {
                    const rawVenue = pub.journal || pub.conference || '';
                    const displayVenue = venueMap[rawVenue] || rawVenue;
                    // Amber venue badge ("TMC 2026") leading the button row; it stands in for the venue and year.
                    const badge = venueShort[rawVenue] ? `${venueShort[rawVenue]} ${pub.year}` : '';

                    return (
                        <li
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
                                {/* Title first, then the authors; the badge below stands in for venue and year. */}
                                <h3 className="text-[0.95rem] font-medium leading-relaxed text-primary">
                                    {pub.title}
                                </h3>

                                <p className="text-[0.95rem] leading-relaxed text-neutral-600">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={author.isHighlighted ? 'font-semibold text-self' : ''}>
                                                {author.name}
                                            </span>
                                            {(author.isCoAuthor || author.isCorresponding) && (
                                                <sup className={author.isHighlighted ? 'text-self' : 'text-neutral-600'}>
                                                    {author.isCoAuthor && '†'}
                                                    {author.isCorresponding && '*'}
                                                </sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                    {!badge && (
                                        <>
                                            {'. '}
                                            {displayVenue && <><span className="italic">{displayVenue}</span>, </>}
                                            {pub.year}.
                                        </>
                                    )}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {badge && (
                                        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-highlight/10 px-2.5 py-0.5 text-xs font-semibold text-highlight">
                                            {badge}
                                        </span>
                                    )}
                                    {pub.url && (
                                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className={pillClass}>
                                            <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Paper
                                        </a>
                                    )}
                                    {pub.code && (
                                        <a href={pub.code} target="_blank" rel="noopener noreferrer" className={pillClass}>
                                            <Code className="h-3.5 w-3.5" aria-hidden="true" /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
