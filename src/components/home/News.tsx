'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

export default function News({ items, title = 'News' }: NewsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [canScrollFurther, setCanScrollFurther] = useState(false);

    useEffect(() => {
        const viewport = scrollRef.current;
        const content = contentRef.current;
        if (!viewport || !content) return;

        const updateScrollHint = () => {
            setCanScrollFurther(viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight > 1);
        };

        updateScrollHint();
        viewport.addEventListener('scroll', updateScrollHint, { passive: true });
        const observer = new ResizeObserver(updateScrollHint);
        observer.observe(viewport);
        observer.observe(content);

        return () => {
            viewport.removeEventListener('scroll', updateScrollHint);
            observer.disconnect();
        };
    }, [items]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>

            <div
                className="news-scroll-frame relative overflow-hidden rounded-lg border border-neutral-200"
                data-can-scroll={canScrollFurther}
            >
                <div
                    ref={scrollRef}
                    role="region"
                    aria-label={`${title} updates`}
                    tabIndex={0}
                    className="news-scroll max-h-60 overflow-y-auto rounded-lg p-4 pr-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                    <div ref={contentRef} className="space-y-4">
                        {items
                            .slice()
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map((item, index) => (
                                <div key={index} className="grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 sm:gap-x-4">
                                    <span className="mt-1 text-sm text-neutral-500">
                                        {item.date}
                                    </span>

                                    <div className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
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
                                                    <em className="italic text-neutral-600 dark:text-neutral-400">
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
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
