import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/components/theme-provider'
import { useIsMobile } from '@/hooks/use-mobile'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position={isMobile ? 'top-center' : 'bottom-right'}
      {...props}
    />
  )
}

export { Toaster }
