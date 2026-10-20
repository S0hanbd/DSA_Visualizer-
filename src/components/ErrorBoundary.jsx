import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section role="alert" className="neo-panel m-6 p-6 space-y-4">
          <h1 className="text-2xl font-black">
            This visualization could not continue
          </h1>
          <p>
            Your browser could not render the current state. Restart the
            visualization or return to the catalog.
          </p>
          <button
            className="primary-button"
            onClick={() => this.setState({ failed: false })}
          >
            Restart visualization
          </button>
          <a className="soft-button ml-3" href="/">
            Return to catalog
          </a>
        </section>
      );
    return this.props.children;
  }
}
