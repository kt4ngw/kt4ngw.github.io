import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { getConfig } from "@/lib/config";
import { getLastUpdated } from "@/lib/lastUpdated"; // 20250408: Add last updated import
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";


export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    metadataBase: new URL(config.site.url),
    title: {
      default: `${config.author.name} | Federated Learning & Edge Intelligence`,
      template: `%s | ${config.author.name}`
    },
    description: config.site.description,
    keywords: [config.author.name, "PhD", "Research", config.author.institution],
    authors: [{ name: config.author.name }],
    creator: config.author.name,
    publisher: config.author.name,
    icons: {
      icon: config.site.favicon,
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: '/',
      title: `${config.author.name} | Federated Learning & Edge Intelligence`,
      description: config.site.description,
      siteName: `${config.author.name}'s Academic Website`,
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${config.author.name}'s academic website`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.author.name} | Federated Learning & Edge Intelligence`,
      description: config.site.description,
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getConfig();
  const sameAs = [
    config.social.google_scholar,
    config.social.github,
    config.social.linkedin,
    config.social.orcid,
  ].filter((url): url is string => typeof url === 'string');
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.author.name,
    url: config.site.url,
    image: `${config.site.url}${config.author.avatar}`,
    jobTitle: config.author.title,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'RMIT University',
      url: 'https://www.rmit.edu.au/',
    },
    sameAs,
    knowsAbout: [
      'Federated Learning',
      'Edge Intelligence',
      'Privacy Protection',
      'Network and System Security',
    ],
  };
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href={config.site.favicon} type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-storage');
                const parsed = theme ? JSON.parse(theme) : null;
                const setting = parsed?.state?.theme || 'system';
                const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const effective = setting === 'dark' ? 'dark' : (setting === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
                var root = document.documentElement;
                root.classList.add(effective);
                root.setAttribute('data-theme', effective);
              } catch (e) {
                var root = document.documentElement;
                root.classList.add('light');
                root.setAttribute('data-theme', 'light');
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-primary focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navigation
            items={config.navigation}
            siteTitle={config.site.title}
            enableOnePageMode={config.features.enable_one_page_mode}
          />
          <main id="main-content" className="min-h-screen pt-16 lg:pt-20">
            {children}
          </main>
          <Footer lastUpdated={getLastUpdated()} />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
