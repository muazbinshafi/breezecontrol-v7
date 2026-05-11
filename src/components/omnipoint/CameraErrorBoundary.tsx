// CameraErrorBoundary — wraps the MediaPipe / camera pipeline so a model
// load failure or a thrown WebGL error doesn't blank the entire /demo page.
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (err: Error, reset: () => void) => ReactNode;
}
interface State {
  error: Error | null;
}

export class CameraErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[CameraErrorBoundary]", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);

    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Camera pipeline crashed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {this.state.error.message || "An unexpected error occurred while running the camera."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Try a different browser, disable browser extensions that intercept WebGL,
          or refresh the page.
        </p>
        <button
          onClick={this.reset}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }
}
