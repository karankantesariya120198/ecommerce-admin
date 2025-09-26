import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed.
    // See: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center" }}>
          <pre style={{ color: "red" }}>
            {process.env.NODE_ENV === "development"
              ? this.state.error?.toString()
              : "An unexpected error occurred. Please try again later."}
          </pre>
          <pre style={{ color: "red" }}>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
