/**
 * ErrorBoundary
 *
 * Responsibility:
 * - Catch unexpected render errors in React component trees and show a user-friendly fallback.
 *
 * Why this exists:
 * - React errors during render otherwise blank the screen. This gives users (and us) a graceful recovery path.
 *
 * SOLID note:
 * - Single Responsibility: only handles UI-level exception boundaries, not networking or business logic.
 */

import React from "react";
import {Button} from "./ui/button";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage?: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }

  componentDidCatch(error: unknown) {
    // Keep logging minimal; no secrets.
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught error:", error);
  }

  private reset = () => {
    this.setState({hasError: false, errorMessage: undefined});
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-lg border bg-background p-6">
        <div className="text-lg font-semibold">Something went wrong</div>
        <div className="text-sm text-muted-foreground">
          The app hit an unexpected error while rendering. You can try reloading the page or resetting this view.
        </div>
        {this.state.errorMessage && (
          <pre className="whitespace-pre-wrap rounded-md bg-accent px-3 py-2 text-xs text-muted-foreground">
            {this.state.errorMessage}
          </pre>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={this.reset}>
            Reset view
          </Button>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }
}

