import React from "react"
import ServerErrorScreen from "./ErrorScreen"

interface Props {
   children: React.ReactNode
   fallback?: React.ReactNode
}

interface State {
   hasError: boolean
   error: Error | null
   errorInfo: any
}

export class ErrorBoundary extends React.Component<Props, State> {
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
   }

   handleRetry = () => {
      this.setState({
         hasError: false,
         error: null,
         errorInfo: null,
      })
   }

   handleContactSupport = () => {
      console.log("Contact support triggered! 📞✨")
   }

   render() {
      const shouldShowErrorScreen = this.state.hasError || this.state.error

      if (shouldShowErrorScreen) {
         if (this.props.fallback) return this.props.fallback

         const errorMessage =
            this.state.error?.message ?? "Something went wrong. Please try again.!"

         const errorCode = "UNEXPECTED_ERROR"

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
