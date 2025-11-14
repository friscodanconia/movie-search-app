'use client';

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * Client-side layout wrapper
 * Wraps the app with ErrorBoundary for global error handling
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      <Header />
      {children}
    </ErrorBoundary>
  );
}
