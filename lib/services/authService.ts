class AuthService {
  private static readonly API_BASE = 'http://localhost:8080/api/auth'

  static async signup(userData: { name: string; email: string; password: string }) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.name,
        email: userData.email,
        password: userData.password,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ')[1] || '',
        role: 'CUSTOMER'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signup failed')
    }

    const data = await response.json()
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      username: data.username,
      role: data.role
    }))
    return data
  } catch (error) {
    console.error('Signup failed:', error)
    throw error
  }
}


  static async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${this.API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          username: data.username,
          role: data.role
        }))
        return data
      }
    } catch (error) {
      console.log('Backend login failed, checking localStorage')
    }

    const usersStr = localStorage.getItem('users')
    const users = usersStr ? JSON.parse(usersStr) : []

    const user = users.find((u: any) =>
      u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const fakeToken = `fake-token-${user.id}`
    localStorage.setItem('authToken', fakeToken)
    localStorage.setItem('user', JSON.stringify({
      email: user.email,
      username: user.username,
      role: user.role
    }))

    return {
      token: fakeToken,
      email: user.email,
      username: user.username,
      role: user.role
    }
  }

  static logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken')
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default AuthService
