"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertTriangle, RefreshCcw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error("Error Boundary caught an error:", error, errorInfo)

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // In production, you would send this to an error reporting service like Sentry
    if (process.env.NODE_ENV === "production") {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Something went wrong</CardTitle>
                  <CardDescription>An error occurred while rendering this page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-900 mb-2">Error Details:</p>
                  <code className="text-xs text-red-800 block overflow-x-auto">
                    {this.state.error?.toString()}
                  </code>
                </div>

                {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                  <details className="rounded-lg bg-slate-100 border border-slate-200 p-4">
                    <summary className="text-sm cursor-pointer text-slate-900 mb-2">
                      Stack Trace (Development Only)
                    </summary>
                    <code className="text-xs text-slate-700 block overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </code>
                  </details>
                )}

                <div className="text-sm text-slate-600">
                  <p>This error has been logged. You can try:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Refreshing the page</li>
                    <li>Going back to the home page</li>
                    <li>Clearing your browser cache</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button onClick={this.handleReset} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={this.handleReload} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional error boundary component for specific sections
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-600 mb-4 max-w-md">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={resetError} size="sm">
        Try Again
      </Button>
    </div>
  )
}
