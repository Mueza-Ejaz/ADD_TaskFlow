import AuthProvider from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider'; // Import ToastProvider
import ReactQueryProvider from '@/providers/ReactQueryProvider'; // Import ReactQueryProvider
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
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <ToastProvider> {/* Wrap children with ToastProvider */}
              {children}
            </ToastProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}