'use client';

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import QueryProvider from './QueryProvider';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * Client-side layout wrapper
 * Wraps the app with QueryProvider for data caching and ErrorBoundary for global error handling
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryProvider>
      <ErrorBoundary>
        <Header />
        {children}
      </ErrorBoundary>
    </QueryProvider>
  );
}
