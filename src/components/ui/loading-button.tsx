import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <Spinner />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
