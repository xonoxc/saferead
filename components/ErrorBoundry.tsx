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
    this.setState({ hasError: true, error, errorInfo })

    const { setError } = useGlobalErrorStore.getState()
    setError({
      message: error.message || "Unknown error occurred",
      code: "UNHANDLED_EXCEPTION",
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
    console.log("Contact support triggered! 📞✨")
  }

  render() {
    const storeError = useGlobalErrorStore.getState().error
    const shouldShowErrorScreen = this.state.hasError || this.state.error || storeError

    if (shouldShowErrorScreen) {
      if (this.props.fallback) return this.props.fallback

      const errorMessage =
        storeError?.message ??
        this.state.error?.message ??
        "Something went wrong. Please try again.!"

      const errorCode = storeError?.code ?? "UNHANDLED_EXCEPTION"

      return (
        <ServerErrorScreen
          onRetry={this.handleRetry}
          onContactSupport={this.handleContactSupport}
          errorCode={errorCode}
          errorMessage={errorMessage}
        />
      )
    }

    return this.props.children
  }
}
