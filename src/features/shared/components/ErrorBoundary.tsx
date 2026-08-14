import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div id="error-boundary-container" className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 max-w-xl mx-auto my-12 shadow-sm">
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 bg-rose-50 text-rose-600 rounded-2xl">
              <AlertOctagon className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Quelque chose s'est mal passé</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Une erreur inattendue est survenue lors du rendu de cette section. Nous avons enregistré le problème.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-xl text-left text-xs text-slate-600 font-mono overflow-auto max-h-32 max-w-md mx-auto border border-slate-200">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Réactualiser la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
