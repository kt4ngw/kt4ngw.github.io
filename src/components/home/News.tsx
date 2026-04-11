// 'use client';

// import { motion } from 'framer-motion';

// export interface NewsItem {
//     date: string;
//     content: string;
// }

// interface NewsProps {
//     items: NewsItem[];
//     title?: string;
// }

// export default function News({ items, title = 'News' }: NewsProps) {
//     return (
//         <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.5 }}
//         >
//             <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>

//             <div className="max-h-60 overflow-y-auto rounded-lg border border-neutral-200 p-4 pr-2 space-y-3">
//                 {items
//                     .slice()
//                     .sort((a, b) => b.date.localeCompare(a.date))
//                     .map((item, index) => (
//                         <div key={index} className="flex items-start space-x-3">
//                             <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">
//                                 {item.date}
//                             </span>
//                             <p className="text-sm text-neutral-700">{item.content}</p>
//                         </div>
//                     ))}
//             </div>
//         </motion.section>
//     );
// }
'use client';

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
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>

            <div className="max-h-60 overflow-y-auto rounded-lg border border-neutral-200 p-4 pr-2 space-y-3">
                {items
                    .slice()
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">
                                {item.date}
                            </span>

                            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
        </motion.section>
    );
}