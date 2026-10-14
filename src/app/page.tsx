import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
}

interface AboutConfig {
  profile?: { research_interests?: string[] };
  sections?: SectionConfig[];
}

function renderSection(section: SectionConfig) {
  switch (section.type) {
    case 'markdown':
      return (
        <About
          key={section.id}
          content={section.source ? getMarkdownContent(section.source) : ''}
          title={section.title}
        />
      );
    case 'publications': {
      const publications = parseBibTeX(getBibtexContent('publications.bib'));
      const shown = section.filter === 'selected'
        ? publications.filter(p => p.selected)
        : publications;
      return (
        <SelectedPublications
          key={section.id}
          publications={shown.slice(0, section.limit || 5)}
          title={section.title}
        />
      );
    }
    case 'list': {
      const newsData = section.source ? getTomlContent<{ news: NewsItem[] }>(section.source) : null;
      return (
        <News
          key={section.id}
          items={newsData?.news || []}
          title={section.title}
        />
      );
    }
    default:
      return null;
  }
}

export default function Home() {
  const config = getConfig();
  const aboutConfig = getPageConfig<AboutConfig>('about');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* Profile becomes two ordered grid items on mobile and one sticky column on desktop. */}
        <Profile
          author={config.author}
          social={config.social}
          researchInterests={aboutConfig?.profile?.research_interests}
        />

        <div className="order-3 space-y-8 lg:order-none lg:col-span-2">
          <section id="about" className="scroll-mt-24 space-y-8">
            {(aboutConfig?.sections || []).map(renderSection)}
          </section>
        </div>
      </div>
    </div>
  );
}
