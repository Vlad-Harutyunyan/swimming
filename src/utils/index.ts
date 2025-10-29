import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: string): string {
  return price.replace('Preis ', '€')
}

export function formatDuration(duration: string): string {
  return duration.replace('Minuten', 'Min')
}

export function getCourseLevel(courseId: number): 'beginner' | 'intermediate' | 'advanced' {
  switch (courseId) {
    case 1:
      return 'beginner'
    case 2:
      return 'intermediate'
    case 3:
      return 'advanced'
    default:
      return 'beginner'
  }
}

export function getBadgeType(courseId: number): 'seepferdchen' | 'bronze' | 'silver' | 'gold' {
  switch (courseId) {
    case 1:
      return 'seepferdchen'
    case 2:
      return 'bronze'
    case 3:
      return 'silver'
    default:
      return 'seepferdchen'
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
