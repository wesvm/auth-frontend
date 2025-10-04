export interface User {
  id: string
  name: string
  email: string
  username: string
  role: 'user' | 'admin'
}
