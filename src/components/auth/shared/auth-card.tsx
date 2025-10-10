import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  description: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const AuthCard = ({ title, description, icon, children, className }: Props) => {
  return (
    <Card>
      <CardHeader className="text-center">
        {icon && (
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={className}>{children}</CardContent>
    </Card>
  )
}
