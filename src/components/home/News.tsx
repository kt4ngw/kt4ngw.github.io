'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

// The rest of the list stays behind a "Show all" toggle instead of an inner scroll area.
const INITIAL_COUNT = 5;

export default function News({ items, title = 'News' }: NewsProps) {
    const [showAll, setShowAll] = useState(false);
    const sorted = items.slice().sort((a, b) => b.date.localeCompare(a.date));
    const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);

    return (
        <section className="fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-2">
                <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
                {sorted.length > INITIAL_COUNT && (
                    <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        aria-expanded={showAll}
                        className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                    >
                        {showAll ? 'Show less' : `Show all (${sorted.length})`}
                    </button>
                )}
            </div>

            <ul className="space-y-4">
                {visible.map((item, index) => (
                    <li key={index} className="grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 sm:gap-x-4">
                        <span className="mt-1 text-sm tabular-nums text-neutral-500">
                            {item.date}
                        </span>

                        <div className="text-base leading-relaxed text-neutral-700">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ children }) => <p>{children}</p>,
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-primary">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-neutral-600">
                                            {children}
                                        </em>
                                    ),
                                    a: ({ ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent font-medium hover:underline"
                                        />
                                    ),
                                    span: ({ className, children }) => (
                                        <span className={className}>{children}</span>
                                    ),
                                }}
                            >
                                {item.content}
                            </ReactMarkdown>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
