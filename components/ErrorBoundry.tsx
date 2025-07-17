import React, { Component, ReactNode } from "react"
import ServerErrorScreen from "./ErrorScreen"
import { useGlobalErrorStore } from "@/store/useGlobalErrorStore"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    })

    const { setError } = useGlobalErrorStore.getState()
    setError({
      message: error.message,
      code: "APP_ERROR",
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    const { clearError } = useGlobalErrorStore.getState()
    clearError()
  }

  handleContactSupport = () => {
    console.log("Contact support requested")
  }

  render() {
    const { error } = useGlobalErrorStore.getState()

    if (this.state.hasError || this.state.error || error) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ServerErrorScreen
          onRetry={this.handleRetry}
          onContactSupport={this.handleContactSupport}
          errorCode={error?.code ?? "APP_ERROR"}
          errorMessage={
            error?.message ?? this.state.error?.message ?? "An unexpected error occurred"
          }
        />
      )
    }

    return this.props.children
  }
}
