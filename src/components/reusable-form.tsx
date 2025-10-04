import type { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface ReusableFormProps<T extends Record<string, any>>
  extends Omit<React.ComponentPropsWithRef<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  className?: string
}

export function ReusableForm<T extends Record<string, any>>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: ReusableFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        {children}
      </form>
    </Form>
  )
}
