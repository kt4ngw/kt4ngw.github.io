import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
}

export default function TextPage({ config, content }: TextPageProps) {
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
            <div className="text-neutral-700 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-2xl font-semibold tracking-tight text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold tracking-tight text-primary mt-8 mb-4 pb-2 border-b border-neutral-200">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-accent underline-offset-2 hover:underline"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
