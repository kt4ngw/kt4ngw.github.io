import type { Metadata } from 'next';
import Link from 'next/link';
import { getBibtexContent } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import { venueMap } from '@/lib/venueMap';
import {
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Publications (Compact)',
  description: 'Compact publication list of Jian Tang, PhD student at RMIT University.',
  alternates: {
    canonical: '/publications/',
  },
};

function renderAuthors(
  authors: Array<{
    name: string;
    isHighlighted?: boolean;
    isCoAuthor?: boolean;
    isCorresponding?: boolean;
  }>
) {
  return authors.map((author, index) => {
    const marks = `${author.isCoAuthor ? '†' : ''}${author.isCorresponding ? '*' : ''}`;
    const isLast = index === authors.length - 1;
    const isSecondLast = index === authors.length - 2;

    let suffix = ', ';
    if (authors.length > 1 && isSecondLast) suffix = ', and ';
    if (isLast) suffix = '';

    return (
      <span key={`${author.name}-${index}`}>
        <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
          {author.name}
        </span>
        {marks && <sup className="ml-0.5">{marks}</sup>}
        {suffix}
      </span>
    );
  });
}

function formatJournalVenue(pub: {
  journal?: string;
  conference?: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
}) {
  const rawVenue = pub.journal || pub.conference || '';
  const displayVenue = venueMap[rawVenue] || rawVenue;

  let text = displayVenue;
  if (pub.volume) text += `, vol. ${pub.volume}`;
  if (pub.issue) text += `, no. ${pub.issue}`;
  if (pub.pages) text += `, pp. ${pub.pages}`;
  text += `, ${pub.year}`;

  return text;
}

function formatConferenceVenue(pub: {
  journal?: string;
  conference?: string;
  year: number;
  pages?: string;
}) {
  const rawVenue = pub.journal || pub.conference || '';
  const displayVenue = venueMap[rawVenue] || rawVenue;

  let text = displayVenue;
  if (pub.pages) text += `, pp. ${pub.pages}`;
  text += `, ${pub.year}`;

  return text;
}

export default function SimplePublicationsPage() {
  const bibtex = getBibtexContent('publications.bib');
  const publications = parseBibTeX(bibtex);

  const journalPubs = publications.filter((pub) => pub.type === 'journal');
  const conferencePubs = publications.filter((pub) => pub.type === 'conference');
  const preprints = publications.filter((pub) => pub.type === 'preprint');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">
            Publications
          </h1>
          <p className="text-lg text-neutral-600">
            Compact publication list.
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            † Equal contribution. * Corresponding author(s).
          </p>
        </div>

        <div className="flex flex-wrap gap-3 self-start">
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-background px-3.5 py-2 text-sm font-medium text-neutral-700 hover:border-accent hover:text-accent transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Full-View
          </Link>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold tracking-tight text-primary mb-4 pb-2 border-b border-neutral-200">
          Journal Papers
        </h2>

        <div className="space-y-3">
          {journalPubs.map((pub, index) => (
            <div
              key={pub.id}
              className="text-sm leading-relaxed text-neutral-700"
            >
              <span className="font-medium text-primary">[{journalPubs.length - index}] </span>
              {renderAuthors(pub.authors)}
              <span>, &quot;{pub.title},&quot; </span>
              <span className="italic">{formatJournalVenue(pub)}</span>
              <span>.</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-primary mb-4 pb-2 border-b border-neutral-200">
          Conference Papers
        </h2>

        <div className="space-y-3">
          {conferencePubs.map((pub, index) => (
            <div
              key={pub.id}
              className="text-sm leading-relaxed text-neutral-700"
            >
              <span className="font-medium text-primary">[{conferencePubs.length - index}] </span>
              {renderAuthors(pub.authors)}
              <span>, &quot;{pub.title},&quot; </span>
              <span className="italic">{formatConferenceVenue(pub)}</span>
              <span>.</span>
            </div>
          ))}
        </div>
      </section>

      {preprints.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-primary mb-4 pb-2 border-b border-neutral-200">
            Preprints
          </h2>

          <div className="space-y-3">
            {preprints.map((pub, index) => (
              <div
                key={pub.id}
                className="text-sm leading-relaxed text-neutral-700"
              >
                <span className="font-medium text-primary">[{preprints.length - index}] </span>
                {renderAuthors(pub.authors)}
                <span>, &quot;{pub.title},&quot; </span>
                <span className="italic">{formatConferenceVenue(pub)}</span>
                <span>.</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}