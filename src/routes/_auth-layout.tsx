import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="h-dvh flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
