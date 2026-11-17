export interface ServiceGroup {
    title: string;
    items: Array<{ date?: string; content: string; short?: string }>;
}

interface ServicesProps {
    groups: ServiceGroup[];
    title?: string;
}

// Homepage summary of content/services.toml: one line per role, venues by short name
// (full name on hover), without dates.
export default function Services({ groups, title = 'Services' }: ServicesProps) {
    if (groups.length === 0) return null;

    return (
        <section className="fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-4 border-b border-neutral-200 pb-2">
                <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
            </div>

            <div className="space-y-3">
                {groups.map((group) => (
                    <div key={group.title} className="sm:grid sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-4">
                        <h3 className="mb-1 text-sm text-neutral-500 sm:mb-0 sm:mt-1">
                            {group.title}
                        </h3>
                        <p className="text-base leading-relaxed text-neutral-700">
                            {group.items.map((item, i) => (
                                <span key={item.content}>
                                    {i > 0 && ', '}
                                    {item.short && item.short !== item.content ? (
                                        <abbr title={item.content} className="no-underline">{item.short}</abbr>
                                    ) : (
                                        item.content
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
