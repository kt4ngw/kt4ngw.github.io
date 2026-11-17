import VisitorMap from './VisitorMap';
import Image from 'next/image';
import { SiteConfig } from '@/lib/config';

// Solid brand marks, drawn on the same 24x24 grid so the four icons share one visual weight.
const BrandIcon = ({ path, className }: { path: string; className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
    </svg>
);

const GoogleScholarIcon = ({ className }: { className?: string }) => (
    <BrandIcon
        className={className}
        path="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"
    />
);

const GithubIcon = ({ className }: { className?: string }) => (
    <BrandIcon
        className={className}
        path="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <BrandIcon
        className={className}
        path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 4.341v6.791zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
);

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    researchInterests?: string[];
    // Card with only the photo, contact details and links, shown beside other pages on desktop.
    compact?: boolean;
}

export default function Profile({ author, social, researchInterests, compact = false }: ProfileProps) {
    const socialLinks = [
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: GoogleScholarIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: GithubIcon,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: LinkedinIcon,
        }] : []),
    ];

    return (
        // On desktop the sidebar is one card filling its fixed 20rem column, so the main column takes
        // the rest of the page width. On mobile each part is its own card.
        // It sticks where it starts (top-26 = the 5rem fixed nav plus the 1.5rem page padding), so the
        // photo stays clear of the nav while the sidebar is held in place.
        <div className={compact
            ? 'fade-in-up hidden lg:sticky lg:top-26 lg:block lg:self-start lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-surface lg:px-5 lg:py-6 lg:shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]'
            : 'fade-in-up contents lg:sticky lg:top-26 lg:block lg:self-start lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-surface lg:px-5 lg:py-6 lg:shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]'}>
            <div className="order-1 rounded-2xl border border-neutral-200 bg-surface p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:order-none">
            {/* Profile Image */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-5 rounded-full overflow-hidden bg-neutral-100">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            {/* Name and Title */}
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold tracking-tight text-primary mb-1">
                    {author.name}
                </h1>
                <p className="font-medium text-neutral-700 mb-1">
                    {author.title}
                </p>
                <p className="text-sm text-neutral-500 mb-1">
                    {author.institution}
                </p>
                <p className="text-sm text-neutral-500">
                    <a
                        href={`mailto:${author.email}`}
                        className="transition-colors duration-200 hover:text-accent"
                    >
                        {author.email}
                    </a>
                </p>
                {author.motto && (
                    <p className="mt-3 text-balance text-sm italic text-neutral-600">
                        {author.motto}
                    </p>
                )}
            </div>

            {/* Contact Links */}
            <div className={`flex flex-wrap justify-center gap-3 px-2 ${compact ? '' : 'lg:mb-8'}`}>
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-2 text-neutral-500 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                            {/* Shows immediately on hover or keyboard focus; the native title tooltip is slow and unreliable over SVGs. */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                            >
                                {link.name}
                            </span>
                        </a>
                    );
                })}
            </div>
            </div>

            {/* Research Interests */}
            {!compact && researchInterests && researchInterests.length > 0 && (
                <div className="order-2 rounded-2xl border border-neutral-200 bg-surface p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:order-none lg:mb-8">
                    <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Research Interests
                    </h3>
                    <ul className="space-y-1.5 text-sm text-neutral-700">
                        {researchInterests.map((interest, index) => (
                            <li key={index}>{interest}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Visitor map */}
            {!compact && (
            <div className="order-4 rounded-2xl border border-neutral-200 bg-surface p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 transition-transform duration-200 hover:scale-[1.02] lg:order-none">
                <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Visitors
                </h3>
                <VisitorMap />
            </div>
            )}

        </div>
    );
}
