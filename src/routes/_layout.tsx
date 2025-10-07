import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { Home, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAuth, { isAuthenticated } from '@/hooks/use-auth'

export const Route = createFileRoute('/_layout')({
  component: Layout,
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function Layout() {
  const location = useLocation()
  const { logout } = useAuth()
  const isSettingsPage = location.pathname.includes('/settings')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">MyApp</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <Link to="/">
                  <Button
                    variant={!isSettingsPage ? 'ghost' : 'ghost'}
                    size="sm"
                    className={!isSettingsPage ? 'bg-accent' : ''}
                  >
                    <Home className="size-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant={isSettingsPage ? 'ghost' : 'ghost'}
                    size="sm"
                    className={isSettingsPage ? 'bg-accent' : ''}
                  >
                    <Settings className="size-4" />
                    Settings
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="flex items-center justify-around h-16 px-4">
          <Link to="/" className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full ${!isSettingsPage ? 'bg-accent' : ''}`}
            >
              <Home className="size-5" />
            </Button>
          </Link>
          <Link to="/settings" className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full ${isSettingsPage ? 'bg-accent' : ''}`}
            >
              <Settings className="size-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
