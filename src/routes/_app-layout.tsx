import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { Home, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAuth, { isAuthenticated } from '@/hooks/use-auth'

export const Route = createFileRoute('/_app-layout')({
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
  const navItems = [
    { to: '/', label: 'Home', icon: Home, active: !isSettingsPage },
    { to: '/settings', label: 'Settings', icon: Settings, active: isSettingsPage },
  ]

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">MyApp</h1>
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Desktop navigation">
                {navItems.map((item) => (
                  <Button
                    key={item.to}
                    className={item.active ? 'bg-accent text-accent-foreground' : ''}
                    size="sm"
                    variant="ghost"
                    asChild
                  >
                    <Link to={item.to} className="flex-row items-center gap-2">
                      <item.icon />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pt-6 pb-24 md:py-8 max-w-2xl">
        <Outlet />
      </main>

      {/* Mobile navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => (
            <Button
              key={item.to}
              variant="ghost"
              size="lg"
              className={`flex flex-1 flex-col gap-1 ${
                item.active ? 'bg-accent text-accent-foreground' : ''
              }`}
              asChild
            >
              <Link to={item.to}>
                <item.icon className="size-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
