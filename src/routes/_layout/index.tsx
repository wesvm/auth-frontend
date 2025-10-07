import { createFileRoute } from '@tanstack/react-router'
import { Mail, ShieldUser, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAuth from '@/hooks/use-auth'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

function Index() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div>No user data</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground mt-1">Here's an overview of your account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldUser className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
