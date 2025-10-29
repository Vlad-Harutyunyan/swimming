// Use relative URL to work with Vite proxy in development
// In production, set VITE_API_URL environment variable
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

// API Service for Bookings
export const bookingService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/bookings`)
    if (!response.ok) throw new Error('Failed to fetch bookings')
    return response.json()
  },

  async create(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) throw new Error('Failed to create booking')
    return response.json()
  },

  async update(id: string, bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) throw new Error('Failed to update booking')
    return response.json()
  }
}

// API Service for Feedback
export const feedbackService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/feedback`)
    if (!response.ok) throw new Error('Failed to fetch feedback')
    return response.json()
  },

  async create(feedbackData: any) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
    if (!response.ok) throw new Error('Failed to create feedback')
    return response.json()
  },

  async update(id: string, feedbackData: any) {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
    if (!response.ok) throw new Error('Failed to update feedback')
    return response.json()
  }
}

// API Service for Contacts
export const contactService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/contacts`)
    if (!response.ok) throw new Error('Failed to fetch contacts')
    return response.json()
  },

  async create(contactData: any) {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })
    if (!response.ok) throw new Error('Failed to create contact')
    return response.json()
  },

  async update(id: string, contactData: any) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })
    if (!response.ok) throw new Error('Failed to update contact')
    return response.json()
  }
}

// API Service for Courses
export const coursesService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/courses`)
    if (!response.ok) throw new Error('Failed to fetch courses')
    return response.json()
  },

  async create(course: any) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (!response.ok) throw new Error('Failed to create course')
    return response.json()
  },

  async update(id: string, course: any) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (!response.ok) throw new Error('Failed to update course')
    return response.json()
  },

  async remove(id: string) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' })
    if (!response.ok && response.status !== 204) throw new Error('Failed to delete course')
    return true
  }
}
