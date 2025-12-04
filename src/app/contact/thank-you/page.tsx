import { Metadata } from 'next';
import { Button } from '@/components/ui/button'; // Assuming you have UI components; adjust if needed
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You | Burch Contracting',
  description: 'Thanks for reaching out! We\'ll be in touch soon.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          We\'ve received your message and one of our team will contact you within 24 hours to discuss your project.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
