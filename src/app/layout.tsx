import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { businessConfig } from '@/config/business';
import '../index.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: businessConfig.seo.defaultTitle,
  description: businessConfig.seo.defaultDescription,
  keywords: businessConfig.seo.keywords,
  openGraph: {
    title: businessConfig.seo.defaultTitle,
    description: businessConfig.seo.defaultDescription,
    url: businessConfig.seo.baseUrl,
    siteName: businessConfig.name,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Contractor',
    name: businessConfig.name,
    description: businessConfig.description,
    url: businessConfig.seo.baseUrl,
    telephone: businessConfig.contact.phone,
    email: businessConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessConfig.contact.address,
      addressLocality: businessConfig.contact.city,
      addressRegion: businessConfig.contact.state,
      postalCode: businessConfig.contact.zip,
    },
    areaServed: businessConfig.serviceArea.locations.map(location => ({
      '@type': 'City',
      name: location,
    })),
    priceRange: '$$',
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
