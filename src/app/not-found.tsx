import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-7xl font-semibold tracking-tight text-accent sm:text-8xl">
          404
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          The page you are looking for may have moved or no longer exists.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-dark"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Return to homepage
          </Link>
          <Link
            href="/publications/"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-background px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent"
          >
            View publications
          </Link>
        </div>
      </div>
    </div>
  );
}
