import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

function Index() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="p-2">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-2">
        <div>No user data</div>
      </div>
    )
  }

  return (
    <div className="p-2">
      <h3>Welcome Home, {user.name}!</h3>
      <p className="text-muted-foreground">{user.email}</p>
      <Button onClick={logout} className="mt-4">
        Logout
      </Button>
    </div>
  )
}
