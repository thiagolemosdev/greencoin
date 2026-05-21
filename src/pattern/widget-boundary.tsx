import { Component, type ReactNode, type ErrorInfo } from "react";
import { Alert, AlertTitle, AlertDescription } from "@ui/alert";
import { Button } from "@ui/button";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  error: Error | null;
};

export class WidgetBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static override getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  retry = () => this.setState({ error: null });

  override render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2 flex items-center gap-3">
            <span className="flex-1 text-sm">{this.state.error.message}</span>
            <Button variant="outline" size="sm" onClick={this.retry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
