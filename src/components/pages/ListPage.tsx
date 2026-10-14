import ReactMarkdown from 'react-markdown';
import { ListPageConfig } from '@/types/page';

// Newest first by the leading year (or year-month); entries from the same year keep file order.
const sortKey = (date: string) => date.match(/^\d{4}(-\d{2})?/)?.[0] ?? '';

// Dated entries (awards, services, ...) laid out like the homepage news: date on the left.
export default function ListPage({ config }: { config: ListPageConfig }) {
    return (
        <div
            style={{ animationDelay: '0.4s' }}
            className="fade-in-up max-w-3xl mx-auto"
        >
            <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">{config.title}</h1>
            {config.description && (
                <p className="text-lg text-neutral-600 mb-8 max-w-2xl">
                    {config.description}
                </p>
            )}

            <div className="space-y-10">
                {config.sections.map((section, sectionIndex) => (
                    <section key={section.title ?? sectionIndex}>
                        {section.title && (
                            <h2 className="mb-4 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                {section.title}
                            </h2>
                        )}
                        <ul className="space-y-3">
                            {section.items
                                .slice()
                                .sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)))
                                .map((item, itemIndex) => (
                                <li
                                    key={itemIndex}
                                    className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-4"
                                >
                                    <span className="text-sm tabular-nums text-neutral-500">{item.date}</span>
                                    <div className="leading-relaxed text-neutral-700">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => <>{children}</>,
                                                a: ({ ...props }) => (
                                                    <a
                                                        {...props}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-accent underline-offset-2 hover:underline"
                                                    />
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
                ))}
            </div>
        </div>
    );
}
