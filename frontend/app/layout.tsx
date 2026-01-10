import AuthProvider from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { PageTransition } from '@/components/ui/PageTransition'; // Import PageTransition
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ADD TaskFlow App',
  description: 'Task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            <ToastProvider>
              <PageTransition>
                 {children}
              </PageTransition>
            </ToastProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
