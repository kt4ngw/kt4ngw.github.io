export interface AwardItem {
    date: string;
    content: string;
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

// Homepage list of content/awards.toml, laid out like News: date column, then the award.
export default function Awards({ items, title = 'Awards' }: AwardsProps) {
    if (items.length === 0) return null;

    return (
        <section className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-4 border-b border-neutral-200 pb-2">
                <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
            </div>

            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item.content} className="grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 sm:gap-x-4">
                        <span className="mt-1 min-w-[5.25rem] text-sm tabular-nums text-neutral-500">
                            {item.date}
                        </span>
                        <span className="text-base leading-relaxed text-neutral-700">{item.content}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
