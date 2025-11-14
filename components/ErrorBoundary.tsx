'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 * Catches React errors and displays a fallback UI
 * Prevents the entire app from crashing due to component errors
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('🔴 [Error Boundary] Caught an error:', error);
    console.error('📍 [Error Boundary] Component stack:', errorInfo.componentStack);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    // Reset state and navigate to home
    this.handleReset();
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-cinema-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-cinema-gold mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-cinema-text mb-6">
              We encountered an unexpected error. Don&apos;t worry, your data is safe.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg text-left">
                <p className="text-xs text-red-400 font-mono mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-300 mb-2">
                      Stack trace
                    </summary>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40 text-[10px]">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 bg-gray-800 text-cinema-text px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If this problem persists, please try refreshing the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
