import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AtSign, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import useAuth from '@/hooks/use-auth'
import { usersApi } from '@/lib/api/queries'
import { setFormErrors } from '@/lib/errors'
import { getDirtyValues } from '@/lib/utils'
import { type UpdateUserSchema, updateUserSchema } from '@/lib/validations/user'

export const ProfileSettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: user?.name ?? '',
      username: user?.username ?? '',
    },
  })

  const {
    formState: { dirtyFields },
  } = form

  const { mutate: updateProfile, isPending: isSaving } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateUserSchema> }) =>
      usersApi.update(id, data),
    onSuccess: (response) => {
      toast.success('Profile updated successfully')
      form.reset(form.getValues())
      queryClient.setQueryData(['auth', 'me'], response.user)
    },
    onError: (error: any) => {
      setFormErrors(error, form.setError)
    },
  })

  const onSubmit = (data: UpdateUserSchema) => {
    if (!user?.id) return

    const changedFields = getDirtyValues(data, dirtyFields)
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes were made')
      return
    }

    updateProfile({ id: String(user.id), data: changedFields })
  }

  const hasChanges = Object.keys(dirtyFields).length > 0

  return (
    <ReusableForm form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your name" disabled={isSaving} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput {...field} placeholder="Enter your username" disabled={isSaving} />
                <InputGroupAddon align="inline-start">
                  <AtSign className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isSaving || !hasChanges}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </ReusableForm>
  )
}
