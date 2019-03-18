import * as React from "react";

export interface IErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.PureComponent<{}, IErrorBoundaryState> {
    state: IErrorBoundaryState = {
        hasError: false,
        error: null
    }
    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error: error
        };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="errorBoundary">
                    <h3>Oops! Better fix this:</h3>
                    <span>
                        {this.state.error ? this.state.error.stack : null}
                    </span>
                </div>
            );
        }

        return this.props.children;
    }
}