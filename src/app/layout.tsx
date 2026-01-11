import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Mate - Yolculuk Paylaşımı',
  description: 'Güvenli ve ekonomik yolculuk paylaşım platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="flex flex-col min-h-full">
        <header className="bg-blue-600 text-white py-4 px-5 text-center shadow-md">
          <h1 className="text-2xl font-semibold m-0">Travel Mate</h1>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-100 py-4 px-5 text-center mt-auto">
          <p className="text-gray-600 m-0">
            © {new Date().getFullYear()} Travel Mate. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}