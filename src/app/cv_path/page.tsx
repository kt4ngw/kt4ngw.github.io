import type { Metadata } from 'next';
import CVPageContent from '@/components/pages/CVPageContent';

export const metadata: Metadata = {
  title: 'Curriculum Vitae',
  description: 'Curriculum vitae of Jian Tang, PhD student at RMIT University.',
  alternates: {
    canonical: '/cv/',
  },
};

export default function LegacyCVPage() {
  return <CVPageContent />;
}
