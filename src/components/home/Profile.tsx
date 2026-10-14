import VisitorMap from './VisitorMap';
import Image from 'next/image';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';

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
}

export default function Profile({ author, social, researchInterests }: ProfileProps) {
    const socialLinks = [
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
    ];

    return (
        <div className="fade-in-up contents lg:sticky lg:top-8 lg:col-span-1 lg:block lg:self-start">
            <div className="order-1 lg:order-none">
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
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 lg:mb-8 px-2">
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
            {researchInterests && researchInterests.length > 0 && (
                <div className="order-2 lg:order-none lg:mb-8">
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
            <div className="order-4 transition-transform duration-200 hover:scale-[1.02] lg:order-none lg:mb-8">
                <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Visitors
                </h3>
                <VisitorMap />
            </div>

        </div>
    );
}
