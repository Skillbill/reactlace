import type { User } from '../types/user'

const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    active: true,
    role: 'admin',
    age: 30,
    activation_date: new Date('2023-01-15'),
    expiration_date: new Date('2025-01-15')
  },
  {
    id: '2',
    username: 'jane_smith',
    firstName: 'Jane',
    lastName: 'Smith',
    active: true,
    role: 'user',
    age: 28,
    activation_date: new Date('2023-03-20'),
    expiration_date: new Date('2025-03-20')
  },
  {
    id: '3',
    username: 'bob_wilson',
    firstName: 'Bob',
    lastName: 'Wilson',
    active: false,
    role: 'guest',
    age: 45,
    activation_date: new Date('2022-06-10'),
    expiration_date: new Date('2024-06-10')
  },
  {
    id: '4',
    username: 'alice_jones',
    firstName: 'Alice',
    lastName: 'Jones',
    active: true,
    role: 'user',
    age: 32,
    activation_date: new Date('2023-09-01'),
    expiration_date: new Date('2025-09-01')
  },
  {
    id: '5',
    username: 'charlie_brown',
    firstName: 'Charlie',
    lastName: 'Brown',
    active: true,
    role: 'admin',
    age: 38,
    activation_date: new Date('2026-12-05'),
    expiration_date: new Date('2027-12-05')
  }
]

let users = [...mockUsers]

export const usersStore = {
  getUsers: async (
    page: number,
    rowsPerPage: number,
    filters: unknown
  ) => {
    const typedFilters = (filters || {}) as Record<string, unknown>
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Apply filters
    let filteredUsers = [...users]

    if (typedFilters.username) {
      filteredUsers = filteredUsers.filter((u) =>
        u.username.toLowerCase().includes((typedFilters.username as string).toLowerCase())
      )
    }
    if (typedFilters.firstName) {
      filteredUsers = filteredUsers.filter((u) =>
        u.firstName.toLowerCase().includes((typedFilters.firstName as string).toLowerCase())
      )
    }
    if (typedFilters.lastName) {
      filteredUsers = filteredUsers.filter((u) =>
        u.lastName.toLowerCase().includes((typedFilters.lastName as string).toLowerCase())
      )
    }
    if (typedFilters.role) {
      filteredUsers = filteredUsers.filter((u) => u.role === typedFilters.role)
    }
    if (typedFilters.activation_date) {
      const filterDate = new Date(typedFilters.activation_date as string | Date)
      filteredUsers = filteredUsers.filter((u) => {
        if (!u.activation_date) return false
        const userDate = new Date(u.activation_date)
        return (
          userDate.getFullYear() === filterDate.getFullYear() &&
          userDate.getMonth() === filterDate.getMonth() &&
          userDate.getDate() === filterDate.getDate()
        )
      })
    }

    const startIndex = page * rowsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

    return {
      result: paginatedUsers,
      page: {
        currentPage: page,
        pageRows: rowsPerPage,
        totalRows: filteredUsers.length
      }
    }
  },

  createUser: async (item: unknown) => {
    const user = item as Partial<User>
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newUser: User = {
      id: String(Date.now()),
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      active: user.active ?? false,
      role: user.role,
      age: user.age,
      activation_date: user.activation_date,
      expiration_date: user.expiration_date
    }
    users.push(newUser)
    return newUser
  },

  updateUser: async (item: unknown) => {
    const user = item as Partial<User>
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index] = { ...users[index], ...user }
      return users[index]
    }
    return null
  },

  deleteUser: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    users = users.filter((u) => u.id !== id)
    return true
  },

  resetUsers: () => {
    users = [...mockUsers]
  }
}
