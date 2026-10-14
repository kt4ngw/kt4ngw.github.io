'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SiteConfig } from '@/lib/config';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
}

export default function Navigation({ items, siteTitle }: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <div
            className={cn(
              'border-b transition-colors duration-300',
              scrolled || open
                ? 'bg-background/90 backdrop-blur border-neutral-200'
                : 'bg-transparent border-transparent'
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 lg:h-20">
                <Link
                  href="/"
                  className="text-lg lg:text-xl font-semibold tracking-tight text-primary hover:text-accent transition-colors duration-200"
                >
                  {siteTitle}
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                  <div className="flex items-center gap-7">
                    {items.map((item) => {
                      const isActive = isCurrent(item.href);

                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          prefetch={true}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'relative py-2 text-sm font-medium transition-colors duration-200',
                            isActive ? 'text-primary' : 'text-neutral-500 hover:text-primary'
                          )}
                        >
                          {item.title}
                          {isActive && (
                            // Shared layoutId slides the underline to the newly active item on navigation.
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                              initial={false}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  <ThemeToggle />
                </div>

                {/* Mobile menu button and theme toggle */}
                <div className="lg:hidden flex items-center gap-2">
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <Disclosure.Panel className="lg:hidden bg-background border-b border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 py-2 space-y-1 sm:px-6">
              {items.map((item) => {
                const isActive = isCurrent(item.href);

                return (
                  <Disclosure.Button
                    key={item.title}
                    as={Link}
                    href={item.href}
                    prefetch={true}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block border-l-2 py-2 pl-3 text-base font-medium transition-colors duration-200',
                      isActive
                        ? 'border-accent text-primary'
                        : 'border-transparent text-neutral-500 hover:text-primary'
                    )}
                  >
                    {item.title}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
