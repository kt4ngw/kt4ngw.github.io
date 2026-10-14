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
            <div className="w-40 h-40 sm:w-64 sm:h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
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
            <div className="text-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                    {author.name}
                </h1>
                <p className="text-lg text-accent font-medium mb-1">
                    {author.title}
                </p>
                <p className="text-neutral-600 mb-2">
                    {author.institution}
                </p>
                <p className="text-neutral-600 mb-2">
                    <a
                        href={`mailto:${author.email}`}
                        className="transition-colors duration-200 hover:text-accent"
                    >
                        {author.email}
                    </a>
                </p>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:mb-6 relative px-2">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>
            </div>

            {/* Research Interests */}
            {researchInterests && researchInterests.length > 0 && (
                <div className="order-2 rounded-lg bg-neutral-100 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-neutral-800 lg:order-none lg:mb-6">
                    <h3 className="font-semibold text-primary mb-3">Research Interests</h3>
                    <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-500">
                        {researchInterests.map((interest, index) => (
                            <div key={index}>{interest}</div>
                        ))}
                    </div>
                </div>
            )}

            {/* Visitor map */}
            <div className="order-4 rounded-lg bg-neutral-100 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-neutral-800 lg:order-none lg:mb-6">
                <h3 className="font-semibold text-primary mb-3">Visitors</h3>
                <VisitorMap />
            </div>

        </div>
    );
}
